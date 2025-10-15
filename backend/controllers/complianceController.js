const JurisdictionRule = require('../models/JurisdictionRule');
const BrandingProfile = require('../models/BrandingProfile');
// NOTE: Phone pool models not created, returning mock data for now.
const phonePool = []; 
const numberPools = [];

// @desc    Get all compliance data
// @route   GET /api/compliance
// @access  Private
exports.getComplianceData = async (req, res, next) => {
  try {
    const jurisdictionRules = await JurisdictionRule.find({});
    const brandingProfiles = await BrandingProfile.find({});
    
    res.status(200).json({
      success: true,
      data: {
        jurisdictionRules,
        phonePool,
        numberPools,
        brandingProfiles
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get all branding profiles
// @route   GET /api/compliance/branding-profiles
// @access  Private
exports.getBrandingProfiles = async (req, res, next) => {
  try {
    const brandingProfiles = await BrandingProfile.find({});
    res.status(200).json({ success: true, data: brandingProfiles });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get settings-related data
// @route   GET /api/compliance/settings
// @access  Private
exports.getSettingsData = async (req, res, next) => {
  try {
    // Mock data for settings page widgets
    const settingsData = {
        billingLog: [],
        accountCredits: 500.00,
        resilienceStatus: { lastBackup: new Date().toISOString(), drStatus: 'Active-Active', replicationLag: 5, estimatedRTO: 'Approx. 5 minutes' },
        proposedRuleUpdates: [],
    };
    res.status(200).json({ success: true, data: settingsData });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
