const mongoose = require('mongoose');

const ReputationCheckResultSchema = new mongoose.Schema({
    risk_level: String,
    summary_insight: String,
}, { _id: false });

const PhoneNumberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    number: String,
    status: String,
    healthScore: Number,
    callsLastHour: Number,
    lastUsedTimestamp: Number,
    reputationStatus: String,
    reputationResult: ReputationCheckResultSchema,
    forwardingNumber: String,
    voicemailDetection: Boolean,
    poolId: String,
    incubationStart: Number,
    attestationStatus: String,
});

module.exports = mongoose.model('PhoneNumber', PhoneNumberSchema);
