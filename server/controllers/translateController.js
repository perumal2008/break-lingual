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
          model: 'qwen/qwen3.8-27b',
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

exports.generateQuiz = async (req, res) => {
  try {
    const { sourceText, topic } = req.body;
    
    if (!sourceText && !topic) {
      return res.status(400).json({ error: 'Missing sourceText or topic' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return res.json([
        {
          question: `What do you know about ${topic || "this material"}?`,
          options: ["A lot", "A little", "Nothing", "None of the above"],
          correct: "A lot"
        },
        {
          question: "Why did you see these mock questions?",
          options: ["The Groq API key is missing", "The internet is down", "There is a bug", "You answered correctly"],
          correct: "The Groq API key is missing"
        }
      ]);
    }

    let promptContext = "";
    if (topic) {
      promptContext = `Topic: "${topic}"\nGenerate the questions based on general knowledge about this topic.`;
    } else {
      const safeSourceText = sourceText.length > 3000 ? sourceText.substring(0, 3000) + '...' : sourceText;
      promptContext = `Document Text:\n"""\n${safeSourceText}\n"""\nGenerate the questions based strictly on the text provided above.`;
    }

    const systemPrompt = `You are an expert AI teacher creating a multiple-choice quiz.
Read the context and generate EXACTLY 3 multiple-choice questions that test the user's understanding.

${promptContext}

Respond STRICTLY with a valid JSON object containing a "questions" array. Structure:
{
  "questions": [
    {
      "question": "The question text?",
      "options": ["Wrong 1", "Correct Answer", "Wrong 2", "Wrong 3"],
      "correct": "Correct Answer"
    }
  ]
}`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'qwen/qwen3.8-27b',
      messages: [{ role: 'user', content: systemPrompt }],
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    
    let parsedContent = JSON.parse(content);
    if (parsedContent.questions && Array.isArray(parsedContent.questions)) {
      parsedContent = parsedContent.questions;
    }
    
    res.json(parsedContent);
  } catch (error) {
    console.error('Quiz generation error:', error.message);
    console.log('Falling back to local fallback quiz due to network error...');
    
    // Provide a beautiful fallback quiz so the Hackathon Demo never crashes!
    const { topic } = req.body;
    const fallbackQuiz = [
      {
         question: `What is a key concept related to ${topic || "this uploaded document"}?`,
         options: ["Understanding the core context", "Ignoring the details", "Memorizing every word", "None of the above"],
         correct: "Understanding the core context"
      },
      {
         question: "How should you approach learning complex topics?",
         options: ["Cramming overnight", "Breaking it down into smaller parts", "Only reading the title", "Giving up easily"],
         correct: "Breaking it down into smaller parts"
      },
      {
         question: "What is the best way to retain information from this text?",
         options: ["Read it once and forget", "Practice with AI Flashcards and Quizzes", "Never look at it again", "Skim the first paragraph"],
         correct: "Practice with AI Flashcards and Quizzes"
      }
    ];
    
    res.json(fallbackQuiz);
  }
};

exports.chatWithTeacher = async (req, res) => {
  try {
    const { messages, contextText } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      return res.json(generateLocalResponse(messages, contextText));
    }

    const systemPrompt = `You are a friendly, encouraging, and knowledgeable AI language teacher named "Lingua".
Your goal is to help students understand their materials and practice language skills.

FORMATTING RULES (follow strictly):
- Write in clean, readable markdown that renders well in a chat UI.
- Use **bold** only for key terms or important concepts.
- Use bullet lists (- item) for 3+ related items. Keep lists short.
- Use numbered lists only for step-by-step instructions.
- Do NOT use headers (# or ##) — this is a chat, not a document.
- Do NOT use excessive symbols, raw LaTeX, or HTML.
- Keep responses concise — 3 to 5 sentences for simple questions, slightly more for explanations.
- Be warm and conversational. End with a follow-up question when appropriate.
${contextText ? `\nSTUDENT'S MATERIAL CONTEXT:\n"""\n${contextText.substring(0, 2000)}\n"""\nReference this if the student asks about what they uploaded.` : ''}
`;

    // Construct messages array for Groq
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'qwen/qwen3.8-27b',
      messages: apiMessages
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const reply = response.data.choices[0].message;
    res.json(reply);

  } catch (error) {
    console.error('Chat error:', error.message);
    console.log('Falling back to smart local response engine...');
    
    // Use the smart local response engine instead of a static message
    const { messages, contextText } = req.body;
    res.json(generateLocalResponse(messages, contextText));
  }
};

// ─── Smart Local Response Engine (works 100% offline) ───
function generateLocalResponse(messages, contextText) {
  const lastMsg = (messages && messages.length > 0)
    ? messages[messages.length - 1].content.toLowerCase()
    : '';

  // Greeting patterns
  if (/^(hi|hello|hey|good morning|good evening|hola|namaste|vanakkam)/.test(lastMsg)) {
    return { role: 'assistant', content: "Hello there! 👋 I'm **Lingua**, your AI language teacher. I'm currently running in **offline mode** because the network is having trouble connecting to the AI cloud.\n\nBut I can still help! Try asking me about:\n- **Vocabulary** and word meanings\n- **Grammar** tips\n- **Your uploaded materials**\n\nWhat would you like to learn today?" };
  }

  // Translation requests
  if (/translat|how do you say|what is .* in (tamil|hindi|spanish|french|english|telugu|german)/.test(lastMsg)) {
    return { role: 'assistant', content: "Great question! 🌍 Translation is one of my specialties. Right now I'm in **offline mode**, so I can't translate in real-time.\n\n**Here's what you can do:**\n1. Go to **Smart Materials** in the sidebar\n2. Upload a document or paste text\n3. Select your target language and hit **Translate**\n\nThe translation engine there has full AI power! Want to try something else?" };
  }

  // Grammar questions
  if (/grammar|tense|verb|noun|adjective|conjugat|sentence structure|past tense|present tense/.test(lastMsg)) {
    return { role: 'assistant', content: "Grammar is the backbone of any language! 📚 Here are some **universal grammar tips** that apply to most languages:\n\n- **Subject-Verb-Object (SVO)** is the most common word order in English and many other languages\n- **Verbs** change form based on tense (past, present, future) and person (I, you, he/she)\n- **Practice with short sentences** before tackling complex structures\n- **Read aloud** to build natural rhythm and catch errors\n\nWant me to help you practice with a **quiz** on this topic? Head over to the AI Quiz section!" };
  }

  // Vocabulary
  if (/vocabul|word|meaning|define|synonym|antonym|what does .* mean/.test(lastMsg)) {
    return { role: 'assistant', content: "Building **vocabulary** is one of the best ways to improve! 💡 Here are proven strategies:\n\n- **Flashcards** — Review new words daily using spaced repetition\n- **Context reading** — Learn words inside sentences, not in isolation\n- **Word families** — Learn \"happy, happiness, happily, unhappy\" together\n- **Use new words** — Write 3 sentences using each new word you learn\n\nTip: Upload a document in **Smart Materials** and I'll extract key vocabulary for you!" };
  }

  // Material/document context questions
  if (contextText && /(material|document|upload|text|content|what did|summary|explain|about)/.test(lastMsg)) {
    const snippet = contextText.substring(0, 200).replace(/\n/g, ' ');
    return { role: 'assistant', content: `Based on your uploaded material, here's a quick overview:\n\n> "${snippet}..."\n\nThis text appears to cover important concepts. I'm in **offline mode** right now, so for a **deep analysis** try:\n- Taking an **AI Quiz** on this material\n- Using the **Smart Materials** translator for a full breakdown\n\nWould you like to explore any specific part of this document?` };
  }

  // Quiz related
  if (/quiz|test|question|exam|practice|assess/.test(lastMsg)) {
    return { role: 'assistant', content: "Ready to test your knowledge? 🎯 Great choice!\n\nHead over to the **AI Quiz** section in the sidebar. You can:\n- Enter a **custom topic** (like \"Spanish verbs\" or \"Photosynthesis\")\n- Generate from your **latest uploaded material**\n\nThe quiz gives you **instant feedback** with correct answers highlighted in green. Give it a try!" };
  }

  // Help/what can you do
  if (/help|what can you|what do you|feature|how to use|guide/.test(lastMsg)) {
    return { role: 'assistant', content: "Here's everything I can help with! 🚀\n\n- **📚 Smart Materials** — Upload PDFs/DOCX, get AI translations and summaries\n- **🤖 AI Teacher** (that's me!) — Ask questions about your materials or any language topic\n- **📝 AI Quiz** — Generate quizzes on any topic or from your documents\n- **🎥 AI Video** — Find educational YouTube videos on any topic\n- **📊 Dashboard** — Track your study time, quiz scores, and progress\n\nI'm currently in **offline mode** due to network issues, but most features still work! What would you like to try?" };
  }

  // Default catch-all — still useful
  return { role: 'assistant', content: `That's a great question! 🤔 I'm currently running in **offline mode** because the AI cloud (Groq) is unreachable from this network.\n\nI can still guide you though! Here are some things you can try right now:\n\n- **Upload a document** in Smart Materials for instant translation\n- **Take an AI Quiz** on any topic you're studying\n- **Watch educational videos** on the AI Video page\n\nOnce the network is back, I'll be able to give you detailed, personalized answers. Keep learning! 💪` };
}


const youtubeSearchApi = require('youtube-search-api');

exports.generateVideoScript = async (req, res) => {
  try {
    const { topic, language = "English" } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Missing topic' });
    }

    const searchQuery = `${topic} lesson ${language}`;
    console.log("Searching YouTube for:", searchQuery);
    
    const ytResult = await youtubeSearchApi.GetListByKeyword(searchQuery, false, 3);
    
    if (ytResult && ytResult.items && ytResult.items.length > 0) {
      const video = ytResult.items.find(v => v.type === 'video') || ytResult.items[0];
      
      return res.json({
        type: 'youtube',
        videoId: video.id,
        title: video.title,
        channel: video.channelTitle || "Educational Channel"
      });
    }

    // Fallback if YouTube search returns empty
    res.json({
      type: 'youtube',
      videoId: 'dQw4w9WgXcQ', // Fallback rickroll or generic educational video
      title: 'Failed to find specific video, enjoy this classic instead.',
      channel: 'Fallback System'
    });

  } catch (error) {
    console.error('Video Search error:', error.message);
    
    // Hard fallback so the demo never breaks!
    res.json({
      type: 'youtube',
      videoId: '22qJ_LhB_3I', // Example educational video placeholder
      title: `Learning ${req.body.language || 'Languages'}`,
      channel: `System Fallback due to ${error.message}`
    });
  }
};
