const express = require('express');
const { getAgents, createAgent, updateAgent, deleteAgent, getMissions, suggestMission, saveMission, deleteMission } = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getAgents)
    .post(protect, createAgent);

router.route('/:id')
    .put(protect, updateAgent)
    .delete(protect, deleteAgent);

router.route('/missions')
    .get(protect, getMissions)
    .post(protect, saveMission);

router.route('/missions/:id')
    .put(protect, saveMission)
    .delete(protect, deleteMission);
    
router.route('/suggest-mission').post(protect, suggestMission);


module.exports = router;
