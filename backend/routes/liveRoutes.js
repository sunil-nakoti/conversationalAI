const express = require('express');
const { getLiveUpdates } = require('../controllers/liveController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/updates').get(protect, getLiveUpdates);

module.exports = router;
