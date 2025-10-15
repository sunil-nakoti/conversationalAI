const initialMissions = [
    {
        id: 'mission1',
        title: 'Q3 PTP Push',
        description: 'Focus on securing Promises-to-Pay. Every confirmed PTP contributes to the goal.',
        rewardXp: 5000,
        progress: 68,
        goal: 150,
        goalType: 'PTPs',
        timeLimitDays: 14,
    },
    {
        id: 'mission2',
        title: 'Compliance Excellence',
        description: 'Maintain a high RPC rate while minimizing opt-outs. This mission tracks the ratio of successful contacts to disengagements.',
        rewardXp: 7500,
        progress: 85,
        goal: 100,
        goalType: 'RPCs',
        timeLimitDays: 7,
    }
];

module.exports = initialMissions;
