const express = require('express');
const { getPortfolios, getLaunchConfig } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getPortfolios);
router.route('/launch-config').get(protect, getLaunchConfig);

module.exports = router;
