const express = require('express');
const { getComplianceData, getBrandingProfiles, checkReputation, researchUpdates } = require('../controllers/complianceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getComplianceData);
router.route('/branding-profiles').get(protect, getBrandingProfiles);
router.route('/check-reputation').post(protect, checkReputation);
router.route('/research-updates').post(protect, researchUpdates);

module.exports = router;
