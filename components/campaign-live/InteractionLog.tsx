import React, { useMemo } from 'react';
import { LiveCall, LiveSms, LoginEvent, IconName } from '../../types';
import { Icon } from '../Icon';

interface InteractionLogProps {
    calls: LiveCall[];
    sms: LiveSms[];
    loginEvents: LoginEvent[];
}

type InteractionEvent = {
    id: string;
    timestamp: number;
    type: 'Call' | 'SMS' | 'Login';
    debtorName: string;
    agent?: string;
    details: string;
    icon: IconName;
};

const InteractionLog: React.FC<InteractionLogProps> = ({ calls, sms, loginEvents }) => {

    const interactionEvents = useMemo(() => {
        const callEvents: InteractionEvent[] = calls.map(call => ({
            id: call.id,
            timestamp: call.timestamp,
            type: 'Call',
            debtorName: call.debtorName,
            agent: call.agent,
            details: `Status: ${call.status}, Duration: ${call.duration}s`,
            icon: 'phone',
        }));

        const smsEvents: InteractionEvent[] = sms.map(s => ({
            id: s.id,
            timestamp: s.timestamp,
            type: 'SMS',
            debtorName: s.debtorName,
            agent: s.direction === 'inbound' ? 'Debtor' : 'System',
            details: s.message,
            icon: 'sms',
        }));

        const loginEventsMapped: InteractionEvent[] = loginEvents.map(event => ({
            id: event.id,
            timestamp: new Date(event.timestamp).getTime(),
            type: 'Login',
            debtorName: event.debtorName,
            details: `Login from IP: ${event.ipAddress}`,
            icon: 'user-check',
        }));

        return [...callEvents, ...smsEvents, ...loginEventsMapped]
            .sort((a, b) => b.timestamp - a.timestamp);

    }, [calls, sms, loginEvents]);

    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">AI Agent Interaction Log</h3>
            <div className="flex-1 overflow-y-auto pr-2">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-8"></th>
                            <th scope="col" className="px-4 py-3">Timestamp</th>
                            <th scope="col" className="px-4 py-3">Debtor</th>
                            <th scope="col" className="px-4 py-3">Agent</th>
                            <th scope="col" className="px-4 py-3">Event Type</th>
                            <th scope="col" className="px-4 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {interactionEvents.map(event => (
                            <tr key={event.id}>
                                <td className="px-4 py-3"><Icon name={event.icon} className="h-5 w-5 text-slate-400" /></td>
                                <td className="px-4 py-3 whitespace-nowrap">{new Date(event.timestamp).toLocaleTimeString()}</td>
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{event.debtorName}</td>
                                <td className="px-4 py-3">{event.agent || 'N/A'}</td>
                                <td className="px-4 py-3"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{event.type}</span></td>
                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 truncate max-w-xs">{event.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {interactionEvents.length === 0 && (
                    <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                        <p>Waiting for interaction events...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractionLog;