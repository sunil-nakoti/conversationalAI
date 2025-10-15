const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    debtorId: String,
    debtorName: String,
    accountNumber: String,
    portfolioId: String,
    portfolioName: String,
    paymentAmount: Number,
    paymentDate: String,
    paymentMethod: String,
    paymentType: String,
    status: String,
    confirmationNumber: String,
});

module.exports = mongoose.model('Payment', PaymentSchema);
