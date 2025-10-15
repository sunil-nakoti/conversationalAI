const Payment = require('../models/Payment');
const ScheduledPayment = require('../models/ScheduledPayment');

// @desc    Get all reporting data
// @route   GET /api/reporting
// @access  Private
exports.getReportingData = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };

        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        
        const dateQuery = { ...query, paymentDate: { $gte: last30Days.toISOString() } };

        const [paymentHistory, missedPayments, recentPayments] = await Promise.all([
            Payment.find(query).sort({ paymentDate: -1 }),
            ScheduledPayment.find({ ...query, status: 'Missed' }),
            Payment.find(dateQuery),
        ]);

        const totalCollected = recentPayments.reduce((sum, p) => sum + p.paymentAmount, 0);
        const totalPayments = recentPayments.length;
        const avgPayment = totalPayments > 0 ? totalCollected / totalPayments : 0;
        
        const methodBreakdown = recentPayments.reduce((acc, p) => {
            acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
            return acc;
        }, {});

        const typeBreakdown = recentPayments.reduce((acc, p) => {
            acc[p.paymentType] = (acc[p.paymentType] || 0) + 1;
            return acc;
        }, {});

        const summary = { totalCollected, totalPayments, avgPayment, methodBreakdown, typeBreakdown };

        res.status(200).json({
            success: true,
            data: {
                summary,
                paymentHistory,
                missedPayments
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
