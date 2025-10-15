import React, { useMemo } from 'react';
import { LiveSms } from '../../types';
import { Icon } from '../Icon';

const SmsMessage: React.FC<{ sms: LiveSms }> = ({ sms }) => {
    const isOutbound = sms.direction === 'outbound';
    return (
        <div className={`flex items-end gap-2 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${isOutbound ? 'bg-brand-accent/90 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                <p className="text-sm">{sms.message}</p>
                 {isOutbound && sms.status && (
                    <p className="text-xs text-sky-200 text-right mt-1">{sms.status}</p>
                )}
            </div>
        </div>
    );
};

const SmsThread: React.FC<{ debtorName: string, messages: LiveSms[] }> = ({ debtorName, messages }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
        <p className="font-semibold text-slate-900 dark:text-white text-center text-sm mb-2">{debtorName}</p>
        <div className="space-y-2">
            {messages.map(sms => <SmsMessage key={sms.id} sms={sms} />)}
        </div>
    </div>
);


const LiveSmsFeed: React.FC<{ sms: LiveSms[] }> = ({ sms }) => {
    const smsByDebtor = useMemo(() => {
        return sms.reduce((acc, current) => {
            if (!acc[current.debtorName]) {
                acc[current.debtorName] = [];
            }
            acc[current.debtorName].push(current);
            // Sort messages within each thread by timestamp
            acc[current.debtorName].sort((a, b) => a.timestamp - b.timestamp);
            return acc;
        }, {} as Record<string, LiveSms[]>);
    }, [sms]);

    // Sort threads by the timestamp of the latest message
    const sortedDebtorNames = useMemo(() => {
        return Object.keys(smsByDebtor).sort((a, b) => {
            const lastMessageA = smsByDebtor[a][smsByDebtor[a].length - 1].timestamp;
            const lastMessageB = smsByDebtor[b][smsByDebtor[b].length - 1].timestamp;
            return lastMessageB - lastMessageA;
        });
    }, [smsByDebtor]);

    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
                <Icon name="sms" className="h-6 w-6 text-brand-accent" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live SMS Feed</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {sms.length === 0 && (
                     <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                        <p>Waiting for SMS events...</p>
                    </div>
                )}
                {sortedDebtorNames.map(debtorName => (
                    <SmsThread key={debtorName} debtorName={debtorName} messages={smsByDebtor[debtorName]} />
                ))}
            </div>
        </div>
    );
};

export default LiveSmsFeed;