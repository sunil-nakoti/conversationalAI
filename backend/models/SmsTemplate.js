const mongoose = require('mongoose');

const SmsTemplateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    name: String,
    category: String,
    purpose: String,
    message: String,
    isAbTesting: Boolean,
    challengerMessage: String,
    ctr: Number,
    replyRate: Number,
    conversionRate: Number,
    optOutRate: Number,
    avgSentiment: Number,
    complianceScore: Number,
});

module.exports = mongoose.model('SmsTemplate', SmsTemplateSchema);
