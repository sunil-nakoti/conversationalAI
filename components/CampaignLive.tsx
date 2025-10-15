import React, { useState, useEffect } from 'react';
import LiveDashboard from './campaign-live/LiveDashboard';
import { LoginEvent, LiveCall, LiveSms, IconName, SmartCoachDirective } from '../types';
import InteractionLog from './campaign-live/InteractionLog';
import { Icon } from './Icon';
import SmartCoach from './campaign-live/SmartCoach';
import { apiService } from '../services/apiService';

// Custom hook to poll for live data from the backend
const useLiveBackendData = () => {
    const [liveData, setLiveData] = useState<{ calls: LiveCall[], sms: LiveSms[], paymentsMade: number, logins: number }>({
        calls: [],
        sms: [],
        paymentsMade: 0,
        logins: 0,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiService.getLiveUpdates();
                setLiveData(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch live updates:", err);
                setError("Live connection lost. Attempting to reconnect...");
            }
        };

        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return { ...liveData, error };
};


interface CampaignLiveProps {
    loginEvents: LoginEvent[]; // Assuming this still comes from props for now
}

const CampaignLive: React.FC<CampaignLiveProps> = ({ loginEvents }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'log'>('dashboard');
    const { calls, sms, paymentsMade, logins, error } = useLiveBackendData();
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
            {error && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-pulse">
                    {error}
                </div>
            )}
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
