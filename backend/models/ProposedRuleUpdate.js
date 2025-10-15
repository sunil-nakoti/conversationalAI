const mongoose = require('mongoose');

const ProposedRuleUpdateSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    jurisdictionCode: String,
    currentRule: mongoose.Schema.Types.Mixed,
    proposedChanges: mongoose.Schema.Types.Mixed,
    reasoning: String,
    sourceUrl: String,
    sourceTitle: String,
    confidence: Number,
    status: {
        type: String,
        enum: ['pending', 'applied', 'dismissed'],
        default: 'pending'
    }
});

module.exports = mongoose.model('ProposedRuleUpdate', ProposedRuleUpdateSchema);