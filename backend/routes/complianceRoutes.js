const express = require('express');
const { 
    getComplianceData, 
    getBrandingProfiles, 
    checkReputation, 
    researchUpdates,
    updateJurisdictionRules, // Import the new controller
    updateBrandingProfiles,
    getStateManagement,
    updateStateManagement,
    updatePhoneNumber,
    createEmergingRisk
} = require('../controllers/complianceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getComplianceData);
router.route('/branding-profiles').get(protect, getBrandingProfiles).put(protect, updateBrandingProfiles);
router.route('/check-reputation').post(protect, checkReputation);
router.route('/research-updates').post(protect, researchUpdates);

// Add the new route for updating rules
router.route('/jurisdiction-rules').put(protect, updateJurisdictionRules);

// Add the new routes for state management
router.route('/state-management').get(protect, getStateManagement).put(protect, updateStateManagement);

// Add the new route for updating a phone number
router.route('/phone-numbers/:id').put(protect, updatePhoneNumber);

// Add the new route for creating an emerging risk
router.route('/emerging-risks').post(protect, createEmergingRisk);

module.exports = router;
