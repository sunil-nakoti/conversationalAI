
import React from 'react';
// FIX: Corrected import path for types.ts
import { PtpEntry } from '../../types';
import { Icon } from '../Icon';

interface TodaysPtpsProps {
    ptps: PtpEntry[];
}

const TodaysPtps: React.FC<TodaysPtpsProps> = ({ ptps }) => {

    const getStatusClass = (status: 'Paid' | 'Unpaid') => {
        return status === 'Paid' 
            ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
                <Icon name="dollar" className="h-6 w-6 text-green-600 dark:text-brand-success"/>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Today's PTPs</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {ptps.map(ptp => (
                    <div key={ptp.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">{ptp.debtorName}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">${ptp.amount.toFixed(2)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(ptp.status)}`}>
                            {ptp.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodaysPtps;