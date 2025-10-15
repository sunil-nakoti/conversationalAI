const mongoose = require('mongoose');

const ObjectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    name: String,
    category: String,
    keywords: [String],
    linkedPlaybookId: String,
    linkedPlaybookName: String,
    successRate: Number,
    avgSentimentShift: Number,
    avgCallDuration: Number,
    challengerPlaybookId: String,
    challengerPlaybookName: String,
});

module.exports = mongoose.model('Objection', ObjectionSchema);
