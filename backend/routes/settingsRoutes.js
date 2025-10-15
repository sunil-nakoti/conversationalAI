const express = require('express');
const { getSettings, updateSettings, getBillingData } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getSettings).put(protect, updateSettings);
router.route('/billing').get(protect, getBillingData);

module.exports = router;
