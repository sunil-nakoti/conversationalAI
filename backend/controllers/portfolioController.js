const Portfolio = require('../models/Portfolio');
const BrandingProfile = require('../models/BrandingProfile');

// Mock data as models for these are not created in this step
const playbooks = [
    { id: 'pb_empathy', name: 'Empathy First - Hardship v2' },
    { id: 'pb_assertive', name: 'Direct Assertive Follow-up v4' },
    { id: 'pb_settlement', name: 'Settlement Offer - 50%' },
];
const phoneNumbers = [
    { id: 'pn1', number: '+1 (415) 555-0100', status: 'active', healthScore: 92, callsLastHour: 12, lastUsedTimestamp: Date.now() - 300000 },
    { id: 'pn2', number: '+1 (415) 555-0101', status: 'active', healthScore: 85, callsLastHour: 8, lastUsedTimestamp: Date.now() - 600000 },
    { id: 'pn3', number: '+1 (415) 555-0102', status: 'cooldown', healthScore: 45, callsLastHour: 25, lastUsedTimestamp: Date.now() - 3700000 },
];
const aiAgents = [
    { id: 'zephyr', name: 'Zephyr', description: 'Warm, Empathetic' },
    { id: 'kore', name: 'Kore', description: 'Professional, Clear' },
    { id: 'puck', name: 'Puck', description: 'Calm, Reassuring' },
    { id: 'charon', name: 'Charon', description: 'Deep, Authoritative' },
];

// @desc    Get all portfolios
// @route   GET /api/portfolios
// @access  Private
exports.getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({});
    res.status(200).json({ success: true, data: portfolios });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


// @desc    Get data needed for the launch campaign component
// @route   GET /api/portfolios/launch-config
// @access  Private
exports.getLaunchConfig = async (req, res, next) => {
  try {
    const brandingProfiles = await BrandingProfile.find({});
    const data = {
        playbooks,
        phoneNumbers,
        aiAgents,
        brandingProfiles
    };
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
