import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { apiService } from '../../services/apiService';

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

        try {
            const response = await apiService.getChatbotResponse(newMessages, debtorData);
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chatbot API call failed:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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