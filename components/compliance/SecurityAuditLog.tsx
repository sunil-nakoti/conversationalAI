import React from 'react';
import { LoginEvent } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

interface SecurityAuditLogProps {
    loginEvents: LoginEvent[];
}

const SecurityAuditLog: React.FC<SecurityAuditLogProps> = ({ loginEvents }) => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="shield-check" className="h-6 w-6" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Portal Login Audit</h3>
                        <Tooltip content="This log tracks all login attempts to the customer-facing payment portal, including IP address and timestamp.">
                            <Icon name="info" className="h-5 w-5 text-slate-400" />
                        </Tooltip>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review all login events and automatically flagged suspicious activity.</p>
                </div>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Debtor Name</th>
                            <th scope="col" className="px-6 py-3">IP Address</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {loginEvents.map(event => (
                            <tr key={event.id} className={`${event.isFlagged ? 'bg-red-50 dark:bg-red-500/10' : ''}`}>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{new Date(event.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4">{event.debtorName}</td>
                                <td className="px-6 py-4 font-mono">{event.ipAddress}</td>
                                <td className="px-6 py-4 text-center">
                                    {event.isFlagged ? (
                                        <Tooltip content="Multiple logins from this IP in a short period.">
                                            <span className="flex items-center justify-center gap-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                                                <Icon name="warning" className="h-4 w-4" />
                                                Flagged
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                                            OK
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {loginEvents.length === 0 && (
                    <div className="text-center py-16">
                        <Icon name="search" className="h-12 w-12 mx-auto text-slate-400" />
                        <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">No Login Events</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Login attempts to the payment portal will be logged here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityAuditLog;
