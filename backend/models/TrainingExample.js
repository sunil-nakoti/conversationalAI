const mongoose = require('mongoose');

const TrainingExampleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    type: {
        type: String,
        enum: ['good', 'bad'],
        required: true
    },
    hasAudio: {
        type: Boolean,
        default: false
    },
    hasTranscript: {
        type: Boolean,
        default: false
    },
    // In a real system, you would store file paths to S3 or another blob storage.
    audioUrl: String,
    transcriptContent: String,
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

TrainingExampleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('TrainingExample', TrainingExampleSchema);
