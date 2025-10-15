const express = require('express');
const { getAgents, getMissions, getIntelligenceData } = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getAgents);
router.route('/missions').get(protect, getMissions);
router.route('/intelligence').get(protect, getIntelligenceData);


module.exports = router;
