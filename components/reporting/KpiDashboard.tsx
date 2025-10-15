import React from 'react';
import { Kpi } from '../../types';
import KpiCard from '../KpiCard';
import { DonutChart, BarChart } from './Charts';

interface KpiDashboardProps {
    summary: {
        totalCollected: number;
        totalPayments: number;
        avgPayment: number;
        methodBreakdown: Record<string, number>;
        typeBreakdown: Record<string, number>;
    };
    missedCount: number;
}

const KpiDashboard: React.FC<KpiDashboardProps> = ({ summary, missedCount }) => {

    const kpis: Kpi[] = [
        {
            label: 'Total Collected (30d)',
            value: `$${summary.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            description: 'Sum of all completed payments in the last 30 days.',
            icon: 'dollar',
            color: 'success',
        },
        {
            label: 'Total Payments (30d)',
            value: summary.totalPayments.toLocaleString(),
            description: 'Count of all completed payments in the last 30 days.',
            icon: 'shopping-cart',
            color: 'accent',
        },
        {
            label: 'Avg. Payment Amount',
            value: `$${summary.avgPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            description: 'Average value of each completed payment.',
            icon: 'trending-up',
            color: 'warning',
        },
        {
            label: 'Missed Payments',
            value: missedCount.toLocaleString(),
            description: 'Scheduled payments that are past due.',
            icon: 'calendar',
            color: 'danger',
        }
    ];

    const methodChartData = [
        { name: 'Online', value: summary.methodBreakdown['Online'] || 0, color: '#38BDF8' },
        { name: 'Telephonic', value: summary.methodBreakdown['Telephonic'] || 0, color: '#A78BFA' },
    ];
    
    const typeChartData = [
        { name: 'Settlement', value: summary.typeBreakdown['Settlement'] || 0, color: '#22C55E' },
        { name: 'Payment Plan', value: summary.typeBreakdown['Payment Plan'] || 0, color: '#F97316' },
        { name: 'Custom', value: summary.typeBreakdown['Custom'] || 0, color: '#60A5FA' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
            
            <div className="md:col-span-1 lg:col-span-2 bg-white dark:bg-brand-secondary p-5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Telephonic vs. Online Payments</h3>
                <DonutChart data={methodChartData} />
            </div>
            
            <div className="md:col-span-1 lg:col-span-2 bg-white dark:bg-brand-secondary p-5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                 <h3 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Payment Type Breakdown</h3>
                 <BarChart data={typeChartData} />
            </div>
        </div>
    );
};

export default KpiDashboard;
