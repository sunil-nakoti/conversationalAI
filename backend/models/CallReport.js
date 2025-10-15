const mongoose = require('mongoose');

const TranscriptEntrySchema = new mongoose.Schema({
    speaker: String,
    text: String,
    timestamp: Number,
}, { _id: false });

const CallReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    debtorName: String,
    agentName: String,
    timestamp: String,
    outcome: String,
    duration: Number,
    audioUrl: String,
    transcript: [TranscriptEntrySchema],
    aiSupervisorScore: Number,
    aiSupervisorNotes: String,
    humanFeedback: String,
});

module.exports = mongoose.model('CallReport', CallReportSchema);
