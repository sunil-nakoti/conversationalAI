import React from 'react';

const SmartCoach: React.FC = () => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Smart Coach</h2>
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                <p className="text-slate-500 dark:text-slate-400">Real-time AI coaching insights will be available here.</p>
            </div>
        </div>
    );
};

export default SmartCoach;