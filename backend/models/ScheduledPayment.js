const mongoose = require('mongoose');

const ScheduledPaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    debtorId: String,
    debtorName: String,
    accountNumber: String,
    paymentPlanId: String,
    scheduledDate: String,
    scheduledAmount: Number,
    status: String,
});

module.exports = mongoose.model('ScheduledPayment', ScheduledPaymentSchema);
