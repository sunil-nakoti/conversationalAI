const mongoose = require('mongoose');

const EdgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
}, { _id: false });

const NodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    icon: { type: String, required: true },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    settings: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const PlaybookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    agentId: {
        type: String,
        required: true
    },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

PlaybookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

PlaybookSchema.index({ user: 1, agentId: 1 }, { unique: true });

module.exports = mongoose.model('Playbook', PlaybookSchema);
