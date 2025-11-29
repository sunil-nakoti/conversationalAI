const mongoose = require('mongoose');
const BotConfigurationSchema = require('./BotConfiguration');
const SubscriptionSchema = require('./Subscription');

const BusinessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please provide a company name'],
  },
  industry: {
    type: String,
  },
  website: {
    type: String,
  },
  botConfiguration: BotConfigurationSchema,
  subscription: SubscriptionSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Business', BusinessSchema);
