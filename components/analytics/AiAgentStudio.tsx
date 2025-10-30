// FIX: Removed invalid file headers that were causing syntax errors.
import React, { useState, useEffect } from 'react';
import PersonalityForge from '../intelligence/PersonalityForge';
import VoiceRecorder from './VoiceRecorder';
import { Icon } from '../Icon';
// FIX: Corrected import path for types.ts
import { IntelligenceTab, AIAgentProfile, AIAgentConfiguration, NegotiationModel, BrandingProfile } from '../../types';
import { apiService } from '../../services/apiService';
import PerformanceTuning from '../intelligence/PerformanceTuning';
import HumanizationSettings from '../intelligence/HumanizationSettings';
import LiveTestCall from '../intelligence/LiveTestCall';
import AgentCreatorModal from './AgentCreatorModal';

interface AiAgentStudioProps {
    agents: AIAgentProfile[];
    setAgents: React.Dispatch<React.SetStateAction<AIAgentProfile[]>>;
    negotiationModels: NegotiationModel[];
    brandingProfiles: BrandingProfile[];
}

const PrometheusStatus: React.FC<{ agent: AIAgentProfile }> = ({ agent }) => {
    if (!agent.isPrometheusEnabled || !agent.prometheusStatus) return null;

    const { challengerName, performanceLift } = agent.prometheusStatus;

    return (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-400/20 to-amber-400/20 dark:from-orange-900/50 dark:to-amber-900/50 rounded-lg border border-orange-400/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon name="flame" className="h-8 w-8 text-orange-500" />
                    <div>
                        <h4 className="font-bold text-orange-800 dark:text-orange-300">Prometheus Mode Active</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Challenger <span className="font-semibold">{challengerName}</span> is live testing with a <span className="font-semibold text-green-600 dark:text-green-400">+{performanceLift}%</span> PTP rate lift.
                        </p>
                    </div>
                </div>
                <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Promote to Champion
                </button>
            </div>
        </div>
    );
};

const AiAgentStudio: React.FC<{ onNavigate: (tab: IntelligenceTab) => void; }> = ({ onNavigate }) => {
    const [agents, setAgents] = useState<AIAgentProfile[]>([]);
    const [negotiationModels, setNegotiationModels] = useState<NegotiationModel[]>([]);
    const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const selectedAgent = agents.find(a => a.id === selectedAgentId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [agentData, intelligenceData] = await Promise.all([
                    apiService.getAgents(),
                    apiService.getIntelligenceData(),
                ]);
                setAgents(agentData);
                setNegotiationModels(intelligenceData.negotiationModels);
                setBrandingProfiles([]); 
                if (agentData.length > 0) {
                    setSelectedAgentId(agentData[0].id);
                }
            } catch (err) {
                setError('Failed to load initial data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleConfigChange = (field: keyof AIAgentConfiguration | 'isPrometheusEnabled', value: any) => {
        if (selectedAgentId) {
            setAgents(prev => prev.map(agent => 
                agent.id === selectedAgentId 
                    ? { ...agent, configuration: { ...agent.configuration, [field as keyof AIAgentConfiguration]: value } }
                    : agent
            ));
        }
    };

    const handlePrometheusToggle = (agentId: string, isEnabled: boolean) => {
        setAgents(prev => prev.map(agent =>
            agent.id === agentId ? { ...agent, isPrometheusEnabled: isEnabled } : agent
        ));
    };

    const handleSaveChanges = async () => {
        if (!selectedAgent) return;
        try {
            const updatedAgent = await apiService.updateAgent(selectedAgent.id, selectedAgent);
            setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
            alert(`Changes for agent '${selectedAgent.name}' have been saved!`);
        } catch (err) {
            alert('Failed to save changes.');
        }
    };

    const handleSaveNewAgent = async (name: string, configuration: AIAgentConfiguration) => {
        try {
            const newAgentData: Omit<AIAgentProfile, 'id'> = {
                name,
                role: 'Collector',
                level: 1,
                rankTitle: 'Rookie',
                currentXp: 0,
                xpToNextLevel: 100,
                totalXp: 0,
                achievements: [],
                ptpRate: 0,
                complianceScore: 100,
                rpcRate: 0,
                optInRate: 0,
                optOutRate: 0,
                paymentsMade: 0,
                logins: 0,
                configuration,
                isPrometheusEnabled: false,
            };
            const savedAgent = await apiService.createAgent(newAgentData);
            setAgents(prev => [...prev, savedAgent]);
            setSelectedAgentId(savedAgent.id);
            setIsCreateModalOpen(false);
        } catch (err) {
            alert('Failed to create agent.');
        }
    };

    const handleDeleteAgent = async () => {
        if (agents.length <= 1) {
            alert("You cannot delete the last agent.");
            return;
        }
        if (!selectedAgent) return;

        if (window.confirm(`Are you sure you want to delete the agent "${selectedAgent.name}"? This action cannot be undone.`)) {
            try {
                await apiService.deleteAgent(selectedAgent.id);
                const remainingAgents = agents.filter(a => a.id !== selectedAgentId);
                setAgents(remainingAgents);
                setSelectedAgentId(remainingAgents[0]?.id || '');
            } catch (err) {
                alert('Failed to delete agent.');
            }
        }
    };

    return (
        <div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Agent Performance & Behavior Tuning Center</h3>
                     <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <Icon name="plus-square" className="h-5 w-5" />
                            Create New Agent
                        </button>
                        <button 
                            onClick={handleSaveChanges}
                            disabled={!selectedAgent}
                            className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:opacity-50"
                        >
                            <Icon name="check" className="h-5 w-5" />
                            Save Changes
                        </button>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Configure your autonomous AI agents. Create new challengers to compete against your champion models.</p>
            </div>
            
            <div className="mt-6 mb-4 flex items-end gap-2">
                <div className="flex-grow max-w-sm">
                    <label htmlFor="agent-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Select Agent to Edit</label>
                    <select
                        id="agent-select"
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white font-semibold focus:ring-brand-accent focus:border-brand-accent"
                    >
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name} {agent.role !== 'Collector' ? `(${agent.role})` : `(${agent.rankTitle})`}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleDeleteAgent}
                    disabled={agents.length <= 1}
                    className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Selected Agent"
                >
                    <Icon name="trash" className="h-5 w-5" />
                </button>
            </div>
            
            {!selectedAgent ? (
                 <div className="flex items-center justify-center h-96 bg-slate-50 dark:bg-brand-secondary/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                    <div className="text-center">
                        <Icon name="robot" className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">No agent selected. Please create an agent to begin.</p>
                    </div>
                </div>
            ) : (
                <>
                    {selectedAgent.role === 'Collector' && <PrometheusStatus agent={selectedAgent} />}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <PersonalityForge
                            agentName={selectedAgent.name}
                            config={selectedAgent.configuration}
                            onConfigChange={handleConfigChange}
                        />
                        <PerformanceTuning
                            config={selectedAgent.configuration}
                            onConfigChange={handleConfigChange}
                            onNavigate={onNavigate}
                            negotiationModels={negotiationModels}
                            isPrometheusEnabled={selectedAgent.isPrometheusEnabled}
                        />
                        <HumanizationSettings
                            config={selectedAgent.configuration}
                            onConfigChange={handleConfigChange}
                        />
                    </div>
                    
                    <LiveTestCall 
                        agents={agents} 
                        selectedAgentId={selectedAgentId} 
                        brandingProfiles={brandingProfiles} 
                    />
                </>
            )}

            <AgentCreatorModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSaveNewAgent}
                negotiationModels={negotiationModels}
            />
        </div>
    );
};

export default AiAgentStudio;