console.log('[Controller] Loading intelligenceController.js...');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const GoldenScript = require('../models/GoldenScript');
const NegotiationModel = require('../models/NegotiationModel');
const Objection = require('../models/Objection');
const SmsTemplate = require('../models/SmsTemplate');
const CallReport = require('../models/CallReport');
const Playbook = require('../models/Playbook');
const AiObjectionSuggestion = require('../models/AiObjectionSuggestion');
const TrainingRecord = require('../models/TrainingRecord');
const TrainingExample = require('../models/TrainingExample');

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

// @desc    Update a playbook
// @route   PUT /api/intelligence/playbooks/:id
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

// @desc    Create a new playbook
// @route   POST /api/intelligence/playbooks
// @access  Private
exports.createPlaybook = async (req, res, next) => {
    try {
        const playbook = await Playbook.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: playbook });
    } catch (err) {
        console.error('Error creating playbook:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, msg: messages.join(', ') });
        }
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

// @desc    Get all call reports
// @route   GET /api/intelligence/call-reports
// @access  Private
exports.getCallReports = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const reports = await CallReport.find(query).sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: reports });
    } catch (err) {
        console.error('Error getting call reports:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update a call report (e.g., for feedback)
// @route   PUT /api/intelligence/call-reports/:id
// @access  Private
exports.updateCallReport = async (req, res, next) => {
    try {
        let report = await CallReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, msg: 'Report not found' });
        }

        // Ensure the user owns the report or is an admin
        if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        report = await CallReport.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: report });
    } catch (err) {
        console.error('Error updating call report:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get all golden scripts
// @route   GET /api/intelligence/golden-scripts
// @access  Private
exports.getGoldenScripts = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const scripts = await GoldenScript.find(query).sort({ dateArchived: -1 });
        res.status(200).json({ success: true, data: scripts });
    } catch (err) {
        console.error('Error getting golden scripts:', err);
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
// This is a placeholder for a real AI service call.
// In a professional setup, this function would build a detailed prompt
// and send it to a service like Gemini or GPT.
const generateSmsSuggestionsFromAI = async (user) => {
    // 1. Gather context (e.g., fetch user's most successful existing templates, recent call outcomes, etc.)
    // const successfulTemplates = await SmsTemplate.find({ user: user.id }).sort({ conversionRate: -1 }).limit(5);

    // 2. Construct a detailed prompt for the AI.
    const prompt = `
        You are an expert debt collection strategist. Based on industry best practices and the following examples of successful SMS messages, generate 3 new, distinct SMS template suggestions.
        
        SUCCESSFUL EXAMPLES:
        - "Hi {debtor.fullname}, just a reminder your payment is due tomorrow. Let us know if you need help."
        - "We have new payment options that might work for you. Call us at {branding.phoneNumber} to discuss."

        Generate 3 new suggestions. For each suggestion, provide a 'suggestedMessage', a 'reasoning' for why it will be effective, and a 'predictedConversionLift' (a number between 1 and 15).
        The output must be a valid JSON array of objects.
    `;

    // 3. (Future) Make the actual API call to the AI service.
    // const aiResponse = await callToGenerativeAI(prompt);
    // const suggestions = JSON.parse(aiResponse);

    // 4. For now, return a realistic, simulated AI response.
    const simulatedAiResponse = [
        {
            id: 
`sms_sug_${Date.now()}_1`,
            source: 'conversation_analysis',
            suggestedMessage: 'Hi {debtor.fullname}, I understand things are tough. We have new flexible payment options that might help. Are you open to discussing them?',
            reasoning: 'This message from a manual conversation had a 35% higher positive reply rate and led to a payment plan setup.',
            predictedConversionLift: 12
        },
        {
            id: `sms_sug_${Date.now()}_2`,
            source: 'generative_model',
            suggestedMessage: 'Hi {debtor.fullname}, we haven\'t heard from you regarding your account #{debtor.accountnumber}. We can help you resolve this. Please call {branding.phoneNumber} at your convenience.',
            reasoning: 'Generated as a friendly, low-pressure re-engagement message for dormant accounts.',
            predictedConversionLift: 5
        },
        {
            id: `sms_sug_${Date.now()}_3`,
            source: 'industry_best_practice',
            suggestedMessage: 'Reminder: Your payment of ${amount} is due on {date}. To pay or discuss options, visit {portal.url} or call us. Reply STOP to unsubscribe.',
            reasoning: 'A clear, concise reminder including compliance elements (opt-out) and multiple contact channels.',
            predictedConversionLift: 8
        }
    ];

    return simulatedAiResponse;
};

// @desc    Get AI-powered suggestions for new SMS templates
// @route   GET /api/intelligence/ai-sms-suggestions
// @access  Private
exports.getAiSmsSuggestions = async (req, res, next) => {
    try {
        // Call the helper function to get suggestions.
        const suggestions = await generateSmsSuggestionsFromAI(req.user);
        res.status(200).json({ success: true, data: suggestions });
    } catch (err) {
        console.error('Error in getAiSmsSuggestions:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Create a new SMS template
// @route   POST /api/intelligence/sms-templates
// @access  Private
exports.createSmsTemplate = async (req, res, next) => {
    try {
        const template = await SmsTemplate.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: template });
    } catch (err) {
        console.error('Error creating SMS template:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update an SMS template
// @route   PUT /api/intelligence/sms-templates/:id
// @access  Private
exports.updateSmsTemplate = async (req, res, next) => {
    try {
        let template = await SmsTemplate.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ success: false, msg: 'Template not found' });
        }

        if (template.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        template = await SmsTemplate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: template });
    } catch (err) {
        console.error('Error updating SMS template:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete an SMS template
// @route   DELETE /api/intelligence/sms-templates/:id
// @access  Private
exports.deleteSmsTemplate = async (req, res, next) => {
    try {
        const query = { _id: req.params.id, user: req.user.id };
        if (req.user.role === 'admin') {
            delete query.user;
        }

        const template = await SmsTemplate.findOneAndDelete(query);

        if (!template) {
            return res.status(404).json({ success: false, msg: 'Template not found or not authorized' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Error deleting SMS template:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Create or update a training record for a call
// @route   POST /api/intelligence/training
// @access  Private
exports.createTrainingRecord = async (req, res, next) => {
    const { callReportId, classification } = req.body;

    if (!callReportId || !classification) {
        return res.status(400).json({ success: false, msg: 'Please provide a callReportId and a classification' });
    }

    try {
        // Use findOneAndUpdate with upsert to create or update the classification for a user and call report.
        // This prevents creating duplicate records if a user changes their classification.
        const trainingRecord = await TrainingRecord.findOneAndUpdate(
            { user: req.user.id, callReport: callReportId },
            { classification },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({ success: true, data: trainingRecord });
    } catch (err) {
        console.error('Error creating/updating training record:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get all training examples
// @route   GET /api/intelligence/training-examples
// @access  Private
exports.getTrainingExamples = async (req, res, next) => {
    try {
        const examples = await TrainingExample.find({ user: req.user.id }).sort({ uploadedAt: -1 });
        res.status(200).json({ success: true, data: examples });
    } catch (err) {
        console.error('Error getting training examples:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Create a new training example
// @route   POST /api/intelligence/training-examples
// @access  Private
exports.createTrainingExample = async (req, res, next) => {
    try {
        // In a real app, this would handle file uploads to S3/GCS and save the URLs.
        const example = await TrainingExample.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: example });
    } catch (err) {
        console.error('Error creating training example:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete a training example
// @route   DELETE /api/intelligence/training-examples/:id
// @access  Private
exports.deleteTrainingExample = async (req, res, next) => {
    try {
        const example = await TrainingExample.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!example) {
            return res.status(404).json({ success: false, msg: 'Example not found or not authorized' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Error deleting training example:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get AI-powered suggestions for new objections
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

// @desc    Synthesize speech using Google TTS
// @route   POST /api/intelligence/tts
// @access  Private
exports.synthesizeSpeech = async (req, res, next) => {
    // Initialize the client outside the try block for broader scope if needed,
    // but instantiate inside to handle potential initialization errors.
    const client = new TextToSpeechClient();

    try {
        const { text, voiceId, languageCode } = req.body;
        
        if (!text || !voiceId || !languageCode) {
            return res.status(400).json({ success: false, msg: 'Missing required parameters: text, voiceId, languageCode' });
        }

        // Construct the request payload for the SDK
        const request = {
            input: { text },
            voice: { languageCode, name: voiceId },
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Call the API using the SDK client
        const [response] = await client.synthesizeSpeech(request);

        // The SDK handles authentication via environment variables (GOOGLE_APPLICATION_CREDENTIALS)
        // and returns the audio content directly.
        res.status(200).json({ success: true, data: response.audioContent });

    } catch (err) {
        console.error('Error in synthesizeSpeech:', err);
        // The SDK provides more detailed error objects
        res.status(500).json({ success: false, msg: 'Failed to synthesize speech.', error: err.message });
    }
};