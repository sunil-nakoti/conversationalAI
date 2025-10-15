import React from 'react';
// FIX: Corrected import path for types
import { Mission } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';

interface MissionsBoardProps {
    missions: Mission[];
    onEdit: (mission: Mission) => void;
    onDelete: (missionId: string) => void;
}

const MissionCard: React.FC<{ mission: Mission; onEdit: (mission: Mission) => void; onDelete: (missionId: string) => void; }> = ({ mission, onEdit, onDelete }) => {
    const progressPercentage = (mission.progress / mission.goal) * 100;

    return (
        <div className="group relative bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(mission)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">
                    <Icon name="settings" className="h-4 w-4"/>
                </button>
                <button onClick={() => onDelete(mission.id)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 rounded-md">
                    <Icon name="trash" className="h-4 w-4"/>
                </button>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white">{mission.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reward: {mission.rewardXp.toLocaleString()} XP</p>
                </div>
                <div className="text-xs text-yellow-500 dark:text-yellow-400 flex items-center gap-1">
                    <Icon name="wait" className="h-4 w-4" />
                    <span>{mission.timeLimitDays}d left</span>
                </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 my-2">{mission.description}</p>
            <div>
                 <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{mission.progress} / {mission.goal} {mission.goalType}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2">
                    <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};


const MissionsBoard: React.FC<MissionsBoardProps> = ({ missions, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            {missions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {missions.map(mission => (
                        <MissionCard key={mission.id} mission={mission} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">No active missions. Click 'Create Mission' to add one.</p>
                </div>
            )}
        </div>
    );
};

export default MissionsBoard;