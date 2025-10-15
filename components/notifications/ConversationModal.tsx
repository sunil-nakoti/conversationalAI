// FIX: Removed invalid file headers that were causing syntax errors.
import React, { useState, useEffect, useRef } from 'react';
import { Notification, SmsMessage, BillingEventType } from '../../types';
import { Icon } from '../Icon';

interface ConversationModalProps {
    notification: Notification;
    onClose: () => void;
    logBillingEvent: (eventType: BillingEventType, usageCount: number) => void;
}

const mockConversations: Record<string, SmsMessage[]> = {
    "STEVEN DAME": [
        { id: 'm1', sender: 'AI', text: 'Hello Steven, this is a message from ARC regarding account #SD-123. Please call us at 800-555-1234 to discuss this matter.', timestamp: '2025-08-19T13:30:00Z' },
        { id: 'm2', sender: 'Debtor', text: 'I got laid off i cant pay right now', timestamp: '2025-08-19T13:32:00Z' },
        { id: 'm3', sender: 'AI', text: 'I understand that things are difficult right now. We may be able to set up a temporary hardship plan. Would you be open to discussing that?', timestamp: '2025-08-19T13:33:00Z' },
    ],
    "Duane Fulford": [
        { id: 'm4', sender: 'AI', text: 'Hi Duane, we are trying to reach you about your account with Midland. Please contact us at your earliest convenience.', timestamp: '2025-08-11T10:00:00Z' },
        { id: 'm5', sender: 'Debtor', text: 'wrong number', timestamp: '2025-08-11T10:01:00Z' },
    ],
    // Add other conversations as needed
};

type AiStatus = 'active' | 'paused' | 'manual';

const ConversationModal: React.FC<ConversationModalProps> = ({ notification, onClose, logBillingEvent }) => {
    const [messages, setMessages] = useState<SmsMessage[]>([]);
    const [aiStatus, setAiStatus] = useState<AiStatus>('active');
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(mockConversations[notification.debtorName] || []);
    }, [notification.debtorName]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const message: SmsMessage = {
            id: `msg_${Date.now()}`,
            sender: 'Agent (Manual)',
            text: newMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        // Log the sent SMS for billing
        logBillingEvent('sms_sent', 1);
    };
    
    const handleStatusChange = (newStatus: AiStatus, systemMessage: string) => {
        setAiStatus(newStatus);
        const message: SmsMessage = {
            id: `sys_${Date.now()}`,
            sender: 'System',
            text: systemMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, message]);
    };

    const getStatusIndicator = () => {
        switch(aiStatus) {
            case 'active': return { text: 'AI is Active', color: 'text-green-400', icon: 'robot' as const };
            case 'paused': return { text: 'AI is Paused', color: 'text-yellow-400', icon: 'pause' as const };
            case 'manual': return { text: 'Manual Control', color: 'text-sky-400', icon: 'user-check' as const };
        }
    };
    const statusIndicator = getStatusIndicator();

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Conversation with {notification.debtorName}</h2>
                        <div className={`flex items-center gap-2 text-sm font-semibold ${statusIndicator.color}`}>
                           <Icon name={statusIndicator.icon} className="h-4 w-4" />
                           <span>{statusIndicator.text}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => {
                        if (msg.sender === 'System') {
                            return (
                                <div key={msg.id} className="text-center text-xs text-slate-400 dark:text-slate-500 italic">
                                   --- {msg.text} ---
                                </div>
                            );
                        }
                        const isDebtor = msg.sender === 'Debtor';
                        const isManual = msg.sender === 'Agent (Manual)';
                        return (
                             <div key={msg.id} className={`flex items-end gap-2 ${isDebtor ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-md p-3 rounded-lg ${
                                    isDebtor ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none' 
                                    : isManual ? 'bg-sky-600 text-white rounded-br-none' 
                                    : 'bg-brand-accent text-white rounded-br-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${isDebtor ? 'text-slate-500' : 'text-sky-100/70'} ${isDebtor ? 'text-left' : 'text-right'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Action Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                     <div className="flex items-center gap-2 mb-2">
                        {aiStatus === 'active' && (
                            <button onClick={() => handleStatusChange('paused', 'AI Paused by Agent')} className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20 px-3 py-1.5 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-500/30">
                                <Icon name="pause" className="h-4 w-4" /> Pause AI
                            </button>
                        )}
                         {aiStatus === 'paused' && (
                            <button onClick={() => handleStatusChange('active', 'AI Resumed by Agent')} className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20 px-3 py-1.5 rounded-md hover:bg-green-200 dark:hover:bg-green-500/30">
                                <Icon name="play" className="h-4 w-4" /> Resume AI
                            </button>
                        )}
                        {aiStatus !== 'manual' && (
                             <button onClick={() => handleStatusChange('manual', 'Manual takeover by Agent')} className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/20 px-3 py-1.5 rounded-md hover:bg-sky-200 dark:hover:bg-sky-500/30">
                                <Icon name="user-check" className="h-4 w-4" /> Take Over
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={aiStatus === 'manual' ? "Type your message..." : "Take over to send a message"}
                            disabled={aiStatus !== 'manual'}
                            className="w-full p-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white disabled:opacity-50"
                        />
                        <button onClick={handleSendMessage} disabled={aiStatus !== 'manual'} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationModal;