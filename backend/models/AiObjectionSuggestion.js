const mongoose = require('mongoose');

const AiObjectionSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keywords: [String],
  detectionCount: Number,
  firstDetected: Date,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('AiObjectionSuggestion', AiObjectionSuggestionSchema);
