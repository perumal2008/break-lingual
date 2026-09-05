const express = require('express');
const router = express.Router();
const multer = require('multer');
const translateController = require('../controllers/translateController');

// Configure multer to store files in memory for quick processing
const upload = multer({ storage: multer.memoryStorage() });

router.post('/translate', upload.single('file'), translateController.translateText);
router.post('/flashcards', translateController.saveFlashcard);
router.get('/flashcards', translateController.getFlashcards);
router.post('/quiz/generate', translateController.generateQuiz);
router.post('/chat', translateController.chatWithTeacher);
router.post('/video/script', translateController.generateVideoScript);
router.post('/image/generate', translateController.generateImage);

module.exports = router;
