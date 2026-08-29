const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
  sampleSentence: { type: String },
  partOfSpeech: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
