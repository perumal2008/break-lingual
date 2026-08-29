const TranslationHistory = require('../models/TranslationHistory');
const Flashcard = require('../models/Flashcard');

const axios = require('axios');

exports.translateText = async (req, res) => {
  try {
    const { sourceText, language } = req.body;

    if (!sourceText || !language) {
      return res.status(400).json({ error: 'Missing sourceText or language' });
    }

    const LATENTSTACK_API_KEY = process.env.LATENTSTACK_API_KEY;
    const LATENTSTACK_URL = process.env.LATENTSTACK_URL || 'https://api.latentstack.dev/v1/chat/completions';

    let apiResult;

    if (LATENTSTACK_API_KEY) {
      console.log('Calling LatentStack API...');
      const prompt = `You are an expert AI language teacher. 
      Analyze the following text: "${sourceText}".
      Target Language to translate to: ${language}.
      
      Respond STRICTLY with valid JSON. Do not include markdown formatting like \`\`\`json.
      Structure:
      {
        "translatedText": "Full translation in ${language}",
        "summary": "Brief summary of what the text is about",
        "breakdown": [ {"word": "word1", "pos": "Noun", "meaning": "meaning1"} ],
        "flashcards": [ {"word": "word1", "definition": "def1", "sampleSentence": "sentence", "partOfSpeech": "Noun"} ]
      }`;

      try {
        const response = await axios.post(LATENTSTACK_URL, {
          model: process.env.LATENTSTACK_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }]
        }, {
          headers: {
            'Authorization': `Bearer ${LATENTSTACK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        const content = response.data.choices[0].message.content;
        // Clean markdown if the model ignored instructions
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        apiResult = JSON.parse(cleanContent);
        apiResult.originalText = sourceText;
      } catch (err) {
        console.error('LatentStack API Error:', err.response?.data || err.message);
        throw new Error('LatentStack API failed');
      }
    } else {
      console.log('No LatentStack API Key found. Using mock fallback.');
      // Mock API translation logic with fallback
      apiResult = {
        originalText: sourceText,
        translatedText: `[Mock Translation to ${language}]: ${sourceText.split('').reverse().join('')}`,
        summary: `This is an AI generated summary of the material. It contains concepts related to your selected language (${language}).`,
        breakdown: [
          { word: "Example", pos: "Noun", meaning: "A representative form" },
          { word: "Hackathon", pos: "Noun", meaning: "An event for coding" }
        ],
        flashcards: [
          { word: "Resilient", definition: "Able to withstand or recover quickly.", sampleSentence: "The resilient team finished the hackathon.", partOfSpeech: "Adjective" },
          { word: "Innovate", definition: "Make changes in something established.", sampleSentence: "We need to innovate to win.", partOfSpeech: "Verb" }
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
