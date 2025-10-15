

import React, { useState } from 'react';
// FIX: Corrected import paths to be relative to the components directory.
// FIX: Imported Edge type.
import { CanvasNodeData, NodeData, Edge } from '../types';
import DraggableNodeSource from './drip/DraggableNodeSource';
import WorkflowCanvas from './drip/WorkflowCanvas';
import SettingsPanel from './drip/SettingsPanel';
import { Icon } from './Icon';

const nodeSources: NodeData[] = [
    { type: 'start', label: 'Start Trigger', icon: 'arrow-right' },
    { type: 'wait', label: 'Wait Period', icon: 'wait', settings: { duration: '1', unit: 'days' } },
    { type: 'sms', label: 'Send SMS', icon: 'sms', settings: { message: '' } },
    { type: 'email', label: 'Send Email', icon: 'email', settings: { subject: '', body: '' } },
    { type: 'call', label: 'Make AI Call', icon: 'call' },
    { type: 'end', label: 'End Campaign', icon: 'check' },
];

const DripCampaigns: React.FC = () => {
    const [nodes, setNodes] = useState<CanvasNodeData[]>([]);
    // FIX: Added state for edges.
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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

    const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

    return (
        <div className="flex h-[calc(100vh-160px)] gap-6">
            {/* Sidebar with draggable nodes */}
            <div className="w-64 bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Workflow Nodes</h3>
                <div className="space-y-2">
                    {nodeSources.map(node => (
                        <DraggableNodeSource key={node.type} nodeData={node} />
                    ))}
                </div>
                <div className="mt-auto text-center p-2 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                     <p className="text-xs text-slate-500 dark:text-slate-400">Drag nodes onto the canvas to build your campaign.</p>
                </div>
            </div>

            {/* Main canvas */}
            <div className="flex-1 relative bg-slate-200 dark:bg-slate-900/50 rounded-lg shadow-md border-2 border-dashed border-slate-300 dark:border-slate-700/50">
                 <WorkflowCanvas
                    nodes={nodes}
                    setNodes={setNodes}
                    // FIX: Passed edges and setEdges props to WorkflowCanvas.
                    edges={edges}
                    setEdges={setEdges}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                    updateNode={updateNode}
                 />
                 <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-2 rounded-lg">
                    <Icon name="drip" className="h-5 w-5 text-brand-accent"/>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Drip Campaign</h2>
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
                            // FIX: Added logic to remove edges connected to the deleted node.
                            setEdges(edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
                            setSelectedNodeId(null);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default DripCampaigns;