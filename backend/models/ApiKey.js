const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    },
    description: String
});

module.exports = mongoose.model('ApiKey', ApiKeySchema);
