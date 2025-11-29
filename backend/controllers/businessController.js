const Business = require('../models/Business');

// @desc    Get business data for the logged-in user
// @route   GET /api/business
// @access  Private
exports.getBusinessData = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({ success: false, msg: 'Business not found' });
    }

    res.status(200).json({ success: true, data: business });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

// @desc    Update bot configuration for the logged-in user
// @route   PUT /api/business/bot-config
// @access  Private
exports.updateBotConfiguration = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(404).json({ success: false, msg: 'Business not found' });
    }

    business.botConfiguration = { ...business.botConfiguration, ...req.body };
    await business.save();

    res.status(200).json({ success: true, data: business.botConfiguration });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};
