const express = require('express');
const router = express.Router();
const { getBusinessData, updateBotConfiguration } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBusinessData);
router.route('/bot-config').put(protect, updateBotConfiguration);

module.exports = router;
