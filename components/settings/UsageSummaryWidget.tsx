
// FIX: Removed invalid file headers that were causing syntax errors.
import React, { useMemo } from 'react';
import { Icon } from '../Icon';
import { BillingMeterEntry, BillingEventType, IconName } from '../../types';

interface UsageSummaryWidgetProps {
    billingLog: BillingMeterEntry[];
    accountCredits: number;
}

const PRICING: Record<BillingEventType, number> = {
    call_minute: 0.013,
    sms_sent: 0.0075,
    high_risk_scrub: 0.05,
};

const UsageSummaryWidget: React.FC<UsageSummaryWidgetProps> = ({ billingLog, accountCredits }) => {

    const summary = useMemo(() => {
        const initialSummary = {
            call_minute: 0,
            sms_sent: 0,
            high_risk_scrub: 0,
        };
        
        return billingLog.reduce((acc, entry) => {
            if (acc.hasOwnProperty(entry.eventType)) {
                acc[entry.eventType] += entry.usageCount;
            }
            return acc;
        }, initialSummary as Record<BillingEventType, number>);

    }, [billingLog]);

    const monthlySpend = useMemo(() => {
        return (
            (summary.call_minute * PRICING.call_minute) +
            (summary.sms_sent * PRICING.sms_sent) +
            (summary.high_risk_scrub * PRICING.high_risk_scrub)
        );
    }, [summary]);

    const remainingCredits = accountCredits - monthlySpend;

    const summaryItems: { eventType: BillingEventType; label: string; icon: IconName }[] = [
        { eventType: 'call_minute', label: 'Total Call Minutes', icon: 'phone' },
        { eventType: 'sms_sent', label: 'SMS Messages Sent', icon: 'sms' },
        { eventType: 'high_risk_scrub', label: 'High-Risk Scrubs', icon: 'shield-check' },
    ];

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="dollar" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Usage & Billing</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Read-only summary of billable events and costs for the current cycle.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryItems.map(item => (
                    <div key={item.eventType} className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
                        <Icon name={item.icon} className="h-8 w-8 text-sky-600 dark:text-brand-accent" />
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{summary[item.eventType].toLocaleString()}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                        </div>
                    </div>
                ))}
                 <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
                    <Icon name="dollar" className="h-8 w-8 text-red-500 dark:text-red-400" />
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${monthlySpend.toFixed(2)}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Spend</p>
                    </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4">
                    <Icon name="credit-card" className="h-8 w-8 text-green-500 dark:text-green-400" />
                    <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${remainingCredits.toFixed(2)}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Account Credits</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageSummaryWidget;
