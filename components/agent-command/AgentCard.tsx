import React from 'react';
// FIX: Corrected import path for types
import { AIAgentProfile, Achievement } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

interface AgentCardProps {
    agent: AIAgentProfile;
}

const AchievementIcon: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <Tooltip content={`${achievement.name}: ${achievement.description}`}>
        <Icon name={achievement.icon} className={`h-6 w-6 ${achievement.color}`} />
    </Tooltip>
);

const CollectorStats: React.FC<{ agent: AIAgentProfile }> = ({ agent }) => (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-3 gap-y-4 gap-x-2 text-center">
        <Tooltip content="Right-Party Contact Rate. Percentage of calls where the AI successfully verifies it's speaking to the correct person.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">RPC Rate</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.rpcRate?.toFixed(1)}%</p></div>
        </Tooltip>
        <Tooltip content="Promise-to-Pay Rate. The percentage of calls where the agent successfully secured a promise to pay from the debtor. A key indicator of negotiation success.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">PTP Rate</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.ptpRate?.toFixed(1)}%</p></div>
        </Tooltip>
         <Tooltip content="Total payments collected by this agent.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Payments</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.paymentsMade}</p></div>
        </Tooltip>
        <Tooltip content="Double Opt-In Rate. Percentage of calls where the debtor agrees to receive future communications (SMS/calls). Crucial for compliance.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Opt-In Rate</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.optInRate?.toFixed(1)}%</p></div>
        </Tooltip>
        <Tooltip content="A score from 0-100 representing the agent's adherence to compliance rules. Penalties are applied for infractions, making a high score crucial for minimizing risk.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Compliance</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.complianceScore.toFixed(1)}%</p></div>
        </Tooltip>
        <Tooltip content="Number of debtors who logged into the payment portal, attributed to this agent's outreach.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Logins</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.logins?.toLocaleString()}</p></div>
        </Tooltip>
    </div>
);

const SupervisorStats: React.FC<{ agent: AIAgentProfile }> = ({ agent }) => (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-y-4 gap-x-2 text-center">
        <Tooltip content="Number of real-time coaching interventions or post-call feedback sessions initiated.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Coaching Sessions</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.coachingSessions?.toLocaleString()}</p></div>
        </Tooltip>
        <Tooltip content="The aggregate increase in Promise-to-Pay rate across all agents coached by this supervisor.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Team PTP Lift</p><p className="text-lg font-bold text-slate-900 dark:text-white">+{agent.teamPtpLift?.toFixed(1)}%</p></div>
        </Tooltip>
        <Tooltip content="The average reduction in call handling time for coached agents, indicating improved efficiency.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Efficiency Gain</p><p className="text-lg font-bold text-slate-900 dark:text-white">-{agent.efficiencyGain?.toFixed(1)}%</p></div>
        </Tooltip>
        <Tooltip content="Number of live calls successfully de-escalated or resolved after being escalated by a collector agent.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Escalations Handled</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.escalationsHandled?.toLocaleString()}</p></div>
        </Tooltip>
    </div>
);

const ComplianceStats: React.FC<{ agent: AIAgentProfile }> = ({ agent }) => (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-y-4 gap-x-2 text-center">
         <Tooltip content="Total number of call transcripts and recordings automatically audited for compliance.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Audits Completed</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.auditsCompleted?.toLocaleString()}</p></div>
        </Tooltip>
        <Tooltip content="Number of potential compliance violations (e.g., FDCPA, Mini-Miranda) detected during audits.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Violations Detected</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.violationsDetected?.toLocaleString()}</p></div>
        </Tooltip>
        <Tooltip content="Number of debtor disputes (e.g., 'not my debt') analyzed and flagged for resolution.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Disputes Resolved</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.disputesResolved?.toLocaleString()}</p></div>
        </Tooltip>
        <Tooltip content="Number of new compliance rules or keyword triggers suggested based on trend analysis.">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Policy Updates</p><p className="text-lg font-bold text-slate-900 dark:text-white">{agent.policyUpdates?.toLocaleString()}</p></div>
        </Tooltip>
    </div>
);

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    const xpPercentage = (agent.currentXp / agent.xpToNextLevel) * 100;

    const roleColors = {
        Collector: agent.isPrometheusEnabled ? 'border-orange-500/50 dark:border-orange-400/50' : 'border-slate-200 dark:border-slate-700/50',
        Supervisor: 'border-purple-500/50 dark:border-purple-400/50',
        ComplianceOfficer: 'border-blue-500/50 dark:border-blue-400/50'
    };

    const roleIconColors = {
        Collector: 'text-sky-600 dark:text-brand-accent',
        Supervisor: 'text-purple-600 dark:text-purple-400',
        ComplianceOfficer: 'text-blue-600 dark:text-blue-400'
    };

    const renderStats = () => {
        switch (agent.role) {
            case 'Supervisor': return <SupervisorStats agent={agent} />;
            case 'ComplianceOfficer': return <ComplianceStats agent={agent} />;
            default: return <CollectorStats agent={agent} />;
        }
    };


    return (
        <div className={`relative bg-white dark:bg-brand-secondary p-5 rounded-lg shadow-md border ${roleColors[agent.role]} hover:border-sky-500/50 dark:hover:border-brand-accent/50 transition-colors duration-300 flex flex-col`}>
            {agent.isPrometheusEnabled && (
                <Tooltip content="Prometheus Mode: This agent is autonomously creating and testing challenger versions to self-optimize.">
                    <div className="absolute top-3 right-3 text-orange-400">
                        <Icon name="flame" className="h-5 w-5" />
                    </div>
                </Tooltip>
            )}
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{agent.name}</h4>
                    <p className={`text-sm font-semibold ${roleIconColors[agent.role]}`}>{agent.rankTitle}</p>
                </div>
                <div className="text-right">
                     <p className="text-xs text-slate-500 dark:text-slate-400">Level</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white">{agent.level}</p>
                </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>XP</span>
                    <span>{agent.currentXp.toLocaleString()} / {agent.xpToNextLevel.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2.5">
                    <div 
                        className="bg-brand-accent h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${xpPercentage}%` }}
                    ></div>
                </div>
            </div>
            
            {renderStats()}

            {/* Achievements */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                 <h5 className="text-xs text-slate-500 dark:text-slate-400 mb-2">Achievements Unlocked</h5>
                 {agent.achievements.length > 0 ? (
                    <div className="flex items-center gap-3">
                        {agent.achievements.map(ach => (
                           <AchievementIcon key={ach.id} achievement={ach} />
                        ))}
                    </div>
                 ) : (
                    <p className="text-sm text-slate-500">No achievements yet.</p>
                 )}
            </div>
        </div>
    );
};

export default AgentCard;