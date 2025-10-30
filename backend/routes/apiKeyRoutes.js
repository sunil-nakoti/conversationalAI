const express = require('express');
const {
    getApiKeys,
    saveApiKey,
    deleteApiKey
} = require('../controllers/apiKeyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here are admin-protected
router.use(protect);

router.route('/')
    .get(getApiKeys)
    .post(saveApiKey);

router.route('/:key')
    .delete(deleteApiKey);

module.exports = router;
