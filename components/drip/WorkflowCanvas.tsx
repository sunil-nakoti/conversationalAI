import React, { useRef, useCallback, useState } from 'react';
// FIX: Corrected import path for types.ts
import { CanvasNodeData, NodeData, Edge } from '../../types';
import CanvasNode from './CanvasNode';

interface WorkflowCanvasProps {
    nodes: CanvasNodeData[];
    setNodes: React.Dispatch<React.SetStateAction<CanvasNodeData[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    updateNode: (nodeId: string, data: Partial<CanvasNodeData>) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ nodes, setNodes, edges, setEdges, selectedNodeId, setSelectedNodeId, updateNode }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [drawingEdge, setDrawingEdge] = useState<{ source: string, targetPosition: { x: number, y: number } } | null>(null);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const nodeDataString = e.dataTransfer.getData('application/json');
        if (!nodeDataString || !canvasRef.current) return;

        const nodeData: NodeData = JSON.parse(nodeDataString);
        const canvasBounds = canvasRef.current.getBoundingClientRect();
        
        const newNode: CanvasNodeData = {
            ...nodeData,
            id: `${nodeData.type}-${Date.now()}`,
            position: {
                x: e.clientX - canvasBounds.left - 75, // Center the node on drop
                y: e.clientY - canvasBounds.top - 25,
            },
        };

        setNodes(currentNodes => [...currentNodes, newNode]);
    }, [setNodes]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
        updateNode(nodeId, { position: newPosition });
    };

    const startDrawingEdge = (sourceNodeId: string) => {
        setDrawingEdge({ source: sourceNodeId, targetPosition: { x: 0, y: 0 } }); // Position will be updated on mouse move
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const canvasBounds = canvasRef.current.getBoundingClientRect();
            setDrawingEdge(prev => prev ? { ...prev, targetPosition: { x: e.clientX - canvasBounds.left, y: e.clientY - canvasBounds.top } } : null);
        };
        const handleMouseUp = (e: MouseEvent) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            // setDrawingEdge(null) is handled in completeDrawingEdge
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const completeDrawingEdge = (targetNodeId: string) => {
        if (drawingEdge && drawingEdge.source !== targetNodeId) {
            const newEdge: Edge = {
                id: `edge-${drawingEdge.source}-${targetNodeId}`,
                source: drawingEdge.source,
                target: targetNodeId
            };
            if (!edges.find(e => e.source === newEdge.source && e.target === newEdge.target)) {
                 setEdges(prev => [...prev, newEdge]);
            }
        }
        setDrawingEdge(null);
    };
    
    const getEdgePath = (sourceNode: CanvasNodeData, targetNode: CanvasNodeData) => {
        const sourceX = sourceNode.position.x + 150; // Right handle
        const sourceY = sourceNode.position.y + 25;
        const targetX = targetNode.position.x; // Left handle
        const targetY = targetNode.position.y + 25;
        return `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`;
    };

    return (
        <div
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-full relative"
        >
             <svg className="absolute w-full h-full pointer-events-none text-slate-400 dark:text-slate-600">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                    </marker>
                </defs>
                {edges.map(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    return <path key={edge.id} d={getEdgePath(sourceNode, targetNode)} stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />;
                })}
                 {drawingEdge && (() => {
                    const sourceNode = nodes.find(n => n.id === drawingEdge.source);
                    if (!sourceNode) return null;
                     const sourceX = sourceNode.position.x + 150;
                     const sourceY = sourceNode.position.y + 25;
                     const targetX = drawingEdge.targetPosition.x;
                     const targetY = drawingEdge.targetPosition.y;
                     const path = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`;
                     return (
                        <g className="text-brand-accent">
                            <path d={path} stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray="8 6" />
                            <circle cx={targetX} cy={targetY} r="5" fill="currentColor" />
                        </g>
                    );
                })()}
            </svg>
            {nodes.map(node => (
                <CanvasNode
                    key={node.id}
                    nodeData={node}
                    isSelected={node.id === selectedNodeId}
                    onSelect={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                    }}
                    onDrag={handleNodeDrag}
                    onStartConnectorDrag={startDrawingEdge}
                    onCompleteConnectorDrag={completeDrawingEdge}
                />
            ))}
        </div>
    );
};

export default WorkflowCanvas;