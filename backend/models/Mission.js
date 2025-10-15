const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true },
    title: String,
    description: String,
    rewardXp: Number,
    progress: Number,
    goal: Number,
    goalType: String,
    timeLimitDays: Number,
});

module.exports = mongoose.model('Mission', MissionSchema);
