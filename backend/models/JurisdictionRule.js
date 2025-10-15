const mongoose = require('mongoose');

const JurisdictionRuleSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    state: String,
    callFrequencyLimit: Number,
    callFrequencyDays: Number,
    timeOfDayStart: String,
    timeOfDayEnd: String,
    enforce_pre_dial_scrub: Boolean,
    isActive: Boolean,
});

module.exports = mongoose.model('JurisdictionRule', JurisdictionRuleSchema);
