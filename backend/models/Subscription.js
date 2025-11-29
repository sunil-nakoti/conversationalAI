const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'inactive',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  paymentDetails: {
    paymentMethod: String, // e.g., 'paypal', 'upi'
    transactionId: String,
    lastPaymentDate: Date,
  },
});

module.exports = SubscriptionSchema;
