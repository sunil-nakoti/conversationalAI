const mongoose = require('mongoose');

const SmsTemplateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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

SmsTemplateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('SmsTemplate', SmsTemplateSchema);
