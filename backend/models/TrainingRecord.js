const mongoose = require('mongoose');

const TrainingRecordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    callReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CallReport',
        required: true
    },
    classification: {
        type: String,
        enum: ['good', 'bad'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only classify a call report once
TrainingRecordSchema.index({ user: 1, callReport: 1 }, { unique: true });

TrainingRecordSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('TrainingRecord', TrainingRecordSchema);
