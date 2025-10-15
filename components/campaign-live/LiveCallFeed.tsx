
import React, { useState } from 'react';
import { LiveCall } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

const statusConfig: Record<LiveCall['status'], { icon: 'phone' | 'check' | 'warning' | 'sms' | 'spinner', color: string, text: string }> = {
    Ringing: { icon: 'phone', color: 'text-sky-400', text: 'Ringing...' },
    Connected: { icon: 'phone', color: 'text-green-400', text: 'Connected' },
    Completed: { icon: 'check', color: 'text-slate-400', text: 'Completed' },
    Voicemail: { icon: 'sms', color: 'text-yellow-400', text: 'Left Voicemail' },
    Failed: { icon: 'warning', color: 'text-red-400', text: 'Call Failed' },
};

const sentimentConfig: Record<LiveCall['sentiment'], { icon: string, color: string }> = {
    Positive: { icon: '🙂', color: 'text-green-400' },
    Neutral: { icon: '😐', color: 'text-sky-400' },
    Negative: { icon: '😠', color: 'text-red-400' },
};

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

const CallCard: React.FC<{ call: LiveCall; isCoached: boolean; onToggleCoach: (callId: string) => void; }> = ({ call, isCoached, onToggleCoach }) => {
    const config = statusConfig[call.status];
    const sentiment = sentimentConfig[call.sentiment];
    
    return (
        <div className={`p-3 rounded-lg flex items-center gap-3 transition-all animate-fade-in-down ${isCoached ? 'bg-sky-100 dark:bg-sky-900/40 ring-2 ring-brand-accent' : 'bg-slate-100 dark:bg-slate-800/50'}`}>
            <Icon name={config.icon} className={`h-6 w-6 flex-shrink-0 ${config.color} ${call.status === 'Connected' || call.status === 'Ringing' ? 'animate-pulse' : ''}`} />
            <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-white">{call.debtorName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Agent: {call.agent}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-right">
                {call.status === 'Connected' && (
                    <span className={`text-lg ${sentiment.color}`}>{sentiment.icon}</span>
                )}
                 {call.status === 'Connected' && (
                    <Tooltip content="Toggle Smart Coach">
                        <button
                            onClick={() => onToggleCoach(call.id)}
                            className={`p-1.5 rounded-md transition-colors ${
                                isCoached
                                ? 'bg-brand-accent/20 text-brand-accent' 
                                : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Icon name="message-circle-heart" className="h-4 w-4" />
                        </button>
                    </Tooltip>
                )}
                <span className="font-mono text-slate-600 dark:text-slate-300 w-12">{formatDuration(call.duration)}</span>
                <span className={`font-semibold w-28 text-left ${config.color}`}>{config.text}</span>
            </div>
        </div>
    );
};

// FIX: Corrected the type for the state setter function to allow functional updates.
const LiveCallFeed: React.FC<{ calls: LiveCall[]; coachedCallId: string | null; setCoachedCallId: React.Dispatch<React.SetStateAction<string | null>>; }> = ({ calls, coachedCallId, setCoachedCallId }) => {
    const handleToggleCoach = (callId: string) => {
        setCoachedCallId(prev => (prev === callId ? null : callId));
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
                <Icon name="phone" className="h-6 w-6 text-brand-accent" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live Call Feed</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                 {calls.length === 0 && (
                    <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                        <p>Waiting for call events...</p>
                    </div>
                )}
                {calls.map(call => (
                    <CallCard 
                        key={call.id} 
                        call={call} 
                        isCoached={coachedCallId === call.id}
                        onToggleCoach={handleToggleCoach}
                    />
                ))}
            </div>
        </div>
    );
};

export default LiveCallFeed;
