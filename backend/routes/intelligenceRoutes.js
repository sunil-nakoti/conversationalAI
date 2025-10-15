const express = require('express');
const { getIntelligenceData, updateNegotiationModels, updateObjections } = require('../controllers/intelligenceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getIntelligenceData);
router.route('/negotiation-models').put(protect, updateNegotiationModels);
router.route('/objections').put(protect, updateObjections);
// Add more CRUD routes for other intelligence items like objections, sms templates etc.

module.exports = router;
