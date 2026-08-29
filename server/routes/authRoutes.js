const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/social', authController.socialLogin);

module.exports = router;
