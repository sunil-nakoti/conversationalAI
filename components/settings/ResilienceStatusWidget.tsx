import React from 'react';
import { Icon } from '../Icon';
import { ResilienceStatus } from '../../types';

interface ResilienceStatusWidgetProps {
    status: ResilienceStatus;
}

const StatusItem: React.FC<{ label: string; value: string; isOk: boolean }> = ({ label, value, isOk }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
            <Icon name={isOk ? 'check' : 'warning'} className={`h-5 w-5 ${isOk ? 'text-green-500' : 'text-red-500'}`} />
        </div>
    </div>
);


const ResilienceStatusWidget: React.FC<ResilienceStatusWidgetProps> = ({ status }) => {
    const timeSinceBackup = Math.floor((new Date().getTime() - new Date(status.lastBackup).getTime()) / 1000 / 60);

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="shield-check" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Resilience & Business Continuity</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time status of disaster recovery and backup systems.</p>
                </div>
            </div>
            <div className="space-y-1">
                <StatusItem label="Last Successful Backup" value={`${timeSinceBackup} minutes ago`} isOk={timeSinceBackup < 60} />
                <StatusItem label="Disaster Recovery Status" value={status.drStatus} isOk={status.drStatus === 'Active-Active'} />
                <StatusItem label="Replication Lag" value={`${status.replicationLag} seconds`} isOk={status.replicationLag < 30} />
                <StatusItem label="Estimated Recovery Time" value={status.estimatedRTO} isOk={true} />
            </div>
        </div>
    );
};

export default ResilienceStatusWidget;
