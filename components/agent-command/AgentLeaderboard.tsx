import React, { useState } from 'react';
// FIX: Corrected import path for types
import { AIAgentProfile } from '../../types';
import Tooltip from '../Tooltip';

interface AgentLeaderboardProps {
    agents: AIAgentProfile[];
}

type SortKey = 'totalXp' | 'ptpRate' | 'complianceScore' | 'rpcRate' | 'optInRate' | 'optOutRate';

const tooltipContent: Record<SortKey, string> = {
    totalXp: "Total Experience Points. Earned from successful call outcomes and completing missions. Represents the agent's overall experience and effectiveness.",
    rpcRate: "Right-Party Contact Rate. Percentage of calls where the AI successfully verifies it's speaking to the correct person.",
    ptpRate: "Promise-to-Pay Rate. The percentage of calls where the agent successfully secured a promise to pay from the debtor. A key indicator of negotiation success.",
    complianceScore: "A score from 0-100 representing the agent's adherence to compliance rules. Penalties are applied for infractions, making a high score crucial for minimizing risk.",
    optInRate: "Double Opt-In Rate. Percentage of calls where the debtor agrees to receive future communications (SMS/calls). Crucial for compliance.",
    optOutRate: "Opt-Out Rate. The percentage of calls where a debtor explicitly requests to no longer be contacted. A lower rate is better for portfolio health."
};

const AgentLeaderboard: React.FC<AgentLeaderboardProps> = ({ agents }) => {
    const [sortKey, setSortKey] = useState<SortKey>('totalXp');

    const sortedAgents = [...agents].sort((a, b) => {
        if (sortKey === 'optOutRate') {
            // FIX: Use nullish coalescing to provide a default value for optional properties before comparison.
            return (a[sortKey as keyof AIAgentProfile] as number ?? 0) - (b[sortKey as keyof AIAgentProfile] as number ?? 0); // Ascending for opt-out rate (lower is better)
        }
        // FIX: Use nullish coalescing to provide a default value for optional properties before comparison.
        return (b[sortKey as keyof AIAgentProfile] as number ?? 0) - (a[sortKey as keyof AIAgentProfile] as number ?? 0); // Descending for all others
    });

    const TabButton: React.FC<{ label: string; sortValue: SortKey }> = ({ label, sortValue }) => (
        <button
            onClick={() => setSortKey(sortValue)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                sortKey === sortValue ? 'bg-brand-accent text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-center flex-wrap gap-2 mb-3">
                <TabButton label="Total XP" sortValue="totalXp" />
                <TabButton label="RPC %" sortValue="rpcRate" />
                <TabButton label="PTP %" sortValue="ptpRate" />
                <TabButton label="Opt-In %" sortValue="optInRate" />
                <TabButton label="Opt-Out %" sortValue="optOutRate" />
                <TabButton label="Compliance" sortValue="complianceScore" />
            </div>
            <div className="space-y-2">
                {sortedAgents.map((agent, index) => (
                    <div key={agent.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 dark:text-white text-sm w-6 text-center">{index + 1}</span>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">{agent.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Lvl {agent.level}</p>
                            </div>
                        </div>
                        <Tooltip content={tooltipContent[sortKey]}>
                            <span className={`font-bold text-sm cursor-help ${sortKey === 'optOutRate' ? 'text-orange-500 dark:text-orange-400' : 'text-sky-600 dark:text-brand-accent'}`}>
                                {sortKey === 'totalXp' 
                                    ? agent.totalXp.toLocaleString()
                                    // FIX: Added nullish coalescing operator `?? 0` to prevent calling .toFixed() on undefined for agent roles that lack certain metrics.
                                    : `${((agent as any)[sortKey] ?? 0).toFixed(1)}%`
                                }
                            </span>
                        </Tooltip>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentLeaderboard;
