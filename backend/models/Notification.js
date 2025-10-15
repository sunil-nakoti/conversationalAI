const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    type: String,
    icon: String,
    title: String,
    message: String,
    debtorName: String,
    priority: String,
    status: String,
    createdAt: String,
});

module.exports = mongoose.model('Notification', NotificationSchema);
