const mongoose = require('mongoose');

const ConversationalAuditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  callId: String,
  debtorName: String,
  agentName: String,
  timestamp: Date,
  riskType: String,
  riskScore: Number,
  summary: String,
  flaggedTranscriptSnippet: String,
  sentimentTrend: [Number]
});

module.exports = mongoose.model('ConversationalAudit', ConversationalAuditSchema);
