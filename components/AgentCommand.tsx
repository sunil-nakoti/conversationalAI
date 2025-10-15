import React, { useState, useEffect } from 'react';
import { AIAgentProfile, Mission, View } from '../types';
import AgentCard from './agent-command/AgentCard';
import MissionsBoard from './agent-command/MissionsBoard';
import AgentLeaderboard from './agent-command/AgentLeaderboard';
import { Icon } from './Icon';
import Tooltip from './Tooltip';
import MissionCreatorModal from './agent-command/MissionCreatorModal';
import { apiService } from '../services/apiService';

const AgentCommandSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-brand-secondary rounded-md mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
                <div className="h-64 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
                <div className="h-96 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
            </div>
            <div className="space-y-6">
                <div className="h-64 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
                <div className="h-96 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
            </div>
        </div>
    </div>
);


interface AgentCommandProps {
    onViewChange: (view: View) => void;
}

const AgentCommand: React.FC<AgentCommandProps> = ({ onViewChange }) => {
    const [agents, setAgents] = useState<AIAgentProfile[]>([]);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const [editingMission, setEditingMission] = useState<Mission | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [agentsData, missionsData] = await Promise.all([
                apiService.getAgents(),
                apiService.getMissions(),
            ]);
            setAgents(agentsData);
            setMissions(missionsData);
        } catch (err: any) {
            setError(err.message || "Failed to load agent data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const managementAis = agents.filter(a => a.role === 'Supervisor' || a.role === 'ComplianceOfficer');
    const collectorAis = agents.filter(a => a.role === 'Collector');

    const handleOpenCreateModal = () => {
        setEditingMission(null);
        setIsMissionModalOpen(true);
    };

    const handleOpenEditModal = (mission: Mission) => {
        setEditingMission(mission);
        setIsMissionModalOpen(true);
    };

    const handleDeleteMission = async (missionId: string) => {
        if (window.confirm('Are you sure you want to delete this mission?')) {
            try {
                await apiService.deleteMission(missionId);
                setMissions(prev => prev.filter(m => m.id !== missionId));
            } catch (err) {
                alert('Failed to delete mission.');
            }
        }
    };

    const handleSaveMission = async (missionData: Omit<Mission, 'id' | 'progress'> & { id?: string; progress?: number }) => {
        try {
            const savedMission = await apiService.saveMission(missionData);
            if (missionData.id) {
                setMissions(prev => prev.map(m => m.id === savedMission.id ? savedMission : m));
            } else {
                setMissions(prev => [savedMission, ...prev]);
            }
            setIsMissionModalOpen(false);
        } catch (err) {
            alert('Failed to save mission.');
        }
    };
    
    if (loading) return <AgentCommandSkeleton />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    
    return (
        <section>
             <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Agents</h2>
                <Tooltip content="Manage and monitor your AI workforce. Track agent levels, experience points (XP), achievements, and performance on the leaderboard.">
                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                </Tooltip>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Management & Oversight Section */}
                    <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Icon name="brain-circuit" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Management & Oversight AI</h3>
                                    <Tooltip content="These AI profiles monitor, coach, and ensure the compliance of your collector agents.">
                                        <Icon name="info" className="h-5 w-5 text-slate-400" />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {managementAis.map(agent => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                        </div>
                    </div>

                    {/* Collector Agent Barracks */}
                    <div>
                         <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-2">
                                    <Icon name="robot" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Collector Agent Barracks</h3>
                                    <Tooltip content="View all your AI collector agents as 'character cards'. Monitor their level, XP progress, core KPIs, and unlocked achievements at a glance.">
                                        <Icon name="info" className="h-5 w-5 text-slate-400" />
                                    </Tooltip>
                                </div>
                            </div>
                            <button onClick={() => onViewChange('intelligence')} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <Icon name="brain-circuit" className="h-5 w-5" />
                                Go to AI Studio
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {collectorAis.map(agent => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                     <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                             <div className="flex items-center gap-2">
                                <Icon name="award" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Active Missions</h3>
                                <Tooltip content="Time-bound challenges for your AI agents. Completing missions provides bonus XP and helps incentivize specific behaviors.">
                                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                                </Tooltip>
                            </div>
                            <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <Icon name="plus-square" className="h-5 w-5" />
                                Create Mission
                            </button>
                        </div>
                        <MissionsBoard 
                            missions={missions}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteMission}
                        />
                    </div>
                    <div>
                         <div className="flex items-center gap-3 mb-4">
                             <div className="flex items-center gap-2">
                                <Icon name="leaderboard" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Agent Leaderboard</h3>
                                <Tooltip content="Ranks all AI agents based on key performance metrics. Use the tabs to sort by different KPIs.">
                                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                                </Tooltip>
                            </div>
                        </div>
                        <AgentLeaderboard agents={agents} />
                    </div>
                </div>
            </div>
            <MissionCreatorModal 
                isOpen={isMissionModalOpen}
                onClose={() => setIsMissionModalOpen(false)}
                onSave={handleSaveMission}
                missionToEdit={editingMission}
                agents={agents}
                missions={missions}
            />
        </section>
    );
};

export default AgentCommand;
