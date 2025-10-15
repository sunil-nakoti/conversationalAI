const mongoose = require('mongoose');

const NegotiationModelSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    name: String,
    description: String,
    settlementAuthority: {
        maxPercentage: Number,
        requiresApprovalSimulation: Boolean,
    },
    offerPacing: String,
    paymentPlanFlexibility: {
        allowCustomPlans: Boolean,
        maxDurationMonths: Number,
        minInstallmentPercentage: Number,
    },
    hardshipProtocol: String,
    allowedTactics: [String],
});

module.exports = mongoose.model('NegotiationModel', NegotiationModelSchema);
