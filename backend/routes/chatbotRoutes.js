const express = require('express');
const { postMessage } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/message', protect, postMessage);

module.exports = router;
