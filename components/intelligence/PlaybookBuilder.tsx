import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types
import { CanvasNodeData, NodeData, Edge, Playbook, AIAgentProfile, Objection, NegotiationModel } from '../../types';
import { apiService } from '../../services/apiService';
import DraggableNodeSource from '../drip/DraggableNodeSource';
import WorkflowCanvas from '../drip/WorkflowCanvas';
import SettingsPanel from '../drip/SettingsPanel';
// FIX: Corrected import paths for Icon
import { Icon } from '../Icon';

const nodeSources: NodeData[] = [
    { type: 'start-call', label: 'Start Call', icon: 'call', settings: { openingMessage: '' } },
    { type: 'start-text', label: 'Start Text', icon: 'sms', settings: { message: '' } },
    { type: 'missed-payment', label: 'Missed Payment', icon: 'calendar', settings: { actions: [{ delayDays: 1, actionType: 'sms', message: 'Hi {debtor.fullname}, we noticed you missed a scheduled payment. Please contact us or log in to the portal to resolve this.' }] } },
    { type: 'delay', label: 'Delay', icon: 'wait', settings: { duration: '1', unit: 'days' } },
    { type: 'sms', label: 'Send SMS', icon: 'sms', settings: { message: '' } },
    { type: 'mini-miranda', label: 'Deliver Disclosure', icon: 'gavel'},
    { type: 'voicemail-drop', label: 'Voicemail Drop', icon: 'volume-2', settings: { message: 'This is a message regarding your account. Please return our call at your earliest convenience.' } },
    { type: 'handle-objection', label: 'Handle Objection', icon: 'shield-check' },
    { type: 'payment-negotiation', label: 'Payment Negotiation', icon: 'dollar' },
    { type: 'end', label: 'End Playbook', icon: 'check' },
];

interface PlaybookBuilderProps {
    playbooks: Playbook[];
    setPlaybooks: (playbooks: Playbook[]) => void;
    agents: AIAgentProfile[];
    objections: Objection[];
    negotiationModels: NegotiationModel[];
}

const PlaybookBuilder: React.FC<PlaybookBuilderProps> = ({ playbooks, setPlaybooks, agents, objections, negotiationModels }) => {
    const [nodes, setNodes] = useState<CanvasNodeData[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');

    useEffect(() => {
        const playbook = playbooks.find(p => p.agentId === selectedAgentId);
        if (playbook) {
            setNodes(playbook.nodes);
            setEdges(playbook.edges);
        } else {
            // Default playbook for agents without one saved
            setNodes([{ id: `start-call-${Date.now()}`, type: 'start-call', label: 'Start Call', icon: 'call', position: { x: 50, y: 150 }, settings: { openingMessage: 'Hello, may I please speak with {debtor.fullname}?' } }]);
            setEdges([]);
        }
        setSelectedNodeId(null); // Deselect node when switching playbooks
    }, [selectedAgentId, playbooks]);


    const updateNode = (nodeId: string, data: Partial<CanvasNodeData>) => {
        setNodes(currentNodes =>
            currentNodes.map(node =>
                node.id === nodeId ? { ...node, ...data } : node
            )
        );
    };

    const updateNodeSettings = (nodeId: string, newSettings: any) => {
         setNodes(currentNodes =>
            currentNodes.map(node =>
                node.id === nodeId ? { ...node, settings: { ...node.settings, ...newSettings } } : node
            )
        );
    };

    const handleSavePlaybook = async () => {
        const existingPlaybook = playbooks.find(p => p.agentId === selectedAgentId);

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            if (existingPlaybook) {
                const playbookToUpdate: Playbook = {
                    ...existingPlaybook,
                    nodes,
                    edges,
                };
                const updatedPlaybook = await apiService.updatePlaybook(playbookToUpdate);
                setPlaybooks(currentPlaybooks => 
                    currentPlaybooks.map(p => p.id === updatedPlaybook.id ? updatedPlaybook : p)
                );
            } else {
                const agent = agents.find(a => a.id === selectedAgentId);
                const newPlaybook: Omit<Playbook, 'id'> = {
                    name: `${agent?.name || 'New'} Playbook`,
                    agentId: selectedAgentId,
                    nodes,
                    edges,
                };
                const createdPlaybook = await apiService.createPlaybook(newPlaybook);
                setPlaybooks(currentPlaybooks => [...currentPlaybooks, createdPlaybook]);
            }
            setSaveStatus('success');
        } catch (error) {
            console.error("Failed to save playbook:", error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

    return (
        <div className="flex h-[calc(100vh-230px)] gap-6">
            {/* Sidebar with draggable nodes */}
            <div className="w-64 bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Playbook States</h3>
                <div className="space-y-2 flex-1 overflow-y-auto">
                    {nodeSources.map(node => (
                        <DraggableNodeSource key={node.type} nodeData={node} />
                    ))}
                </div>
                 <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Drag states onto the canvas to build a conversational flow.</p>
                </div>
            </div>

            {/* Main canvas */}
            <div className="flex-1 relative bg-slate-200 dark:bg-slate-900/50 rounded-lg shadow-md border-2 border-dashed border-slate-300 dark:border-slate-700/50">
                 <WorkflowCanvas
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                    updateNode={updateNode}
                 />
                 <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Icon name="robot" className="h-5 w-5 text-sky-600 dark:text-brand-accent"/>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Editing Playbook for:</h2>
                         <select 
                            value={selectedAgentId}
                            onChange={e => setSelectedAgentId(e.target.value)}
                            className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold text-lg rounded-lg focus:ring-brand-accent focus:border-brand-accent block p-2"
                        >
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        {saveStatus === 'success' && <span className="text-sm font-medium text-green-600">Playbook saved!</span>}
                        {saveStatus === 'error' && <span className="text-sm font-medium text-red-600">Failed to save.</span>}
                         <button 
                            onClick={handleSavePlaybook}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-sky-300"
                         >
                            {isSaving ? <Icon name="spinner" className="h-5 w-5 animate-spin" /> : <Icon name="check" className="h-5 w-5" />}
                            {isSaving ? 'Saving...' : 'Save Playbook'}
                        </button>
                    </div>
                 </div>
            </div>

            {/* Settings Panel */}
            <div className="w-80">
                <SettingsPanel 
                    selectedNode={selectedNode}
                    updateNodeSettings={updateNodeSettings}
                    onDelete={() => {
                        if (selectedNodeId) {
                            setNodes(nodes.filter(n => n.id !== selectedNodeId));
                            setEdges(edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
                            setSelectedNodeId(null);
                        }
                    }}
                    objections={objections}
                    playbooks={playbooks}
                    negotiationModels={negotiationModels}
                    onClose={() => setSelectedNodeId(null)}
                />
            </div>
        </div>
    );
};

export default PlaybookBuilder;