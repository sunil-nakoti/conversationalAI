import React, { useState } from 'react';
import { Portfolio, PortfolioStatus, LoginEvent } from '../types';
import { Icon } from './Icon';
import Tooltip from './Tooltip';
import LiveLoginNotifications from './notifications/LiveLoginNotifications';

interface PortfolioTableProps {
    portfolios: Portfolio[];
    onViewDebtors: (portfolio: Portfolio) => void;
    selectedPortfolioIds: Set<string>;
    setSelectedPortfolioIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    onUpdateStatus: (portfolioId: string, status: PortfolioStatus) => void;
    onUpdateSettlementOffer: (portfolioId: string, percentage: number) => void;
    loginEvents: LoginEvent[];
}

const getStatusClass = (status: Portfolio['status']) => {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
        case 'Idle':
            return 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300';
        case 'Paused':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
        case 'Completed':
            return 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300';
        default:
            return 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300';
    }
};

const getScoreColor = (score: number) => {
    if (score > 75) return 'text-green-500 dark:text-green-400';
    if (score > 40) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
};

const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolios, onViewDebtors, selectedPortfolioIds, setSelectedPortfolioIds, onUpdateStatus, onUpdateSettlementOffer, loginEvents }) => {
    
    const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
    const [settlementValue, setSettlementValue] = useState<string>('');

    const handleSelect = (portfolioId: string) => {
        setSelectedPortfolioIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(portfolioId)) {
                newSet.delete(portfolioId);
            } else {
                newSet.add(portfolioId);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPortfolioIds(new Set(portfolios.map(p => p.id)));
        } else {
            setSelectedPortfolioIds(new Set());
        }
    };

    const handleEdit = (portfolio: Portfolio) => {
        setEditingPortfolioId(portfolio.id);
        setSettlementValue(String(portfolio.settlementOfferPercentage || ''));
    };

    const handleCancel = () => {
        setEditingPortfolioId(null);
        setSettlementValue('');
    };

    const handleSave = () => {
        if (editingPortfolioId) {
            const percentage = parseInt(settlementValue, 10);
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                onUpdateSettlementOffer(editingPortfolioId, percentage);
                handleCancel();
            } else {
                alert('Please enter a valid percentage between 0 and 100.');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Portfolios</h2>
                <LiveLoginNotifications loginEvents={loginEvents} />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="p-4">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent"
                                    onChange={handleSelectAll}
                                    checked={portfolios.length > 0 && selectedPortfolioIds.size === portfolios.length}
                                    />
                            </th>
                            <th scope="col" className="px-6 py-3">Portfolio Name</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Pay Score</th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex items-center gap-1">
                                    Settlement Offer %
                                    <Tooltip content="The maximum settlement percentage the AI agent is authorized to offer for this portfolio.">
                                        <Icon name="info" className="h-4 w-4 text-slate-400" />
                                    </Tooltip>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3"># of Accounts</th>
                            <th scope="col" className="px-6 py-3">Avg. Balance</th>
                            <th scope="col" className="px-6 py-3">Total Balance</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolios.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                    No portfolios imported yet. Upload a CSV file to get started.
                                </td>
                            </tr>
                        ) : (
                            portfolios.map(portfolio => (
                                <tr key={portfolio.id} className="border-b border-slate-200 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent"
                                            checked={selectedPortfolioIds.has(portfolio.id)}
                                            onChange={() => handleSelect(portfolio.id)}
                                        />
                                    </td>
                                    <td onClick={() => onViewDebtors(portfolio)} className="px-6 py-4 font-medium text-slate-900 dark:text-white cursor-pointer hover:underline">{portfolio.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(portfolio.status)}`}>
                                            {portfolio.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {portfolio.averagePropensityScore !== undefined && (
                                            <div className={`font-bold text-lg ${getScoreColor(portfolio.averagePropensityScore)}`}>
                                                {portfolio.averagePropensityScore.toFixed(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingPortfolioId === portfolio.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={settlementValue}
                                                    onChange={(e) => setSettlementValue(e.target.value)}
                                                    className="w-20 p-1 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                                    autoFocus
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                                                />
                                                 <button onClick={handleSave} className="p-1 text-green-500 hover:text-green-600" title="Save">
                                                    <Icon name="check" className="h-5 w-5" />
                                                </button>
                                                <button onClick={handleCancel} className="p-1 text-red-500 hover:text-red-600" title="Cancel">
                                                    <Icon name="x" className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 group">
                                                <span className="font-semibold text-slate-800 dark:text-white">
                                                    {portfolio.settlementOfferPercentage !== undefined 
                                                        ? `${portfolio.settlementOfferPercentage}%` 
                                                        : 'N/A'}
                                                </span>
                                                <button onClick={() => handleEdit(portfolio)} className="p-1 text-slate-400 hover:text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" title="Edit Settlement Offer">
                                                     <Icon name="settings" className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{portfolio.numberOfAccounts.toLocaleString()}</td>
                                    <td className="px-6 py-4">${portfolio.averageBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4">${portfolio.settlementFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                            {portfolio.status === 'Idle' && (
                                                 <button onClick={() => onUpdateStatus(portfolio.id, 'Active')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-accent rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Start Campaign">
                                                    <Icon name="rocket" className="h-5 w-5" />
                                                </button>
                                            )}
                                            {portfolio.status === 'Active' && (
                                                <>
                                                    <button onClick={() => onUpdateStatus(portfolio.id, 'Paused')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-yellow-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Pause Campaign">
                                                        <Icon name="pause" className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => onUpdateStatus(portfolio.id, 'Completed')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-sky-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Mark as Complete">
                                                        <Icon name="check" className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                            {portfolio.status === 'Paused' && (
                                                <>
                                                    <button onClick={() => onUpdateStatus(portfolio.id, 'Active')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-green-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Resume Campaign">
                                                        <Icon name="play" className="h-5 w-5" />
                                                    </button>
                                                     <button onClick={() => onUpdateStatus(portfolio.id, 'Completed')} className="p-2 text-slate-500 dark:text-slate-400 hover:text-sky-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Mark as Complete">
                                                        <Icon name="check" className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortfolioTable;