

import React, { useState } from 'react';
// FIX: Corrected import path for types.ts
import { Portfolio, Debtor, DebtorStatus } from '../types';
import DebtorDetailModal from './DebtorDetailModal';
import { Icon } from './Icon';

interface DebtorTableProps {
    portfolio: Portfolio;
    onBack: () => void;
    onUpdateDebtorStatus: (debtorId: string, status: DebtorStatus) => void;
    onShowNotification: (debtor: Debtor, message: string, icon: 'check' | 'warning') => void;
}

const DebtorTable: React.FC<DebtorTableProps> = ({ portfolio, onBack, onUpdateDebtorStatus, onShowNotification }) => {
    const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-brand-accent mb-4">
                <Icon name="arrow-right" className="h-4 w-4 transform rotate-180" />
                Back to Portfolios
            </button>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Debtors for: {portfolio.name}</h2>
            
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                       <tr>
                            <th scope="col" className="px-6 py-3">Full Name</th>
                            <th scope="col" className="px-6 py-3">Account #</th>
                            <th scope="col" className="px-6 py-3">Balance</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                             <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                         {(portfolio.debtors || []).map(debtor => (
                            <tr key={debtor.id} className="border-b border-slate-200 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{debtor.fullname}</td>
                                <td className="px-6 py-4">{debtor.accountnumber}</td>
                                <td className="px-6 py-4">${debtor.currentbalance.toLocaleString()}</td>
                                <td className="px-6 py-4">{debtor.status}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => setSelectedDebtor(debtor)} className="font-medium text-sky-600 dark:text-brand-accent hover:underline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                         ))}
                    </tbody>
                </table>
            </div>
            {selectedDebtor && <DebtorDetailModal debtor={selectedDebtor} onClose={() => setSelectedDebtor(null)} />}
        </div>
    );
};

export default DebtorTable;