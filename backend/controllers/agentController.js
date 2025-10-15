const AIAgent = require('../models/AIAgent');
// NOTE: Mission model is not created in this step, returning mock data for now.
const missions = []; 
const goldenScripts = [];
const negotiationModels = [];

// @desc    Get all AI agents
// @route   GET /api/agents
// @access  Private
exports.getAgents = async (req, res, next) => {
  try {
    const agents = await AIAgent.find({});
    res.status(200).json({ success: true, data: agents });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get all missions
// @route   GET /api/agents/missions
// @access  Private
exports.getMissions = async (req, res, next) => {
  try {
    // In a real app, this would fetch from a Mission model
    res.status(200).json({ success: true, data: missions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get intelligence data (scripts, models)
// @route   GET /api/agents/intelligence
// @access  Private
exports.getIntelligenceData = async (req, res, next) => {
  try {
    // In a real app, this would fetch from respective models
    res.status(200).json({ success: true, data: { goldenScripts, negotiationModels } });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
