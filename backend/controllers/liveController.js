const mockDebtors = ["John D.", "Jane S.", "Peter J.", "Mary L.", "David C.", "Sarah P."];
const mockAgents = ['Zephyr', 'Kore', 'Puck', 'Charon'];
const mockSmsMessages = [
    "Hi, just a reminder about your account.",
    "Can you call me back?",
    "I can't pay this right now.",
    "Okay, I will make a payment today.",
    "Is this the final amount?",
];

let calls = [];
let sms = [];
let paymentsMade = 0;
let logins = 0;

const generateLiveUpdates = () => {
    // Simulate a new call
    if (Math.random() > 0.5) {
        const newCall = {
            id: `call_${Date.now()}`,
            debtorName: mockDebtors[Math.floor(Math.random() * mockDebtors.length)],
            agent: mockAgents[Math.floor(Math.random() * mockAgents.length)],
            status: ['Ringing', 'Connected', 'Completed', 'Voicemail', 'Failed'][Math.floor(Math.random() * 5)],
            sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
            duration: Math.floor(Math.random() * 300),
            timestamp: Date.now(),
        };
        calls = [newCall, ...calls.slice(0, 19)];
    }

    // Simulate a new SMS
    if (Math.random() > 0.7) {
         const newSms = {
            id: `sms_${Date.now()}`,
            debtorName: mockDebtors[Math.floor(Math.random() * mockDebtors.length)],
            direction: Math.random() > 0.5 ? 'inbound' : 'outbound',
            message: mockSmsMessages[Math.floor(Math.random() * mockSmsMessages.length)],
            timestamp: Date.now(),
            status: 'Delivered',
        };
        sms = [newSms, ...sms.slice(0, 19)];
    }

    // Simulate payments and logins
    if (Math.random() > 0.9) paymentsMade++;
    if (Math.random() > 0.8) logins++;
};

setInterval(generateLiveUpdates, 3000); // Generate new data every 3 seconds

// @desc    Get live updates
// @route   GET /api/live/updates
// @access  Private
exports.getLiveUpdates = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                calls,
                sms,
                paymentsMade,
                logins,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
