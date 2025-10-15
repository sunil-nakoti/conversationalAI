import React, { useState, useMemo } from 'react';
import { Payment, ScheduledPayment, IconName } from '../../types';
import { Icon } from '../Icon';
import ReportingActions from './ReportingActions';

interface PaymentHistoryTableProps {
    paymentHistory: Payment[];
    missedPayments: ScheduledPayment[];
    portfolios: { id: string, name: string }[];
}

const ITEMS_PER_PAGE = 10;

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ paymentHistory, missedPayments, portfolios }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Payment, direction: 'asc' | 'desc' } | null>({ key: 'paymentDate', direction: 'desc' });
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        portfolioId: 'all',
        paymentMethod: 'all',
    });

    const filteredAndSortedData = useMemo(() => {
        let data = [...paymentHistory];

        // Filtering
        data = data.filter(p => {
            const paymentDate = new Date(p.paymentDate);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && paymentDate < startDate) return false;
            if (endDate && paymentDate > endDate) return false;
            if (filters.portfolioId !== 'all' && p.portfolioId !== filters.portfolioId) return false;
            if (filters.paymentMethod !== 'all' && p.paymentMethod !== filters.paymentMethod) return false;

            return true;
        });

        // Sorting
        if (sortConfig) {
            data.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return data;
    }, [paymentHistory, filters, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedData, currentPage]);
    
    const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

    const handleSort = (key: keyof Payment) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ sortKey: keyof Payment, label: string }> = ({ sortKey, label }) => (
        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort(sortKey)}>
            <div className="flex items-center gap-1">
                {label}
                {sortConfig?.key === sortKey && <Icon name="chevron-down" className={`h-4 w-4 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />}
            </div>
        </th>
    );

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Detailed Payment History</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <input type="date" value={filters.startDate} onChange={e => setFilters(f => ({...f, startDate: e.target.value}))} className="input-class" />
                <input type="date" value={filters.endDate} onChange={e => setFilters(f => ({...f, endDate: e.target.value}))} className="input-class" />
                <select value={filters.portfolioId} onChange={e => setFilters(f => ({...f, portfolioId: e.target.value}))} className="input-class">
                    <option value="all">All Portfolios</option>
                    {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={filters.paymentMethod} onChange={e => setFilters(f => ({...f, paymentMethod: e.target.value}))} className="input-class">
                    <option value="all">All Methods</option>
                    <option value="Online">Online</option>
                    <option value="Telephonic">Telephonic</option>
                </select>
            </div>

            <ReportingActions paymentHistory={filteredAndSortedData} missedPayments={missedPayments} />

            <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <SortableHeader sortKey="paymentDate" label="Date" />
                            <SortableHeader sortKey="debtorName" label="Debtor Name" />
                            <th scope="col" className="px-6 py-3">Account #</th>
                            <th scope="col" className="px-6 py-3">Portfolio</th>
                            <SortableHeader sortKey="paymentAmount" label="Amount" />
                            <th scope="col" className="px-6 py-3">Method</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Confirmation #</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {paginatedData.map(p => (
                            <tr key={p.id}>
                                <td className="px-6 py-4">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.debtorName}</td>
                                <td className="px-6 py-4">{p.accountNumber}</td>
                                <td className="px-6 py-4">{p.portfolioName}</td>
                                <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">${p.paymentAmount.toFixed(2)}</td>
                                <td className="px-6 py-4">{p.paymentMethod}</td>
                                <td className="px-6 py-4">{p.paymentType}</td>
                                <td className="px-6 py-4 font-mono">{p.confirmationNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Showing {paginatedData.length} of {filteredAndSortedData.length} results</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50"><Icon name="arrow-right" className="h-5 w-5 rotate-180"/></button>
                    <span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50"><Icon name="arrow-right" className="h-5 w-5"/></button>
                </div>
            </div>
        </div>
    );
};

// Add a shared style for inputs for consistency
const _ = <style>{`.input-class { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.375rem; padding: 0.5rem; width: 100%; } .dark .input-class { background-color: #1E293B; border-color: #475569; color: #F8FAFC }`}</style>
export default PaymentHistoryTable;
