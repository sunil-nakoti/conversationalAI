const mongoose = require('mongoose');

const ObjectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String,
    category: String,
    keywords: [String],
    linkedPlaybookId: String,
    linkedPlaybookName: String,
    successRate: Number,
    avgSentimentShift: Number,
    avgCallDuration: Number,
    challengerPlaybookId: String,
    challengerPlaybookName: String,
});

ObjectionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Objection', ObjectionSchema);
