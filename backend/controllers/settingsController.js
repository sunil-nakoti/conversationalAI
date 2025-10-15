const Setting = require('../models/Setting');
const ProposedRuleUpdate = require('../models/ProposedRuleUpdate');

// @desc    Get settings for a user
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Setting.findOne({ user: req.user.id });
        if (!settings) {
            settings = await Setting.create({ user: req.user.id });
        }
        
        const proposedRuleUpdates = await ProposedRuleUpdate.find({ status: 'pending' });

        res.status(200).json({ success: true, data: { ...settings.toObject(), proposedRuleUpdates } });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update settings for a user
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
    try {
        const settings = await Setting.findOneAndUpdate({ user: req.user.id }, req.body, {
            new: true,
            runValidators: true,
            upsert: true
        });
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};


// @desc    Get billing and resilience data
// @route   GET /api/settings/billing
// @access  Private
exports.getBillingData = async (req, res, next) => {
    try {
        // Mock data for this example
        const data = {
            billingLog: [], // In real app, fetch from a collection or service
            resilienceStatus: { 
                lastBackup: new Date().toISOString(), 
                drStatus: 'Active-Active', 
                replicationLag: 5, 
                estimatedRTO: 'Approx. 5 minutes' 
            },
        };
        res.status(200).json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
}
