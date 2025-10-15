import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths for types
import { CanvasNodeData, NodeData, Edge, Playbook } from '../../types';
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

const mockPlaybooks: Playbook[] = [
    {
        id: 'playbook_zephyr',
        name: 'Zephyr - Empathy First',
        agentId: 'zephyr',
        nodes: [
            { id: 'start-call-1', type: 'start-call', label: 'Start Call', icon: 'call', position: { x: 50, y: 150 }, settings: { openingMessage: 'Hello, may I please speak with {debtor.fullname}? This is a call from a debt collector.' } },
            { id: 'mini-miranda-1', type: 'mini-miranda', label: 'Deliver Disclosure', icon: 'gavel', position: { x: 250, y: 150 }, settings: {} },
            { id: 'end-1', type: 'end', label: 'End Playbook', icon: 'check', position: { x: 450, y: 150 }, settings: {} },
        ],
        edges: [
            { id: 'e1-2', source: 'start-call-1', target: 'mini-miranda-1' },
            { id: 'e2-3', source: 'mini-miranda-1', target: 'end-1' },
        ],
    },
    {
        id: 'playbook_kore',
        name: 'Kore - Direct Assertive',
        agentId: 'kore',
        nodes: [
            { id: 'start-call-k1', type: 'start-call', label: 'Start Call', icon: 'call', position: { x: 50, y: 100 }, settings: { openingMessage: 'Hello {debtor.fullname}. This is a debt collector. I am calling regarding your account with {debtor.originalcreditor}.' } },
            { id: 'negotiate-k1', type: 'payment-negotiation', label: 'Payment Negotiation', icon: 'dollar', position: { x: 250, y: 100 }, settings: {} },
            { id: 'sms-k1', type: 'sms', label: 'Send SMS', icon: 'sms', settings: { message: 'Thank you for your payment arrangement.' }, position: { x: 450, y: 100 } },
            { id: 'end-k1', type: 'end', label: 'End Playbook', icon: 'check', position: { x: 650, y: 100 }, settings: {} },
        ],
        edges: [
            { id: 'ek1-2', source: 'start-call-k1', target: 'negotiate-k1' },
            { id: 'ek2-3', source: 'negotiate-k1', target: 'sms-k1' },
            { id: 'ek3-4', source: 'sms-k1', target: 'end-k1' },
        ],
    },
];


const PlaybookBuilder: React.FC = () => {
    const [playbooks, setPlaybooks] = useState<Playbook[]>(mockPlaybooks);
    const [nodes, setNodes] = useState<CanvasNodeData[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState('zephyr');

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

    const handleSavePlaybook = () => {
        setPlaybooks(currentPlaybooks => {
            const exists = currentPlaybooks.some(p => p.agentId === selectedAgentId);
            if (exists) {
                return currentPlaybooks.map(p =>
                    p.agentId === selectedAgentId ? { ...p, nodes, edges } : p
                );
            } else {
                const newPlaybook: Playbook = {
                    id: `playbook_${selectedAgentId}`,
                    name: `${selectedAgentId.charAt(0).toUpperCase() + selectedAgentId.slice(1)} - Custom`,
                    agentId: selectedAgentId,
                    nodes,
                    edges,
                };
                return [...currentPlaybooks, newPlaybook];
            }
        });
        alert(`Playbook for ${selectedAgentId.charAt(0).toUpperCase() + selectedAgentId.slice(1)} has been saved!`);
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
                            <option value="zephyr">Zephyr</option>
                            <option value="kore">Kore</option>
                            <option value="puck">Puck</option>
                            <option value="charon">Charon</option>
                        </select>
                    </div>
                     <button 
                        onClick={handleSavePlaybook}
                        className="flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors"
                     >
                        <Icon name="check" className="h-5 w-5" />
                        Save Playbook
                    </button>
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
                />
            </div>
        </div>
    );
};

export default PlaybookBuilder;