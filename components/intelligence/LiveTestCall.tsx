import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { AIAgentProfile, BrandingProfile } from '../../types';

type CallStatus = 'idle' | 'dialing' | 'connected' | 'completed' | 'failed';

interface LiveTestCallProps {
    agents: AIAgentProfile[];
    selectedAgentId: string;
    brandingProfiles: BrandingProfile[];
}

const LiveTestCall: React.FC<LiveTestCallProps> = ({ agents, selectedAgentId, brandingProfiles }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [callStatus, setCallStatus] = useState<CallStatus>('idle');
    const [callLog, setCallLog] = useState<string[]>([]);
    const [callDuration, setCallDuration] = useState(0);
    const durationInterval = useRef<number | null>(null);
    const [selectedBrandingId, setSelectedBrandingId] = useState<string>(brandingProfiles[0]?.id || '');

    useEffect(() => {
        if (callStatus === 'connected') {
            durationInterval.current = window.setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (durationInterval.current) {
                clearInterval(durationInterval.current);
                durationInterval.current = null;
            }
        }
        return () => {
            if (durationInterval.current) {
                clearInterval(durationInterval.current);
            }
        };
    }, [callStatus]);

    const handleStartCall = () => {
        if (!phoneNumber) return;

        const agent = agents.find(a => a.id === selectedAgentId);
        const brand = brandingProfiles.find(b => b.id === selectedBrandingId);
        if (!agent || !brand) {
            setCallLog(['Error: Could not find selected agent or branding profile.']);
            return;
        }

        // --- DYNAMIC PROMPT INJECTION ---
        const basePrompt = agent.configuration.systemPrompt;
        const finalPrompt = basePrompt
            .replace(/{branding.companyName}/g, brand.companyName)
            .replace(/{branding.phoneNumber}/g, brand.phoneNumber);


        setCallStatus('dialing');
        setCallLog([
            `--- PREPARING CALL ---`,
            `Base Prompt: "${basePrompt}"`,
            `Final Injected Prompt: "${finalPrompt}"`,
            `--- STARTING CALL ---`,
            `Dialing ${phoneNumber}...`
        ]);
        setCallDuration(0);

        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
                setCallStatus('connected');
                setCallLog(prev => [...prev, 'Call connected.']);

                setTimeout(() => setCallLog(prev => [...prev, 'Agent: Hello, this is a test call from Arc AI.']), 1000);
                setTimeout(() => setCallLog(prev => [...prev, 'System: You can now speak to test the agent.']), 2500);
                setTimeout(() => {
                    if (callStatus !== 'failed' && callStatus !== 'idle') { // check if call wasn't cancelled
                        setCallStatus('completed');
                        setCallLog(prev => [...prev, 'Call completed.']);
                    }
                }, 15000); // 15 second call

            } else {
                setCallStatus('failed');
                setCallLog(prev => [...prev, 'Call failed to connect.']);
            }
        }, 3000);
    };

    const handleEndCall = () => {
        setCallStatus('completed');
        setCallLog(prev => [...prev, 'Call ended by user.']);
    };
    
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const getStatusIndicator = () => {
        switch (callStatus) {
            case 'idle':
                return <span className="text-slate-400">Idle</span>;
            case 'dialing':
                return <span className="text-sky-500 animate-pulse">Dialing...</span>;
            case 'connected':
                return <span className="text-green-500 animate-pulse">Connected ({formatDuration(callDuration)})</span>;
            case 'completed':
                return <span className="text-slate-500">Completed ({formatDuration(callDuration)})</span>;
            case 'failed':
                return <span className="text-red-500">Failed</span>;
        }
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 mt-6">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="beaker" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live Agent Testing Sandbox</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Place a live, monitored test call to any phone number to evaluate the currently configured agent in real-time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="test-phone-number" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Phone Number to Call</label>
                    <input
                        id="test-phone-number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter a valid phone number"
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                        disabled={callStatus === 'dialing' || callStatus === 'connected'}
                    />
                </div>
                 <div className="md:col-span-1">
                    <label htmlFor="branding-select-test" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Branding Profile</label>
                    <select
                        id="branding-select-test"
                        value={selectedBrandingId}
                        onChange={(e) => setSelectedBrandingId(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                        disabled={callStatus === 'dialing' || callStatus === 'connected'}
                    >
                        {brandingProfiles.map(p => (
                            <option key={p.id} value={p.id}>{p.companyName}</option>
                        ))}
                    </select>
                </div>
                <div>
                     {(callStatus === 'dialing' || callStatus === 'connected') ? (
                        <button
                            onClick={handleEndCall}
                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Icon name="phone" className="h-5 w-5" />
                            End Call
                        </button>
                    ) : (
                        <button
                            onClick={handleStartCall}
                            disabled={!phoneNumber}
                            className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            <Icon name="phone" className="h-5 w-5" />
                            Start Test Call
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 min-h-[150px]">
                 <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Call Log & System Prompt</h4>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <span>Status:</span>
                        {getStatusIndicator()}
                    </div>
                </div>
                <div className="space-y-1 text-xs font-mono text-slate-600 dark:text-slate-400 h-24 overflow-y-auto">
                    {callLog.map((log, index) => (
                        <p key={index} className="animate-fade-in-down">{`[${new Date().toLocaleTimeString()}] ${log}`}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveTestCall;