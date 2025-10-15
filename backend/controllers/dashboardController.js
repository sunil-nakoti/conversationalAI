// In a real application, you would fetch and calculate this data from your database.
// For this refactor, we are moving the static data to the backend.

const mockKpis = [
    { label: 'Successful Calls', value: '3,420', description: 'Total right-party contacts established today.', icon: 'phone', color: 'success' },
    { label: 'SMS Delivered', value: '12,830', description: 'Total SMS messages successfully delivered.', icon: 'sms', color: 'accent' },
    { label: 'Portal Logins', value: '1,850', description: 'Unique debtors who logged into the payment portal.', icon: 'user-check', color: 'accent' },
    { label: 'Spam Likely Flag', value: '1.2%', description: 'Percentage of outbound calls flagged as spam by carriers.', icon: 'shield-check', color: 'danger' }
];

const mockFunnelData = [
    { name: 'Accounts Loaded', value: 12500, color: '#38BDF8' },
    { name: 'Attempts Made', value: 9800, color: '#60A5FA' },
    { name: 'RPCs', value: 3420, color: '#A78BFA' },
    { name: 'Portal Logins', value: 1850, color: '#C084FC', parentStageIndex: 2 },
    { name: 'Opt-Ins', value: 1026, color: '#818CF8', parentStageIndex: 2 },
    { name: 'PTPs', value: 615, color: '#F472B6', parentStageIndex: 2 },
    { name: 'Payments Made', value: 450, color: '#22C55E', parentStageIndex: 5 },
    { name: 'Opt-Outs', value: 68, color: '#EF4444', parentStageIndex: 2 },
];

const mockAlerts = [
    { id: '1', severity: 'High', message: 'Account BK-12345: New bankruptcy filing detected.', timestamp: '2024-07-31T10:00:00Z' },
    { id: '2', severity: 'Medium', message: 'Account AC-98765: Nearing call frequency limit (6/7 in 7 days).', timestamp: '2024-07-31T09:30:00Z' },
    { id: '3', severity: 'Low', message: '3 accounts flagged for potential cease-and-desist language.', timestamp: '2024-07-31T08:00:00Z' },
];

const mockPtps = [
    { id: 'ptp1', debtorName: 'John Doe', amount: 150.00, status: 'Unpaid' },
    { id: 'ptp2', debtorName: 'Jane Smith', amount: 75.50, status: 'Paid' },
    { id: 'ptp3', debtorName: 'Peter Jones', amount: 300.00, status: 'Unpaid' },
];

const mockCampaigns = [
    { id: 'port-active-1', name: 'Q3 High-Priority Live' },
    { id: 'port-active-2', name: 'Midland Credit Active' },
];

const mockCampaignKpis = {
    'port-active-1': { rpcRate: 42.1, ptpRate: 18.5, paymentsMade: 12, totalCollected: 15230.75 },
    'port-active-2': { rpcRate: 35.8, ptpRate: 22.3, paymentsMade: 18, totalCollected: 9850.50 },
};


// @desc    Get all dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const dashboardData = {
        kpis: mockKpis,
        funnelData: mockFunnelData,
        alerts: mockAlerts,
        ptps: mockPtps,
        campaignKpis: {
            kpiData: mockCampaignKpis,
            campaigns: mockCampaigns,
        },
        loginEvents: [] // This would likely come from a separate source in a real app
    };

    res.status(200).json({ success: true, data: dashboardData });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
