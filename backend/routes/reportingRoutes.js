const express = require('express');
const { getReportingData } = require('../controllers/reportingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getReportingData);

module.exports = router;
