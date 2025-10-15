const initialPayments = [
    {
        id: 'pay1',
        debtorId: 'd1',
        debtorName: 'Jane Smith',
        accountNumber: 'ACC-SAMPLE-02',
        portfolioId: 'portfolio_2',
        portfolioName: 'Midland Credit - Active',
        paymentAmount: 75.50,
        paymentDate: '2024-07-31T10:00:00Z',
        paymentMethod: 'Online',
        paymentType: 'Settlement',
        status: 'Completed',
        confirmationNumber: 'PAY-789XYZ123'
    },
    {
        id: 'pay2',
        debtorId: 'd2',
        debtorName: 'John Doe',
        accountNumber: 'ACC-SAMPLE-01',
        portfolioId: 'portfolio_1',
        portfolioName: 'Q3 High-Priority Placement',
        paymentAmount: 150.00,
        paymentDate: '2024-07-28T15:30:00Z',
        paymentMethod: 'Telephonic',
        paymentType: 'Payment Plan',
        status: 'Completed',
        confirmationNumber: 'PAY-456ABC789'
    }
];

module.exports = initialPayments;
