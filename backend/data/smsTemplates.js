const initialSmsTemplates = [
    {
        id: 'sms1',
        name: 'Initial Contact - Portal Intro',
        category: 'Initial Contact',
        purpose: 'Introduce the debtor to the online payment portal.',
        message: 'Hello {debtor.fullname}, this is {branding.companyName}. You can securely manage your account online at {payment.link}. This is a communication from a debt collector.',
        ctr: 15.2,
        replyRate: 2.1,
        conversionRate: 3.5,
        optOutRate: 0.5,
        complianceScore: 100,
    },
    {
        id: 'sms2',
        name: 'Payment Reminder - 2 Days',
        category: 'Payment Reminders',
        purpose: 'Remind debtor of an upcoming scheduled payment.',
        message: 'Hi {debtor.fullname}, this is a friendly reminder that your payment of ${payment.amount} is due in 2 days on {payment.due_date}.',
        ctr: 25.0,
        replyRate: 1.0,
        conversionRate: 0,
        optOutRate: 0.1,
        complianceScore: 100,
    }
];

module.exports = initialSmsTemplates;
