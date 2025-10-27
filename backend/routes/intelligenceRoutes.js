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
    updatePlaybook
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
router.route('/playbooks').get(protect, getPlaybooks);
router.route('/ai-objection-suggestions').get(protect, getAiObjectionSuggestions);

module.exports = router;
