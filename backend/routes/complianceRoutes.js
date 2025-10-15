const express = require('express');
const { getComplianceData, getSettingsData, getBrandingProfiles } = require('../controllers/complianceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getComplianceData);
router.route('/settings').get(protect, getSettingsData);
router.route('/branding-profiles').get(protect, getBrandingProfiles);

module.exports = router;
