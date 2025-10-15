const Notification = require('../models/Notification');

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Mark a notification as read
// @route   POST /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        let notification = await Notification.findOne({ id: req.params.id });

        if (!notification) {
            return res.status(404).json({ success: false, msg: 'Notification not found' });
        }

        // Check ownership
        if (notification.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, msg: 'Not authorized to update this notification' });
        }

        notification.status = 'read';
        await notification.save();

        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
