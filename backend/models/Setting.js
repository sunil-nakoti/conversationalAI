const mongoose = require('mongoose');

const BrandedCallingSettingsSchema = new mongoose.Schema({
    isEnabled: Boolean,
    defaultBrandingProfileId: String,
}, { _id: false });

const SettingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    callingCadence: {
        type: String,
        default: 'human-simulated'
    },
    isBehaviorSimulationEnabled: {
        type: Boolean,
        default: true
    },
    incubationHours: {
        type: Number,
        default: 48
    },
    brandedCallingSettings: {
        type: BrandedCallingSettingsSchema,
        default: { isEnabled: true, defaultBrandingProfileId: null }
    },
    isAutoComplianceEnabled: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Setting', SettingSchema);
