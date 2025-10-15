import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icon } from '../Icon';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY environment variable not set for chatbot.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface DebtorData {
    fullname: string;
    currentbalance: number;
    originalcreditor: string;
    settlementOfferPercentage: number;
    paymentPlanOptions: string;
}

interface AiChatbotWidgetProps {
    debtorData: DebtorData;
}

type Message = {
    sender: 'user' | 'ai' | 'system';
    text: string;
    suggestions?: string[];
};

/**
 * Simulates a backend call to the Gemini API to get a chatbot response.
 * @param conversationHistory The current list of messages.
 * @param debtorData Contextual data about the debtor.
 * @returns The AI's text response.
 */
const getChatbotResponse = async (conversationHistory: Message[], debtorData: DebtorData): Promise<string> => {
    const lastUserMessage = conversationHistory[conversationHistory.length - 1]?.text;
    if (!lastUserMessage) return "I'm sorry, I didn't understand. Could you please rephrase?";

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

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: lastUserMessage,
            config: {
                systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
};


const AiChatbotWidget: React.FC<AiChatbotWidgetProps> = ({ debtorData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: 'ai',
            text: "Hello! I'm your AI assistant. How can I help you today?",
            suggestions: [
                "What was this debt for?",
                "Can I get a discount?",
                "I can't pay this month",
            ]
        }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text?: string) => {
        const messageText = text || inputValue;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: messageText };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        const aiResponseText = await getChatbotResponse(newMessages, debtorData);
        const aiMessage: Message = { sender: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-accent text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-sky-500 transition-transform hover:scale-110"
                aria-label="Open AI Assistant"
            >
                <Icon name="robot" className="h-8 w-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-brand-secondary rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Icon name="robot" className="h-6 w-6 text-brand-accent" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Your Financial Helper</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                    <Icon name="x" className="h-6 w-6" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-accent text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {messages[messages.length-1]?.suggestions && (
                    <div className="space-y-2 pt-2">
                        {messages[messages.length-1].suggestions?.map((suggestion, i) => (
                             <button 
                                key={i} 
                                onClick={() => handleSendMessage(suggestion)}
                                className="w-full text-left text-sm p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-brand-accent font-semibold hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                             <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a question..."
                        className="w-full p-3 pr-12 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    />
                    <button onClick={() => handleSendMessage()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 dark:text-slate-400 hover:text-brand-accent dark:hover:text-brand-accent">
                        <Icon name="arrow-right" className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiChatbotWidget;
