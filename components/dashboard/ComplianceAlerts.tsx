
import React from 'react';
// FIX: Corrected import path for types.ts
import { ComplianceAlert } from '../../types';
import { Icon } from '../Icon';

interface ComplianceAlertsProps {
    alerts: ComplianceAlert[];
}

const ComplianceAlerts: React.FC<ComplianceAlertsProps> = ({ alerts }) => {
    
    const getSeverityClass = (severity: 'High' | 'Medium' | 'Low') => {
        switch (severity) {
            case 'High': return 'border-red-500 text-red-700 dark:text-red-300';
            case 'Medium': return 'border-orange-500 text-orange-700 dark:text-orange-300';
            case 'Low': return 'border-sky-500 text-sky-700 dark:text-sky-300';
        }
    };
    
    const getIconColorClass = (severity: 'High' | 'Medium' | 'Low') => {
         switch (severity) {
            case 'High': return 'text-red-500 dark:text-brand-danger';
            case 'Medium': return 'text-orange-500 dark:text-brand-warning';
            case 'Low': return 'text-sky-500';
        }
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
                <Icon name="alert-triangle" className="h-6 w-6 text-orange-500 dark:text-brand-warning"/>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Compliance Alert Center</h3>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {alerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-md bg-slate-100 dark:bg-slate-800/50 border-l-4 ${getSeverityClass(alert.severity)}`}>
                        <div className="flex items-start gap-3">
                             <Icon name="warning" className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getIconColorClass(alert.severity)}`}/>
                             <div>
                                <p className="text-sm font-medium">{alert.message}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComplianceAlerts;