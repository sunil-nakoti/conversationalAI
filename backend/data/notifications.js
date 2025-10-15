const initialNotifications = [
    { 
        id: 'notif1', 
        type: 'New Text Received', 
        icon: 'sms', 
        title: 'New SMS from STEVEN DAME', 
        message: 'I got laid off i cant pay right now', 
        debtorName: 'STEVEN DAME', 
        priority: 'high', 
        status: 'unread', 
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    { 
        id: 'notif2', 
        type: 'Payment Portal Login', 
        icon: 'user-check', 
        title: 'Portal Login Detected', 
        message: 'Duane Fulford logged into the payment portal from IP: 75.128.92.11', 
        debtorName: 'Duane Fulford', 
        priority: 'low', 
        status: 'read', 
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    { 
        id: 'notif3', 
        type: 'New Text Received', 
        icon: 'sms', 
        title: 'New SMS from Duane Fulford', 
        message: 'wrong number', 
        debtorName: 'Duane Fulford', 
        priority: 'normal', 
        status: 'unread', 
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    { 
        id: 'notif4', 
        type: 'Compliance Alert', 
        icon: 'shield-check', 
        title: 'High-Risk Number Flagged', 
        message: 'Number +1-800-555-LITIGATOR was flagged as a known TCPA litigator and blocked.', 
        debtorName: 'System', 
        priority: 'high', 
        status: 'read', 
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
];

module.exports = initialNotifications;
