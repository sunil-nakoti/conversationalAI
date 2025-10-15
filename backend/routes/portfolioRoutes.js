const express = require('express');
const { getPortfolios, updatePortfolio, getLaunchConfig, mapHeaders } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getPortfolios);
router.route('/:id').put(protect, updatePortfolio);
router.route('/launch-config').get(protect, getLaunchConfig);
router.route('/map-headers').post(protect, mapHeaders);

module.exports = router;
