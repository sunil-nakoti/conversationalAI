const mongoose = require('mongoose');

const GoldenScriptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    playbookName: String,
    persona: String,
    ptpRate: Number,
    avgSentiment: Number,
    complianceScore: Number,
    dateArchived: String,
});

module.exports = mongoose.model('GoldenScript', GoldenScriptSchema);
