import React, { useState } from 'react';
import { Icon } from '../Icon';
import { PlaybookStep } from '../../types';

interface PlaybookStepProps {
    step: PlaybookStep;
    onUpdate: (step: PlaybookStep) => void;
    onDelete: (stepId: string) => void;
}

const PlaybookStepComponent: React.FC<PlaybookStepProps> = ({ step, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStep, setEditedStep] = useState(step);

    const handleSave = () => {
        onUpdate(editedStep);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedStep(step);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-slate-700 p-4 rounded-lg mb-4 shadow-md">
                <input 
                    type="text"
                    value={editedStep.name}
                    onChange={(e) => setEditedStep({ ...editedStep, name: e.target.value })}
                    className="w-full font-semibold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-sky-500"
                />
                <textarea
                    value={editedStep.content}
                    onChange={(e) => setEditedStep({ ...editedStep, content: e.target.value })}
                    className="w-full mt-2 bg-transparent focus:outline-none"
                    rows={3}
                />
                <div className="flex justify-end mt-2">
                    <button onClick={handleCancel} className="text-sm text-slate-500 mr-2">Cancel</button>
                    <button onClick={handleSave} className="text-sm text-sky-500 font-semibold">Save</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-700 p-4 rounded-lg mb-4 shadow-sm">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold">{step.name}</h4>
                <div>
                    <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                        <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(step.id)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                        <Icon name="trash" className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-2">{step.content}</p>
        </div>
    );
};

export default PlaybookStepComponent;
