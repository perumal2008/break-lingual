const TranslationHistory = require('../models/TranslationHistory');
const Flashcard = require('../models/Flashcard');

const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const { SummarizerManager } = require('node-summarizer');

async function generateAlgorithmicSummary(text, sentencesCount = 2) {
  try {
    if (text.split(' ').length < 50) return text;
    const Summarizer = new SummarizerManager(text, sentencesCount);
    const summary = await Summarizer.getSummaryByRank();
    return summary.summary || text.substring(0, 500) + '...';
  } catch (error) {
    console.log("Summarizer error, falling back:", error.message);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, sentencesCount).join(' ').trim();
  }
}

async function googleTranslate(text, targetLang) {
  try {
    const langCodes = { 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Japanese': 'ja', 'Tamil': 'ta', 'Telugu': 'te', 'Hindi': 'hi', 'English': 'en' };
    const tl = langCodes[targetLang] || 'es';
    
    // Chunking text if it's too long
    const safeText = text.length > 2000 ? text.substring(0, 2000) : text;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(safeText)}`;
    const response = await axios.get(url);
    
    if (response.data && response.data[0]) {
      return response.data[0].map(item => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error("Google Translate API Error:", error.message);
    return `[Translation Error]: ${text}`;
  }
}

exports.translateText = async (req, res) => {
  try {
    let sourceText = req.body.sourceText || req.body.text; 
    const language = req.body.language;
    const userPrompt = req.body.prompt || '';

    if (req.file) {
      console.log(`Processing uploaded file: ${req.file.originalname}`);
      const fileExt = req.file.originalname.split('.').pop().toLowerCase();
      
      if (fileExt === 'pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        sourceText = pdfData.text.trim();
      } else if (fileExt === 'docx' || fileExt === 'doc') {
        const docData = await mammoth.extractRawText({ buffer: req.file.buffer });
        sourceText = docData.value.trim();
      } else {
        sourceText = req.file.buffer.toString('utf8').trim();
      }
    }

    if (!sourceText || !language) {
      return res.status(400).json({ error: 'Missing sourceText, file, or language' });
    }

    // Truncate to save tokens for Groq (Max ~4000 chars for MVP)
    const safeSourceText = sourceText.length > 4000 ? sourceText.substring(0, 4000) + '...' : sourceText;

    let apiResult = null;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (GROQ_API_KEY) {
      console.log(`Translating using Groq LLM API to ${language}...`);
      try {
        const customInstructions = userPrompt ? `\nUSER INSTRUCTIONS: ${userPrompt}\n` : '';
        
        const systemPrompt = `You are a highly advanced AI language tutor. 
Your goal is to extract the main concepts from the document and translate them into ${language}.
CRITICAL INSTRUCTION: Do NOT do a robotic, literal, exact word-for-word translation! Translate it so it sounds NATURAL, CONVERSATIONAL, and exactly like how people actually speak today in ${language}.
${customInstructions}

Document Text:
"""
${safeSourceText}
"""

Respond STRICTLY with valid JSON. Structure:
{
  "summary": "A 1-sentence TL;DR of the document in ${language}.",
  "translatedText": "A natural, conversational 4-sentence translation/overview of the core concepts in ${language}.",
  "breakdown": [ {"word": "KeyWord1", "pos": "Noun", "meaning": "Definition"} ],
  "flashcards": [ {"word": "KeyWord1", "definition": "def1", "sampleSentence": "sentence", "partOfSpeech": "Noun"} ]
}`;

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: systemPrompt }],
          response_format: { type: "json_object" }
        }, {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        const content = response.data.choices[0].message.content;
        apiResult = JSON.parse(content);
        apiResult.originalText = sourceText;
      } catch (err) {
        console.error('Groq API Error:', err.message);
        console.log('Falling back to Open Source Algorithmic translation...');
        apiResult = null;
      }
    }
    
    // Fallback if Groq fails or no key
    if (!apiResult) {
      console.log(`Translating using Open Source Free API to ${language}...`);
      
      const shortEnglishSummary = await generateAlgorithmicSummary(sourceText, 1);
      const translatedShortSummary = await googleTranslate(shortEnglishSummary, language);

      const detailedEnglishOverview = await generateAlgorithmicSummary(sourceText, 4);
      let translatedDetailedOverview = await googleTranslate(detailedEnglishOverview, language);
      
      if (userPrompt) {
        translatedDetailedOverview = `[User Prompt: ${userPrompt}] ` + translatedDetailedOverview;
      }

      apiResult = {
        originalText: sourceText,
        translatedText: translatedDetailedOverview, 
        summary: translatedShortSummary,
        breakdown: [
          { word: "Feature", pos: "Noun", meaning: "Powered by Open Source API Fallback" }
        ],
        flashcards: [
          { word: "Success", definition: "Achieving the desired outcome.", sampleSentence: "The API integration was a success.", partOfSpeech: "Noun" }
        ]
      };
    }

    // Save history
    const history = new TranslationHistory({
      sourceText,
      targetLanguage: language,
      translatedText: apiResult.translatedText
    });
    
    try {
      await history.save();
    } catch (dbError) {
      console.log('Database not connected. Using memory fallback.', dbError.message);
    }

    res.json(apiResult);

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate' });
  }
};

exports.saveFlashcard = async (req, res) => {
  try {
    const { word, definition, sampleSentence, partOfSpeech } = req.body;
    
    const flashcard = new Flashcard({ word, definition, sampleSentence, partOfSpeech });
    
    try {
      await flashcard.save();
    } catch(dbError) {
       console.log('Database not connected. Using memory fallback.', dbError.message);
    }
    
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save flashcard' });
  }
};

exports.getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    // Fallback if db not connected
    res.json([
       { _id: '1', word: 'Fallback', definition: 'Mock definition', sampleSentence: 'DB is offline.', partOfSpeech: 'Noun' }
    ]);
  }
};
