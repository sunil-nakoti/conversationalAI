import React, { useState, useEffect } from 'react';
import { Mission, MissionGoalType, AIAgentProfile } from '../../types';
import { Icon } from '../Icon';
import { suggestMission } from '../../services/geminiService';
import Tooltip from '../Tooltip';


interface MissionCreatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (missionData: Omit<Mission, 'id' | 'progress'> & { id?: string }) => void;
    missionToEdit: Mission | null;
    agents: AIAgentProfile[];
    missions: Mission[];
}

const missionGoalTypes: MissionGoalType[] = ['Attempts Made', 'RPCs', 'Opt-Ins', 'PTPs', 'Payments Made', 'Opt-Outs'];


const MissionCreatorModal: React.FC<MissionCreatorModalProps> = ({ isOpen, onClose, onSave, missionToEdit, agents, missions }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rewardXp: 1000,
        goal: 100,
        goalType: 'PTPs' as MissionGoalType,
        timeLimitDays: 7,
    });
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionError, setSuggestionError] = useState<string | null>(null);

    useEffect(() => {
        if (missionToEdit) {
            setFormData({
                title: missionToEdit.title,
                description: missionToEdit.description,
                rewardXp: missionToEdit.rewardXp,
                goal: missionToEdit.goal,
                goalType: missionToEdit.goalType,
                timeLimitDays: missionToEdit.timeLimitDays,
            });
        } else {
            // Reset for new mission
            setFormData({
                title: '',
                description: '',
                rewardXp: 1000,
                goal: 100,
                goalType: 'PTPs',
                timeLimitDays: 7,
            });
        }
        setSuggestionError(null);
    }, [missionToEdit, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: (name === 'rewardXp' || name === 'goal' || name === 'timeLimitDays') ? Number(value) : value }));
    };

    const handleSave = () => {
        const missionPayload = {
            ...formData,
            id: missionToEdit?.id,
        };
        onSave(missionPayload);
    };

    const handleSuggestMission = async () => {
        setIsSuggesting(true);
        setSuggestionError(null);
        try {
            const suggestion = await suggestMission(agents, missions);
            setFormData(prev => ({
                ...prev,
                title: suggestion.title || prev.title,
                description: suggestion.description || prev.description,
                goalType: suggestion.goalType || prev.goalType,
                goal: suggestion.goal || prev.goal
            }));
        } catch (error: any) {
            setSuggestionError(error.message || "Failed to get suggestion.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const inputClass = "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white";

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {missionToEdit ? 'Edit Mission' : 'Create New Mission'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <Icon name="x" className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Mission Title</label>
                            <Tooltip content="Analyze agent performance and get an AI-powered mission suggestion.">
                                <button onClick={handleSuggestMission} disabled={isSuggesting} className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-brand-accent hover:text-sky-500 disabled:opacity-50">
                                    <Icon name={isSuggesting ? 'spinner' : 'brain-circuit'} className={`h-4 w-4 ${isSuggesting ? 'animate-spin' : ''}`} />
                                    {isSuggesting ? 'Suggesting...' : 'Suggest Mission'}
                                </button>
                            </Tooltip>
                        </div>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g., Q3 High-Balance Push" />
                        {suggestionError && <p className="text-xs text-red-500 mt-1">{suggestionError}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                        <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className={inputClass} placeholder="Describe the mission objective..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="goalType" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Goal Type</label>
                            <select id="goalType" name="goalType" value={formData.goalType} onChange={handleChange} className={inputClass}>
                                {missionGoalTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="goal" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Goal Value</label>
                            <input type="number" id="goal" name="goal" value={formData.goal} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rewardXp" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Reward XP</label>
                            <input type="number" id="rewardXp" name="rewardXp" value={formData.rewardXp} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="timeLimitDays" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Time Limit (Days)</label>
                            <input type="number" id="timeLimitDays" name="timeLimitDays" value={formData.timeLimitDays} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Save Mission
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionCreatorModal;