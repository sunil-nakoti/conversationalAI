const initialScheduledPayments = [
    {
        id: 'sp1',
        debtorId: 'd1',
        debtorName: 'Peter Jones',
        accountNumber: 'ACC-SAMPLE-03',
        paymentPlanId: 'pp1',
        scheduledDate: '2024-07-25T10:00:00Z',
        scheduledAmount: 300.00,
        status: 'Missed',
    },
    {
        id: 'sp2',
        debtorId: 'd2',
        debtorName: 'John Doe',
        accountNumber: 'ACC-SAMPLE-01',
        paymentPlanId: 'pp2',
        scheduledDate: '2024-08-28T10:00:00Z',
        scheduledAmount: 150.00,
        status: 'Pending',
    }
];

module.exports = initialScheduledPayments;
