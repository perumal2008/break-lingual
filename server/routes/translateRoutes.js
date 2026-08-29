const express = require('express');
const router = express.Router();
const multer = require('multer');
const translateController = require('../controllers/translateController');

// Configure multer to store files in memory for quick processing
const upload = multer({ storage: multer.memoryStorage() });

router.post('/translate', upload.single('file'), translateController.translateText);
router.post('/flashcards', translateController.saveFlashcard);
router.get('/flashcards', translateController.getFlashcards);

module.exports = router;
