
import React from 'react';
// FIX: Corrected import path for types.ts
import { Kpi, KpiColor } from '../types';
import { Icon } from './Icon';

const KpiCard: React.FC<Kpi> = ({ label, value, description, icon, color = 'accent' }) => {
    
    const colorClasses: Record<KpiColor, { bg: string; text: string }> = {
        accent: { bg: 'bg-sky-100 dark:bg-brand-accent/20', text: 'text-sky-600 dark:text-brand-accent' },
        success: { bg: 'bg-green-100 dark:bg-brand-success/20', text: 'text-green-600 dark:text-brand-success' },
        warning: { bg: 'bg-orange-100 dark:bg-brand-warning/20', text: 'text-orange-600 dark:text-brand-warning' },
        danger: { bg: 'bg-red-100 dark:bg-brand-danger/20', text: 'text-red-600 dark:text-brand-danger' },
    };

    const selectedColor = colorClasses[color];

    return (
        <div className="bg-white dark:bg-brand-secondary p-5 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-brand-text">{label}</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
                <p className="text-xs text-slate-400 mt-2">{description}</p>
            </div>
            <div className={`p-4 rounded-full ${selectedColor.bg} ${selectedColor.text}`}>
                <Icon name={icon} className="h-8 w-8" />
            </div>
        </div>
    );
};

export default KpiCard;