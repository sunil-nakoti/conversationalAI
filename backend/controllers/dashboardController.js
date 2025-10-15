const Portfolio = require('../models/Portfolio');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Get all dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const [portfolios, recentPayments, highPriorityNotifications] = await Promise.all([
        Portfolio.find(query),
        Payment.find(query).sort({ paymentDate: -1 }).limit(10), // Example: get recent payments
        Notification.find({ ...query, priority: 'High', status: 'unread' }).limit(3)
    ]);

    // --- Aggregate KPIs ---
    const totalAccounts = portfolios.reduce((sum, p) => sum + p.numberOfAccounts, 0);
    const totalAttempts = portfolios.reduce((sum, p) => sum + p.contactAttempts, 0);
    const totalPtp = 615; // Mock: In a real app, you'd calculate this
    const totalPaymentsMade = recentPayments.length;
    
    const kpis = [
        { label: 'Successful Calls', value: '3,420', description: 'Total right-party contacts established today.', icon: 'phone', color: 'success' },
        { label: 'SMS Delivered', value: '12,830', description: 'Total SMS messages successfully delivered.', icon: 'sms', color: 'accent' },
        { label: 'Portal Logins', value: '1,850', description: 'Unique debtors who logged into the payment portal.', icon: 'user-check', color: 'accent' },
        { label: 'Spam Likely Flag', value: '1.2%', description: 'Percentage of outbound calls flagged as spam by carriers.', icon: 'shield-check', color: 'danger' }
    ];

    const funnelData = [
        { name: 'Accounts Loaded', value: totalAccounts, color: '#38BDF8' },
        { name: 'Attempts Made', value: totalAttempts, color: '#60A5FA' },
        { name: 'RPCs', value: 3420, color: '#A78BFA' }, // Mock
        { name: 'PTPs', value: totalPtp, color: '#F472B6' }, // Mock
        { name: 'Payments Made', value: totalPaymentsMade, color: '#22C55E', parentStageIndex: 3 },
    ];
    
    const alerts = highPriorityNotifications.map(n => ({
        id: n.id,
        severity: n.priority,
        message: n.title,
        timestamp: n.createdAt
    }));
    
    const ptps = [ // Mock
        { id: 'ptp1', debtorName: 'John Doe', amount: 150.00, status: 'Unpaid' },
        { id: 'ptp2', debtorName: 'Jane Smith', amount: 75.50, status: 'Paid' },
    ];
    
    const activeCampaigns = portfolios.filter(p => p.status === 'Active').map(p => ({ id: p.id, name: p.name }));
    const campaignKpis = activeCampaigns.reduce((acc, p) => {
        acc[p.id] = { rpcRate: 42.1, ptpRate: 18.5, paymentsMade: 12, totalCollected: 15230.75 }; // Mock
        return acc;
    }, {});


    const dashboardData = {
        kpis,
        funnelData,
        alerts,
        ptps,
        campaignKpis: {
            kpiData: campaignKpis,
            campaigns: activeCampaigns,
        },
        loginEvents: [] // This would come from a separate login event model
    };

    res.status(200).json({ success: true, data: dashboardData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
