
import React from 'react';
// FIX: Corrected import path for types
import { NodeData } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';

interface DraggableNodeSourceProps {
    nodeData: NodeData;
}

const DraggableNodeSource: React.FC<DraggableNodeSourceProps> = ({ nodeData }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('application/json', JSON.stringify(nodeData));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="flex items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-grab active:cursor-grabbing hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
            <Icon name={nodeData.icon} className="h-5 w-5 mr-3 text-sky-600 dark:text-brand-accent" />
            <span className="text-sm font-medium text-slate-800 dark:text-white">{nodeData.label}</span>
        </div>
    );
};

export default DraggableNodeSource;