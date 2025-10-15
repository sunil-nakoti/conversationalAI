import React from 'react';
// FIX: Corrected import path for Icon component.
import { Icon } from '../Icon';

const OptimalPathSimulator: React.FC = () => {
    return (
         <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                 <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="trending-up" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Optimal Path Simulator</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Simulate campaign outcomes based on different playbook paths and agent tactics.</p>
                </div>
            </div>
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                <p className="text-slate-500 dark:text-slate-400">Simulation controls and results will be displayed here.</p>
            </div>
        </div>
    );
};

export default OptimalPathSimulator;
