const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

router.post('/translate', translateController.translateText);
router.post('/flashcards', translateController.saveFlashcard);
router.get('/flashcards', translateController.getFlashcards);

module.exports = router;
