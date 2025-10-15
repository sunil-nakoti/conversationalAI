

import React from 'react';
// FIX: Corrected import path for types
import { CircuitBreakerCampaign, Metric } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';

const mockCampaigns: CircuitBreakerCampaign[] = [
    {
        id: 'c1',
        name: 'Portfolio Recovery Q3-2024',
        status: 'ACTIVE',
        metrics: {
            rpcRate: { value: 32.1, baseline: 30.5, status: 'normal' },
            avgCallDuration: { value: 125, baseline: 120, status: 'normal' },
            ptpRate: { value: 18.5, baseline: 18.0, status: 'normal' },
            dropRate: { value: 2.1, baseline: 2.5, status: 'normal' },
        },
    },
    {
        id: 'c2',
        name: 'Midland Credit High-Balance',
        status: 'ALERT',
        metrics: {
            rpcRate: { value: 15.2, baseline: 28.0, status: 'critical' },
            avgCallDuration: { value: 45, baseline: 110, status: 'critical' },
            ptpRate: { value: 5.1, baseline: 15.0, status: 'critical' },
            dropRate: { value: 15.7, baseline: 3.0, status: 'critical' },
        },
    },
     {
        id: 'c3',
        name: 'LVNV Funding Fresh-Placement',
        status: 'PAUSED',
        metrics: {
            rpcRate: { value: 0, baseline: 25.0, status: 'critical' },
            avgCallDuration: { value: 0, baseline: 95, status: 'critical' },
            ptpRate: { value: 0, baseline: 12.0, status: 'critical' },
            dropRate: { value: 0, baseline: 4.0, status: 'critical' },
        },
    },
];

const getStatusClasses = (status: CircuitBreakerCampaign['status']) => {
    switch(status) {
        case 'ACTIVE': return { border: 'border-green-500/50', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10' };
        case 'ALERT': return { border: 'border-red-500/80', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/20' };
        case 'PAUSED': return { border: 'border-yellow-500/60', text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10' };
    }
}

const MetricCard: React.FC<{ label: string; metric: Metric }> = ({ label, metric }) => {
    const diff = metric.value - metric.baseline;
    const isUp = diff > 0;
    const statusColor = metric.status === 'critical' ? 'text-red-500 dark:text-red-400' : metric.status === 'warning' ? 'text-yellow-500 dark:text-yellow-400' : 'text-green-500 dark:text-green-400';

    return (
        <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-md">
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className={`text-xl font-bold ${statusColor}`}>{metric.value.toFixed(1)}</p>
                <p className={`text-xs font-mono ${isUp ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    ({isUp ? '+' : ''}{diff.toFixed(1)})
                </p>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Baseline: {metric.baseline.toFixed(1)}</p>
        </div>
    )
}

const CircuitBreaker: React.FC = () => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="zap" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Autonomous Anomaly Detection</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time monitoring of AI workforce performance. Campaigns are automatically paused if key metrics deviate from their baseline.</p>
                </div>
            </div>
             <div className="space-y-4">
                {mockCampaigns.map(campaign => {
                    const classes = getStatusClasses(campaign.status);
                    return (
                        <div key={campaign.id} className={`p-4 rounded-lg border-l-4 ${classes.border} ${classes.bg}`}>
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-slate-900 dark:text-white">{campaign.name}</h4>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${classes.bg} ${classes.text}`}>{campaign.status}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <MetricCard label="RPC Rate (%)" metric={campaign.metrics.rpcRate} />
                                <MetricCard label="Avg. Duration (s)" metric={campaign.metrics.avgCallDuration} />
                                <MetricCard label="PTP Rate (%)" metric={campaign.metrics.ptpRate} />
                                <MetricCard label="Drop Rate (%)" metric={campaign.metrics.dropRate} />
                            </div>
                            {campaign.status === 'ALERT' && (
                                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/40 rounded-md text-sm text-red-700 dark:text-red-300">
                                    <strong>Alert:</strong> Critical performance deviation detected. Campaign paused. Root cause analysis initiated.
                                </div>
                            )}
                        </div>
                    )
                })}
             </div>
        </div>
    );
};

export default CircuitBreaker;