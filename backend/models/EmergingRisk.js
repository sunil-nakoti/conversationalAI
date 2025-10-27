const mongoose = require('mongoose');

const EmergingRiskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  detectedDate: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    required: true
  },
  keywords: [String]
});

module.exports = mongoose.model('EmergingRisk', EmergingRiskSchema);
