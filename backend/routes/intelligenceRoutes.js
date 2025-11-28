console.log('[Routes] Loading intelligenceRoutes.js...');
const express = require('express');
const {
    getIntelligenceData,
    updateNegotiationModels,
    createObjection,
    updateObjection,
    deleteObjection,
    updateObjections, // Keep for now, might be used elsewhere
    getPlaybooks,
    getAiObjectionSuggestions,
    getAiSmsSuggestions,
    updatePlaybook,
    createPlaybook,
    createSmsTemplate,
    updateSmsTemplate,
    deleteSmsTemplate,
    createTrainingRecord,
    getTrainingExamples,
    createTrainingExample,
    deleteTrainingExample,
    getCallReports,
    updateCallReport,
    getGoldenScripts,
    synthesizeSpeech
} = require('../controllers/intelligenceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getIntelligenceData);
router.route('/negotiation-models').put(protect, updateNegotiationModels);

// Objections
// The PUT route for bulk updates is kept for now, but we will use the more specific routes.
router.route('/objections')
    .put(protect, updateObjections)
    .post(protect, createObjection);

router.route('/objections/:id')
    .put(protect, updateObjection)
    .delete(protect, deleteObjection);

router.route('/playbooks/:id').put(protect, updatePlaybook);
router.route('/playbooks').get(protect, getPlaybooks).post(protect, createPlaybook);
router.route('/ai-objection-suggestions').get(protect, getAiObjectionSuggestions);
router.route('/ai-sms-suggestions').get(protect, getAiSmsSuggestions);

// SMS Templates
router.route('/sms-templates')
    .post(protect, createSmsTemplate);

router.route('/sms-templates/:id')
    .put(protect, updateSmsTemplate)
    .delete(protect, deleteSmsTemplate);

// AI Training
router.route('/training').post(protect, createTrainingRecord);

// Training Examples (Manual Uploads)
router.route('/training-examples')
    .get(protect, getTrainingExamples)
    .post(protect, createTrainingExample);

router.route('/training-examples/:id')
    .delete(protect, deleteTrainingExample);

// Call Reports
router.route('/call-reports')
    .get(protect, getCallReports);

router.route('/call-reports/:id')
    .put(protect, updateCallReport);

// Golden Scripts
router.route('/golden-scripts').get(protect, getGoldenScripts);

// Text-to-Speech
router.route('/tts').post(protect, synthesizeSpeech);

module.exports = router;