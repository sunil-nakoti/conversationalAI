import React, { useRef } from 'react';
// FIX: Corrected import path for types.ts
import { CanvasNodeData } from '../../types';
import { Icon } from '../Icon';

interface CanvasNodeProps {
    nodeData: CanvasNodeData;
    isSelected: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onDrag: (nodeId: string, newPosition: { x: number, y: number }) => void;
    onStartConnectorDrag: (nodeId: string) => void;
    onCompleteConnectorDrag: (nodeId: string) => void;
}

const CanvasNode: React.FC<CanvasNodeProps> = ({ nodeData, isSelected, onSelect, onDrag, onStartConnectorDrag, onCompleteConnectorDrag }) => {
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(e);
        dragOffset.current = {
            x: e.clientX - nodeData.position.x,
            y: e.clientY - nodeData.position.y,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        onDrag(nodeData.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    
    const ConnectorHandle: React.FC<{onMouseDown: (e: React.MouseEvent) => void}> = ({ onMouseDown }) => (
        <div 
            onMouseDown={onMouseDown}
            className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-slate-400 dark:border-slate-500 hover:bg-brand-accent hover:border-sky-400 dark:hover:border-sky-400 cursor-pointer transition-all transform hover:scale-125"
        />
    );


    return (
        <div
            style={{
                left: `${nodeData.position.x}px`,
                top: `${nodeData.position.y}px`,
                cursor: 'grab',
            }}
            onMouseUp={() => onCompleteConnectorDrag(nodeData.id)}
            className={`group absolute p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 flex items-center gap-3 select-none w-[150px] justify-center transition-all duration-150
                ${isSelected 
                    ? 'border-brand-accent shadow-lg shadow-sky-500/20' 
                    : 'border-slate-300 dark:border-slate-600'
                }`
            }
        >
            {/* Input Handle */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-slate-400 dark:border-slate-500" />
            </div>

            <div onMouseDown={handleMouseDown} className="flex items-center gap-2 w-full justify-center">
                <Icon name={nodeData.icon} className="h-5 w-5 text-sky-600 dark:text-brand-accent flex-shrink-0" />
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{nodeData.label}</span>
            </div>

             {/* Output Handle */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ConnectorHandle onMouseDown={(e) => { e.stopPropagation(); onStartConnectorDrag(nodeData.id); }} />
            </div>
        </div>
    );
};

export default CanvasNode;