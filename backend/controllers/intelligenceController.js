console.log('[Controller] Loading intelligenceController.js...');
const GoldenScript = require('../models/GoldenScript');
const NegotiationModel = require('../models/NegotiationModel');
const Objection = require('../models/Objection');
const SmsTemplate = require('../models/SmsTemplate');
const CallReport = require('../models/CallReport');
const Playbook = require('../models/Playbook');
const AiObjectionSuggestion = require('../models/AiObjectionSuggestion');

// @desc    Get all intelligence data for a user
// @route   GET /api/intelligence
// @access  Private
exports.getIntelligenceData = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };

        const mockPlaybooks = [
    {
        id: 'playbook_zephyr',
        name: 'Zephyr - Empathy First',
        agentId: 'zephyr',
        nodes: [
            { id: 'start-call-1', type: 'start-call', label: 'Start Call', icon: 'call', position: { x: 50, y: 150 }, settings: { openingMessage: 'Hello, may I please speak with {debtor.fullname}? This is a call from a debt collector.' } },
            { id: 'mini-miranda-1', type: 'mini-miranda', label: 'Deliver Disclosure', icon: 'gavel', position: { x: 250, y: 150 }, settings: {} },
            { id: 'end-1', type: 'end', label: 'End Playbook', icon: 'check', position: { x: 450, y: 150 }, settings: {} },
        ],
        edges: [
            { id: 'e1-2', source: 'start-call-1', target: 'mini-miranda-1' },
            { id: 'e2-3', source: 'mini-miranda-1', target: 'end-1' },
        ],
    },
    {
        id: 'playbook_kore',
        name: 'Kore - Direct Assertive',
        agentId: 'kore',
        nodes: [
            { id: 'start-call-k1', type: 'start-call', label: 'Start Call', icon: 'call', position: { x: 50, y: 100 }, settings: { openingMessage: 'Hello {debtor.fullname}. This is a debt collector. I am calling regarding your account with {debtor.originalcreditor}.' } },
            { id: 'negotiate-k1', type: 'payment-negotiation', label: 'Payment Negotiation', icon: 'dollar', position: { x: 250, y: 100 }, settings: {} },
            { id: 'sms-k1', type: 'sms', label: 'Send SMS', icon: 'sms', settings: { message: 'Thank you for your payment arrangement.' }, position: { x: 450, y: 100 } },
            { id: 'end-k1', type: 'end', label: 'End Playbook', icon: 'check', position: { x: 650, y: 100 }, settings: {} },
        ],
        edges: [
            { id: 'ek1-2', source: 'start-call-k1', target: 'negotiate-k1' },
            { id: 'ek2-3', source: 'negotiate-k1', target: 'sms-k1' },
            { id: 'ek3-4', source: 'sms-k1', target: 'end-k1' },
        ],
    },
];

        let [
            goldenScripts,
            negotiationModels,
            objections,
            smsTemplates,
            callReports,
            playbooks,
            aiObjectionSuggestions
        ] = await Promise.all([
            GoldenScript.find(query),
            NegotiationModel.find(query),
            Objection.find(query),
            SmsTemplate.find(query),
            CallReport.find(query),
            Playbook.find(query),
            AiObjectionSuggestion.find(query)
        ]);

        if (playbooks.length === 0) {
            // Remove the client-side 'id' before saving to let MongoDB generate the _id
            const playbooksToSeed = mockPlaybooks.map(p => {
                const { id, ...rest } = p; // Destructure to remove 'id'
                return { ...rest, user: req.user.id };
            });
            await Playbook.create(playbooksToSeed);
            playbooks = await Playbook.find(query);
        }


        res.status(200).json({
            success: true,
            data: {
                goldenScripts,
                negotiationModels,
                objections,
                smsTemplates,
                callReports,
                playbooks,
                aiObjectionSuggestions
            }
        });
    } catch (err) {
        console.error('Error in getIntelligenceData:', err);
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

// @desc    Create a new objection
// @route   POST /api/intelligence/objections
// @access  Private
exports.createObjection = async (req, res, next) => {
    try {
        const objection = await Objection.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: objection });
    } catch (err) {
        console.error('Error creating objection:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, msg: messages.join(', ') });
        }
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update an objection
// @route   PUT /api/intelligence/objections/:id
// @access  Private
exports.updateObjection = async (req, res, next) => {
    try {
        let objection = await Objection.findById(req.params.id);

        if (!objection) {
            return res.status(404).json({ success: false, msg: 'Objection not found' });
        }

        if (objection.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        objection = await Objection.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: objection });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete an objection
// @route   DELETE /api/intelligence/objections/:id
// @access  Private
exports.updatePlaybook = async (req, res, next) => {
    try {
        let playbook = await Playbook.findById(req.params.id);

        if (!playbook) {
            return res.status(404).json({ success: false, msg: 'Playbook not found' });
        }

        if (playbook.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        playbook = await Playbook.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: playbook });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete an objection
// @route   DELETE /api/intelligence/objections/:id
// @access  Private
exports.deleteObjection = async (req, res, next) => {
    try {
        // Atomically find the document by its ID and the user who owns it, and delete it.
        const query = {
            _id: req.params.id,
            user: req.user.id
        };

        // Admins can delete any objection
        if (req.user.role === 'admin') {
            delete query.user;
        }

        const objection = await Objection.findOneAndDelete(query);

        if (!objection) {
            // This will correctly handle both "not found" and "not authorized" cases
            return res.status(404).json({ success: false, msg: 'Objection not found or you are not authorized to delete it' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Error deleting objection:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get all playbooks
// @route   GET /api/intelligence/playbooks
// @access  Private
exports.getPlaybooks = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const playbooks = await Playbook.find(query);
        res.status(200).json({ success: true, data: playbooks });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get all AI objection suggestions
// @route   GET /api/intelligence/ai-objection-suggestions
// @access  Private
exports.getAiObjectionSuggestions = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const suggestions = await AiObjectionSuggestion.find(query);
        res.status(200).json({ success: true, data: suggestions });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
