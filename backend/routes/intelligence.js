const express = require('express');
const {
    getIntelligenceData,
    updateNegotiationModels,
    updateObjections,
    createObjection,
    updateObjection,
    deleteObjection,
    getPlaybooks,
    getAiObjectionSuggestions
} = require('../controllers/intelligenceController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getIntelligenceData);

router.route('/negotiation-models')
    .put(protect, updateNegotiationModels);

router.route('/objections')
    .put(protect, updateObjections)
    .post(protect, createObjection);

router.route('/objections/:id')
    .put(protect, updateObjection)
    .delete(protect, deleteObjection);

router.route('/playbooks')
    .get(protect, getPlaybooks);

router.route('/ai-objection-suggestions')
    .get(protect, getAiObjectionSuggestions);

module.exports = router;
