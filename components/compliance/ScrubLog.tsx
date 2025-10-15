// FIX: Removed invalid file header.
import React from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { PreDialScrubLogEntry } from '../../types';

interface ScrubLogProps {
    logEntries: PreDialScrubLogEntry[];
}

const StatusBadge: React.FC<{ status: 'Clear' | 'Possible Reassign' | 'High Risk' | 'Litigator Match' }> = ({ status }) => {
    const config = {
        'Clear': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
        'Possible Reassign': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
        'High Risk': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
        'Litigator Match': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${config[status]}`}>{status}</span>;
}


const ScrubLog: React.FC<ScrubLogProps> = ({ logEntries }) => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="shield-check" className="h-6 w-6" />
                </div>
                <div>
                     <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">High-Risk Scrub Audit Log</h3>
                        <Tooltip content="This is an immutable audit trail of every pre-dial compliance check performed for jurisdictions where high-risk scrubbing is enabled.">
                            <Icon name="info" className="h-5 w-5 text-slate-400" />
                        </Tooltip>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review all automated checks for reassigned numbers and known litigators.</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Account #</th>
                            <th scope="col" className="px-6 py-3">Reassigned # Status</th>
                            <th scope="col" className="px-6 py-3">Litigator Status</th>
                            <th scope="col" className="px-6 py-3">Call Blocked</th>
                            <th scope="col" className="px-6 py-3">Block Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logEntries.map(log => (
                            <tr key={log.id} className="border-b border-slate-200 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4">{new Date(log.checkTimestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 font-mono text-slate-900 dark:text-white">{log.phoneNumber}</td>
                                <td className="px-6 py-4">{log.accountNumber}</td>
                                <td className="px-6 py-4"><StatusBadge status={log.reassignedStatus} /></td>
                                <td className="px-6 py-4"><StatusBadge status={log.litigatorStatus} /></td>
                                <td className="px-6 py-4 font-semibold">
                                    {log.wasBlocked 
                                        ? <span className="text-red-600 dark:text-red-400">Yes</span>
                                        : <span className="text-green-600 dark:text-green-400">No</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-xs">{log.blockReason || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScrubLog;