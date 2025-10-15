

import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';
// FIX: Corrected import path for types
import { CallLogEntry } from '../../types';

// Mock Data generation to simulate a real call log
const generateMockPastCalls = (): CallLogEntry[] => {
    const statuses: CallLogEntry['status'][] = ['completed', 'voicemail', 'no answer', 'invalid'];
    const sentiments: CallLogEntry['sentiment'][] = ['Positive', 'Neutral', 'Negative'];
    const now = new Date();
    return Array.from({ length: 15 }, (_, i) => {
        const createdAt = new Date(now.getTime() - (i * 3 * 60 * 60 * 1000 + Math.random() * 3 * 60 * 60 * 1000));
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const duration = status === 'completed' ? Math.floor(Math.random() * 300) + 5 : 0;
        const numberSuffix = String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0');
        const areaCode = ['918', '979', '641', '316', '830'][Math.floor(Math.random() * 5)];
        
        return {
            id: `call_${i}`,
            callNumber: `+1${areaCode}770${numberSuffix.slice(0, 4)}`,
            createdAt: createdAt.toISOString(),
            scheduledTime: createdAt.toISOString(),
            status,
            inbound: Math.random() > 0.5,
            duration,
            hasRecording: status === 'completed',
            aiSupervisorScore: status === 'completed' ? Math.floor(Math.random() * 40) + 60 : undefined,
            sentiment: status === 'completed' ? sentiments[Math.floor(Math.random() * sentiments.length)] : undefined,
        };
    });
};

const mockPastCalls = generateMockPastCalls();
const totalCalls = 78770; // From image

const FilterPill: React.FC<{ label: string, active?: boolean, onClick?: () => void }> = ({ label, active, onClick }) => (
    <button className={`px-3 py-1 text-sm rounded-full transition-colors ${active ? 'bg-brand-accent text-white' : 'bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`} onClick={onClick}>
        {label}
    </button>
);

const CallLog: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'past' | 'queued'>('past');
    const [calls] = useState(mockPastCalls);
    const [sortConfig, setSortConfig] = useState<{ key: keyof CallLogEntry, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    const [filters, setFilters] = useState({
        search: '',
        score: 'all', // 'all', '>80', '<70'
        sentiment: 'all', // 'all', 'Positive', 'Neutral', 'Negative'
        outcome: 'all', // 'all', 'completed', ...
    });

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const sortedCalls = useMemo(() => {
        let filtered = [...calls].filter(call => {
            const searchLower = filters.search.toLowerCase();
            const searchMatch = !filters.search ||
                call.callNumber.includes(searchLower) ||
                call.status.toLowerCase().includes(searchLower);

            const scoreMatch = filters.score === 'all' ||
                (filters.score === '>80' && call.aiSupervisorScore && call.aiSupervisorScore > 80) ||
                (filters.score === '<70' && call.aiSupervisorScore && call.aiSupervisorScore < 70);
            
            const sentimentMatch = filters.sentiment === 'all' || call.sentiment === filters.sentiment;

            const outcomeMatch = filters.outcome === 'all' || call.status === filters.outcome;

            return searchMatch && scoreMatch && sentimentMatch && outcomeMatch;
        });
        
        const sorted = filtered.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sorted;
    }, [calls, sortConfig, filters]);

    const handleSort = (key: keyof CallLogEntry) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDuration = (seconds: number) => `${seconds}s`;
    
    return (
        <>
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calls</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{totalCalls.toLocaleString()} past calls</p>
            </div>

            {/* Tabs */}
            <div className="mt-4 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-4">
                    <button 
                        onClick={() => setActiveTab('past')}
                        className={`py-2 px-1 text-sm font-semibold transition-colors ${activeTab === 'past' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                        Past Calls
                    </button>
                    <button 
                        onClick={() => setActiveTab('queued')}
                        className={`py-2 px-1 text-sm font-semibold transition-colors ${activeTab === 'queued' ? 'text-brand-accent border-b-2 border-brand-accent' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                        Queued Calls
                    </button>
                </nav>
            </div>

            {/* Filters */}
            <div className="my-6 p-4 bg-white dark:bg-brand-secondary rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-4">
                <div className="relative">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by phone number, debtor, or status..." 
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 pl-10 pr-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white" 
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select value={filters.outcome} onChange={e => handleFilterChange('outcome', e.target.value)} className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white"><option value="all">All Outcomes</option><option value="completed">Completed</option><option value="voicemail">Voicemail</option><option value="no answer">No Answer</option><option value="invalid">Invalid</option></select>
                    <select value={filters.sentiment} onChange={e => handleFilterChange('sentiment', e.target.value)} className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white"><option value="all">All Sentiments</option><option value="Positive">Positive</option><option value="Neutral">Neutral</option><option value="Negative">Negative</option></select>
                    <select value={filters.score} onChange={e => handleFilterChange('score', e.target.value)} className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white"><option value="all">All Scores</option><option value=">80">Score &gt; 80</option><option value="<70">Score &lt; 70</option></select>
                    <input type="date" className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white" />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-brand-secondary rounded-lg border border-slate-200 dark:border-slate-700/50 flex-1">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Call Number</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                                <div className="flex items-center gap-1">
                                    Created At
                                    {sortConfig.key === 'createdAt' && (
                                        <Icon name="chevron-down" className={`h-4 w-4 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Sentiment</th>
                            <th scope="col" className="px-6 py-3">AI Score</th>
                            <th scope="col" className="px-6 py-3">Duration</th>
                            <th scope="col" className="px-6 py-3">Recording</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCalls.map(call => (
                            <tr key={call.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">{call.callNumber}</td>
                                <td className="px-6 py-4">{formatDate(call.createdAt)}</td>
                                <td className="px-6 py-4 capitalize">{call.status}</td>
                                <td className="px-6 py-4">{call.sentiment || 'N/A'}</td>
                                <td className="px-6 py-4 font-semibold">{call.aiSupervisorScore || 'N/A'}</td>
                                <td className="px-6 py-4">{formatDuration(call.duration)}</td>
                                <td className="px-6 py-4">
                                    {call.hasRecording && (
                                        <button className="p-1 text-slate-500 dark:text-slate-400 hover:text-brand-accent">
                                            <Icon name="clipboard-list" className="h-5 w-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CallLog;