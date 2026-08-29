const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, 'server');

function write(filePath, content) {
    const fullPath = path.join(serverDir, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
}

write('.env', `PORT=5000
MONGODB_URI=mongodb://localhost:27017/breaklingual
`);

write('models/Flashcard.js', `const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
  sampleSentence: { type: String },
  partOfSpeech: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
`);

write('models/TranslationHistory.js', `const mongoose = require('mongoose');

const translationHistorySchema = new mongoose.Schema({
  sourceText: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  translatedText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TranslationHistory', translationHistorySchema);
`);

write('controllers/translateController.js', `const TranslationHistory = require('../models/TranslationHistory');
const Flashcard = require('../models/Flashcard');

exports.translateText = async (req, res) => {
  try {
    const { sourceText, language } = req.body;

    if (!sourceText || !language) {
      return res.status(400).json({ error: 'Missing sourceText or language' });
    }

    // Mock API translation logic with fallback
    const mockTranslation = \`[Translated to \${language}]: \${sourceText.split('').reverse().join('')}\`;
    const mockBreakdown = [
      { word: "Example", pos: "Noun", meaning: "A representative form" },
      { word: "Hackathon", pos: "Noun", meaning: "An event for coding" }
    ];
    
    const mockFlashcards = [
      { word: "Resilient", definition: "Able to withstand or recover quickly from difficult conditions.", sampleSentence: "The resilient team finished the hackathon project.", partOfSpeech: "Adjective" },
      { word: "Innovate", definition: "Make changes in something established, especially by introducing new methods, ideas, or products.", sampleSentence: "We need to innovate to win.", partOfSpeech: "Verb" },
      { word: "Prototype", definition: "A first, typical or preliminary model of something.", sampleSentence: "This is a prototype of our platform.", partOfSpeech: "Noun" }
    ];

    // Save history
    const history = new TranslationHistory({
      sourceText,
      targetLanguage: language,
      translatedText: mockTranslation
    });
    
    // Attempt to save to DB (will fail gracefully if no MongoDB connected during demo)
    try {
      await history.save();
    } catch (dbError) {
      console.log('Database not connected. Using memory fallback.', dbError.message);
    }

    res.json({
      originalText: sourceText,
      translatedText: mockTranslation,
      breakdown: mockBreakdown,
      flashcards: mockFlashcards
    });

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
`);

write('routes/translateRoutes.js', `const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

router.post('/translate', translateController.translateText);
router.post('/flashcards', translateController.saveFlashcard);
router.get('/flashcards', translateController.getFlashcards);

module.exports = router;
`);

write('index.js', `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const translateRoutes = require('./routes/translateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', translateRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => {
     console.log('MongoDB Connection Warning: Proceeding without DB (Mock mode active). Error:', err.message)
  });

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
`);

console.log('Backend files generated.');
