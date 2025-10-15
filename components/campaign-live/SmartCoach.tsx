import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { LiveCall, SmartCoachDirective, SmartCoachDirectiveType } from '../../types';

const mockDirectives: Omit<SmartCoachDirective, 'id' | 'callId'>[] = [
    { timestamp: 18, type: 'sentiment_warning', message: 'Debtor sentiment dropping. Switch to "Hostile Debtor" playbook if it continues.' },
    { timestamp: 35, type: 'objection_missed', message: 'Objection "I already paid" detected. Agent did not respond. Triggering "Payment Tracing" playbook.' },
    { timestamp: 52, type: 'playbook_suggestion', message: 'Debtor mentioned losing their job. Suggest "Hardship Payment Plan" playbook.' },
];

const directiveConfig: Record<SmartCoachDirectiveType, { icon: any, color: string }> = {
    sentiment_warning: { icon: 'trending-up', color: 'text-yellow-500' },
    objection_missed: { icon: 'shield-check', color: 'text-red-500' },
    playbook_suggestion: { icon: 'drip', color: 'text-sky-500' },
    human_intervention: { icon: 'user', color: 'text-purple-500' }
};

interface SmartCoachProps {
    call: LiveCall | null;
}

const SmartCoach: React.FC<SmartCoachProps> = ({ call }) => {
    const [directives, setDirectives] = useState<SmartCoachDirective[]>([]);

    useEffect(() => {
        if (call && call.status === 'Connected') {
            const newDirectives = mockDirectives.map((d, i) => ({
                ...d,
                id: `dir_${call.id}_${i}`,
                callId: call.id,
            })).filter(d => d.timestamp < call.duration);
            setDirectives(newDirectives);
        } else {
            setDirectives([]);
        }
    }, [call]);
    
    if (!call) {
        return (
             <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col h-full items-center justify-center text-center">
                 <Icon name="message-circle-heart" className="h-12 w-12 text-slate-400 mb-4"/>
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart Coach</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Click the "Coach" button on a live call to view real-time AI supervisor insights.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col h-full overflow-hidden">
             <div className="flex items-center gap-3 mb-3 flex-shrink-0">
                <Icon name="message-circle-heart" className="h-6 w-6 text-brand-accent" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart Coach: {call.debtorName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Agent: {call.agent}</p>
                </div>
            </div>
             <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                 {directives.map(d => {
                     const config = directiveConfig[d.type];
                     return (
                         <div key={d.id} className="flex items-start gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                             <Icon name={config.icon} className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.color}`} />
                             <div>
                                 <p className="text-sm text-slate-700 dark:text-slate-200">{d.message}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">@ {d.timestamp}s</p>
                             </div>
                         </div>
                     );
                 })}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex-shrink-0">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Human Supervisor Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button className="text-sm p-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Offer Settlement</button>
                    <button className="text-sm p-2 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Escalate to Human</button>
                </div>
            </div>
        </div>
    );
};

export default SmartCoach;