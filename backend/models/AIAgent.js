const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    icon: String,
    color: String,
}, { _id: false });

const AIAgentConfigurationSchema = new mongoose.Schema({
    basePersona: String,
    systemPrompt: String,
    responseLatency: Number,
    interruptionSensitivity: Number,
    negotiationModelId: String,
    defaultVoice: String,
    naturalPauses: Boolean,
    varyPitch: Boolean,
    accentMatchingEnabled: Boolean,
    tacticUrgency: Number,
    tacticEmpathy: Number,
    tacticSocialProof: Number,
    tacticAuthority: Number,
}, { _id: false });

const AIAgentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, unique: true, required: true },
    name: String,
    role: String,
    level: Number,
    rankTitle: String,
    currentXp: Number,
    xpToNextLevel: Number,
    totalXp: Number,
    achievements: [AchievementSchema],
    ptpRate: Number,
    rpcRate: Number,
    optInRate: Number,
    optOutRate: Number,
    paymentsMade: Number,
    logins: Number,
    complianceScore: Number,
    coachingSessions: Number,
    teamPtpLift: Number,
    efficiencyGain: Number,
    escalationsHandled: Number,
    auditsCompleted: Number,
    violationsDetected: Number,
    disputesResolved: Number,
    policyUpdates: Number,
    configuration: AIAgentConfigurationSchema,
    isPrometheusEnabled: Boolean,
    prometheusStatus: {
        challengerName: String,
        performanceLift: Number,
    },
});

module.exports = mongoose.model('AIAgent', AIAgentSchema);
