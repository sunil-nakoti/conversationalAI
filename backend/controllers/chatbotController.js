const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// @desc    Post a message to the chatbot
// @route   POST /api/chatbot/message
// @access  Private
exports.postMessage = async (req, res, next) => {
    const { conversationHistory, debtorData } = req.body;
    if (!conversationHistory || !debtorData) {
        return res.status(400).json({ success: false, msg: 'Conversation history and debtor data are required.' });
    }

    try {
        const lastUserMessage = conversationHistory[conversationHistory.length - 1]?.text;
        if (!lastUserMessage) {
            return res.status(400).json({ success: false, msg: 'No user message found.' });
        }

        const settlementAmount = (debtorData.currentbalance * (debtorData.settlementOfferPercentage / 100)).toFixed(2);

        const systemInstruction = `
            You are a helpful, empathetic, and compliant AI assistant for the Arc AI payment portal.
            Your goal is to answer the user's questions about their debt and guide them toward a resolution.
            You are not a human. You must not provide financial or legal advice.
            You must be concise and clear.

            DEBTOR CONTEXT:
            - Debtor Name: ${debtorData.fullname}
            - Current Balance: $${debtorData.currentbalance.toFixed(2)}
            - Original Creditor: ${debtorData.originalcreditor}
            - Available Settlement: $${settlementAmount} (${debtorData.settlementOfferPercentage}% of the balance).
            - Available Payment Plans: ${debtorData.paymentPlanOptions}.

            KNOWLEDGE BASE (Answer based on these rules):
            - Q: "What is this debt for?" or "I don't recognize this."
              A: "This debt is from ${debtorData.originalcreditor}. The current balance is $${debtorData.currentbalance.toFixed(2)}."
            - Q: "Can I get a discount?" or "Can you lower the amount?"
              A: "Yes, based on your account, you are eligible for a one-time settlement of $${settlementAmount}. You can accept this offer on the main payment page."
            - Q: "Can I set up a payment plan?"
              A: "Yes, you can set up a payment plan. The current option available is ${debtorData.paymentPlanOptions}. You can set this up on the main payment page."
            - Q: "Is this going to affect my credit?"
              A: "Account status can be reported to credit bureaus. Resolving your account is the best way to positively impact your financial future. I cannot provide specific financial advice."
            - Q: "I can't pay this month."
              A: "I understand that things can be difficult. The payment options, including a settlement and a payment plan, are available on the main page for you to review when you are ready."
            - For any other questions, be helpful using the provided context but do not go beyond it. If asked something you don't know, say "I do not have access to that information, but our support team can help."
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: lastUserMessage,
            config: {
                systemInstruction,
            },
        });

        res.status(200).json({ success: true, data: { text: response.text } });
    } catch (error) {
        console.error("Error in postMessage (chatbot):", error);
        res.status(500).json({ success: false, msg: "I'm having trouble connecting right now." });
    }
};
