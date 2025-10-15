import React, { useState, useEffect } from 'react';
import LiveDashboard from './campaign-live/LiveDashboard';
import { LoginEvent, LiveCall, LiveSms, IconName, SmartCoachDirective } from '../types';
import InteractionLog from './campaign-live/InteractionLog';
import { Icon } from './Icon';
import SmartCoach from './campaign-live/SmartCoach';

const mockDebtors = ['John D.', 'Jane S.', 'Peter J.', 'Mary L.', 'David C.', 'Sarah P.'];
const mockAgents = ['Zephyr', 'Kore', 'Puck', 'Charon'];
const mockSmsMessages = [
    "Hi, just a reminder about your account.",
    "Can you call me back?",
    "I can't pay this right now.",
    "Okay, I will make a payment today.",
    "Is this the final amount?",
];

// Centralized mock data simulation for all live components
const useLiveMockData = () => {
    const [calls, setCalls] = useState<LiveCall[]>([]);
    const [sms, setSms] = useState<LiveSms[]>([]);
    const [paymentsMade, setPaymentsMade] = useState(0);
    const [logins, setLogins] = useState(0);

    useEffect(() => {
        const callInterval = setInterval(() => {
            const newCall: LiveCall = {
                id: `call_${Date.now()}`,
                debtorName: mockDebtors[Math.floor(Math.random() * mockDebtors.length)],
                agent: mockAgents[Math.floor(Math.random() * mockAgents.length)],
                status: 'Ringing',
                sentiment: 'Neutral',
                duration: 0,
                timestamp: Date.now(),
            };

            setCalls(prev => [newCall, ...prev.slice(0, 19)]); // Keep last 20 calls

            setTimeout(() => {
                setCalls(prev => prev.map(c => c.id === newCall.id ? { ...c, status: 'Connected', sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)] as LiveCall['sentiment'] } : c));
            }, 3000);

            let duration = 0;
            const durationInterval = setInterval(() => {
                duration++;
                 setCalls(prev => prev.map(c => c.id === newCall.id ? { ...c, duration } : c));
            }, 1000);

            setTimeout(() => {
                clearInterval(durationInterval);
                setCalls(prev => prev.map(c => c.id === newCall.id ? { ...c, status: ['Completed', 'Voicemail', 'Failed'][Math.floor(Math.random() * 3)] as LiveCall['status'] } : c));
            }, 8000 + Math.random() * 10000);

        }, 8000);

        const smsInterval = setInterval(() => {
            const direction = Math.random() > 0.5 ? 'inbound' : 'outbound';
            const newSms: LiveSms = {
                id: `sms_${Date.now()}`,
                debtorName: mockDebtors[Math.floor(Math.random() * mockDebtors.length)],
                direction,
                message: mockSmsMessages[Math.floor(Math.random() * mockSmsMessages.length)],
                timestamp: Date.now(),
                status: direction === 'outbound' ? 'Delivered' : undefined,
            };
            setSms(prev => [newSms, ...prev]);
        }, 12000);
        
        const paymentInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setPaymentsMade(prev => prev + 1);
            }
        }, 15000);
        
        const loginInterval = setInterval(() => {
            if (Math.random() > 0.5) {
                setLogins(prev => prev + 1);
            }
        }, 10000);

        return () => {
            clearInterval(callInterval);
            clearInterval(smsInterval);
            clearInterval(paymentInterval);
            clearInterval(loginInterval);
        };
    }, []);

    return { calls, sms, paymentsMade, logins };
};


interface CampaignLiveProps {
    loginEvents: LoginEvent[];
}

const CampaignLive: React.FC<CampaignLiveProps> = ({ loginEvents }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'log'>('dashboard');
    const { calls, sms, paymentsMade, logins } = useLiveMockData();
    const [coachedCallId, setCoachedCallId] = useState<string | null>(null);

    const coachedCall = calls.find(c => c.id === coachedCallId) || null;

    const TabButton: React.FC<{ tab: 'dashboard' | 'log'; label: string; icon: IconName }> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                    ? 'border-brand-accent text-brand-accent'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
        >
            <Icon name={icon} className="h-5 w-5" />
            {label}
        </button>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-2">
                    <TabButton tab="dashboard" label="Live Dashboard" icon="dashboard" />
                    <TabButton tab="log" label="AI Agent Interaction Log" icon="clipboard-list" />
                </nav>
            </div>
            <div className="flex-1 pt-4 overflow-hidden">
                {activeTab === 'dashboard' && (
                     <LiveDashboard
                        calls={calls}
                        sms={sms}
                        paymentsMade={paymentsMade}
                        logins={logins}
                        loginEvents={loginEvents}
                        coachedCallId={coachedCallId}
                        setCoachedCallId={setCoachedCallId}
                        coachedCall={coachedCall}
                    />
                )}
                {activeTab === 'log' && (
                    <InteractionLog
                        calls={calls}
                        sms={sms}
                        loginEvents={loginEvents}
                    />
                )}
            </div>
        </div>
    );
};

export default CampaignLive;