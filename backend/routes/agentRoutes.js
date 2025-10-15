const express = require('express');
const { getAgents, getMissions, suggestMission, saveMission, deleteMission } = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getAgents);

router.route('/missions')
    .get(protect, getMissions)
    .post(protect, saveMission);

router.route('/missions/:id')
    .put(protect, saveMission)
    .delete(protect, deleteMission);
    
router.route('/suggest-mission').post(protect, suggestMission);


module.exports = router;
