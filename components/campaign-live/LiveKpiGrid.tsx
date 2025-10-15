import React from 'react';
import { LiveCall, LiveSms, IconName, LoginEvent } from '../../types';
import { Icon } from '../Icon';
import LiveLoginNotifications from '../notifications/LiveLoginNotifications';

interface LiveKpiGridProps {
    calls: LiveCall[];
    sms: LiveSms[];
    paymentsMade: number;
    logins: number;
    loginEvents: LoginEvent[];
}

const KpiCard: React.FC<{ icon: IconName; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
        <div className={`p-3 rounded-full bg-slate-100 dark:bg-slate-700 ${color}`}>
            <Icon name={icon} className="h-6 w-6" />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
    </div>
);

const DonutChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">No outcome data yet.</div>;
    }
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex items-center gap-4">
            <svg width="150" height="150" viewBox="0 0 150 150">
                <g transform="rotate(-90 75 75)">
                    {data.map((item, index) => {
                        const dasharray = (item.value / total) * circumference;
                        const slice = (
                            <circle
                                key={index}
                                r={radius}
                                cx="75"
                                cy="75"
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth="20"
                                strokeDasharray={`${dasharray} ${circumference}`}
                                strokeDashoffset={-offset}
                            />
                        );
                        offset += dasharray;
                        return slice;
                    })}
                </g>
            </svg>
            <div className="text-sm space-y-1">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LiveKpiGrid: React.FC<LiveKpiGridProps> = ({ calls, sms, paymentsMade, logins, loginEvents }) => {
    const callsInProgress = calls.filter(c => c.status === 'Ringing' || c.status === 'Connected').length;
    const smsSent = sms.filter(s => s.direction === 'outbound').length;

    const liveOutcomes = [
        { name: 'Completed', value: calls.filter(c => c.status === 'Completed').length, color: '#22C55E' },
        { name: 'Voicemail', value: calls.filter(c => c.status === 'Voicemail').length, color: '#38BDF8' },
        { name: 'Failed', value: calls.filter(c => c.status === 'Failed').length, color: '#F97316' },
        { name: 'In Progress', value: callsInProgress, color: '#A78BFA' },
        { name: 'Portal Logins', value: logins, color: '#C084FC' },
    ];

    return (
        <>
            <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live Metrics</h3>
                    <LiveLoginNotifications loginEvents={loginEvents} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <KpiCard icon="phone" label="Calls in Progress" value={callsInProgress} color="text-brand-accent" />
                    <KpiCard icon="check" label="RPCs (Live)" value={calls.filter(c => c.status === 'Completed').length} color="text-brand-success" />
                    <KpiCard icon="dollar" label="Payments Made" value={paymentsMade} color="text-green-400" />
                    <KpiCard icon="sms" label="SMS Sent" value={smsSent} color="text-sky-400" />
                    <KpiCard icon="user-check" label="Portal Logins" value={logins} color="text-purple-400" />
                </div>
            </div>
            <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Live Outcomes</h3>
                <div className="h-full">
                    <DonutChart data={liveOutcomes} />
                </div>
            </div>
        </>
    );
};

export default LiveKpiGrid;