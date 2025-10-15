const GoldenScript = require('../models/GoldenScript');
const NegotiationModel = require('../models/NegotiationModel');
const Objection = require('../models/Objection');
const SmsTemplate = require('../models/SmsTemplate');
const CallReport = require('../models/CallReport');

// @desc    Get all intelligence data for a user
// @route   GET /api/intelligence
// @access  Private
exports.getIntelligenceData = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };

        const [
            goldenScripts,
            negotiationModels,
            objections,
            smsTemplates,
            callReports
        ] = await Promise.all([
            GoldenScript.find(query),
            NegotiationModel.find(query),
            Objection.find(query),
            SmsTemplate.find(query),
            CallReport.find(query)
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                goldenScripts,
                negotiationModels,
                objections,
                smsTemplates,
                callReports
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update negotiation models for a user
// @route   PUT /api/intelligence/negotiation-models
// @access  Private
exports.updateNegotiationModels = async (req, res, next) => {
    try {
        const models = req.body;
        // In a real app, you'd do more robust validation and updating
        // For now, we'll clear and replace for simplicity
        await NegotiationModel.deleteMany({ user: req.user.id });
        const modelsWithUser = models.map(m => ({ ...m, user: req.user.id }));
        const newModels = await NegotiationModel.create(modelsWithUser);
        
        res.status(200).json({ success: true, data: newModels });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update objections for a user
// @route   PUT /api/intelligence/objections
// @access  Private
exports.updateObjections = async (req, res, next) => {
    try {
        const objections = req.body;
        // This is a simple replace, more robust logic would be needed for a real app
        await Objection.deleteMany({ user: req.user.id });
        const objectionsWithUser = objections.map(o => ({ ...o, user: req.user.id, _id: undefined }));
        const newObjections = await Objection.create(objectionsWithUser);
        
        res.status(200).json({ success: true, data: newObjections });
    } catch (err) {
        console.error('Error updating objections:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
