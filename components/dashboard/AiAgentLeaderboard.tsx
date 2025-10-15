

import React from 'react';
// FIX: Corrected import path for types
import { AgentLeaderboardEntry } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';

interface AiAgentLeaderboardProps {
    data: AgentLeaderboardEntry[];
}

const AiAgentLeaderboard: React.FC<AiAgentLeaderboardProps> = ({ data }) => {
    return (
        <div className="bg-brand-secondary p-6 rounded-lg shadow-lg border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
                <Icon name="leaderboard" className="h-6 w-6 text-brand-accent"/>
                <h3 className="text-xl font-semibold text-white">AI Agent Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-center">Rank</th>
                            <th scope="col" className="px-4 py-3">Agent Name</th>
                            <th scope="col" className="px-4 py-3 text-right">RPC Rate</th>
                            <th scope="col" className="px-4 py-3 text-right">PTP Rate</th>
                            <th scope="col" className="px-4 py-3 text-right">Avg. Sentiment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(agent => (
                             <tr key={agent.rank} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/40">
                                <td className="px-4 py-3 text-center font-bold text-white">{agent.rank}</td>
                                <td className="px-4 py-3 font-medium text-white">{agent.agentName}</td>
                                <td className="px-4 py-3 text-right">{agent.rpcRate.toFixed(1)}%</td>
                                <td className="px-4 py-3 text-right">{agent.ptpRate.toFixed(1)}%</td>
                                <td className="px-4 py-3 text-right text-green-400">{agent.avgSentiment.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AiAgentLeaderboard;