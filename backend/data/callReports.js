const initialCallReports = [
    {
        id: 'cr1',
        debtorName: 'John Doe',
        agentName: 'Zephyr',
        timestamp: '2024-08-15T14:30:00Z',
        outcome: 'PTP Created',
        duration: 185,
        audioUrl: '#',
        transcript: [
            { speaker: 'AI', text: 'Hello, may I please speak with John Doe?', timestamp: 5 },
            { speaker: 'Debtor', text: 'This is he.', timestamp: 7 },
            { speaker: 'AI', text: 'This is Zephyr calling from ARC Recovery regarding a personal business matter. This is a call from a debt collector.', timestamp: 12 },
            { speaker: 'Debtor', text: 'Oh, right. I know what this is about. I just got paid, can I set something up?', timestamp: 25 },
            { speaker: 'AI', text: 'Absolutely, I can help with that. We have a couple of options available...', timestamp: 30 },
        ],
        aiSupervisorScore: 95,
        aiSupervisorNotes: 'Excellent call. Agent was empathetic, followed the playbook, and secured a promise-to-pay efficiently. Mini-Miranda was delivered clearly.',
        humanFeedback: 'good',
    },
    {
        id: 'cr2',
        debtorName: 'Jane Smith',
        agentName: 'Kore',
        timestamp: '2024-08-15T11:45:00Z',
        outcome: 'Objection - Cannot Pay',
        duration: 240,
        audioUrl: '#',
        transcript: [
            { speaker: 'AI', text: 'Hello, I am calling for Jane Smith from Pinnacle Financial.', timestamp: 6 },
            { speaker: 'Debtor', text: 'Speaking. Look, I lost my job, I can\'t pay anything right now.', timestamp: 15 },
            { speaker: 'AI', text: 'I understand that can be a difficult situation. The balance on this account is $450.25. It is important we find a solution.', timestamp: 28 },
            { speaker: 'Debtor', text: 'I just told you I can\'t pay!', timestamp: 35 },
        ],
        aiSupervisorScore: 72,
        aiSupervisorNotes: 'Agent Kore maintained a professional tone but failed to pivot to the hardship playbook after the debtor stated they lost their job. The agent was too direct, causing sentiment to drop. Coaching opportunity identified.',
        humanFeedback: null,
    },
];

module.exports = initialCallReports;
