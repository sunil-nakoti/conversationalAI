import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Notification, NotificationPriority, NotificationStatus, BillingEventType } from '../types';
import ConversationModal from './notifications/ConversationModal';
import { apiService } from '../services/apiService';

const priorityOptions: NotificationPriority[] = ['high', 'normal', 'low'];
const statusOptions: NotificationStatus[] = ['unread', 'read', 'responded'];

const PriorityBadge: React.FC<{ priority: NotificationPriority }> = ({ priority }) => {
    const config = {
        high: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
        normal: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        low: 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300',
    };
    return <span className={`px-2 py-1 text-xs font-semibold capitalize rounded-md ${config[priority]}`}>{priority}</span>;
};

const StatusBadge: React.FC<{ status: NotificationStatus }> = ({ status }) => {
    const config = {
        unread: 'bg-red-500 text-white',
        read: 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300',
        responded: 'bg-sky-500 text-white',
    };
    return <span className={`px-2 py-1 text-xs font-semibold capitalize rounded-md ${config[status]}`}>{status}</span>;
};

const FilterCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded text-brand-accent focus:ring-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500"
        />
        <span className="capitalize text-slate-700 dark:text-slate-300">{label}</span>
    </label>
);

interface NotificationsProps {
    logBillingEvent: (eventType: BillingEventType, usageCount: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ logBillingEvent }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<{
        priorities: Set<NotificationPriority>;
        statuses: Set<NotificationStatus>;
    }>({
        priorities: new Set(),
        statuses: new Set(),
    });

    const filterRef = useRef<HTMLDivElement>(null);
    
    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await apiService.getNotifications();
            setNotifications(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const summaryStats = useMemo(() => ({
        total: notifications.length,
        unread: notifications.filter(n => n.status === 'unread').length,
        requiresAction: notifications.filter(n => n.status !== 'responded').length,
        highPriority: notifications.filter(n => n.priority === 'high').length,
    }), [notifications]);

    const handleFilterChange = (type: 'priorities' | 'statuses', value: NotificationPriority | NotificationStatus) => {
        setFilters(prev => {
            const newSet = new Set(prev[type]);
            if (newSet.has(value as any)) newSet.delete(value as any);
            else newSet.add(value as any);
            return { ...prev, [type]: newSet };
        });
    };

    const clearFilters = () => {
        setFilters({ priorities: new Set(), statuses: new Set() });
        setIsFilterOpen(false);
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const priorityMatch = filters.priorities.size === 0 || filters.priorities.has(n.priority);
            const statusMatch = filters.statuses.size === 0 || filters.statuses.has(n.status);
            return priorityMatch && statusMatch;
        });
    }, [notifications, filters]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? new Set(filteredNotifications.map(n => n.id)) : new Set());
    };
    
    const handleSelectOne = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const openConversation = async (notification: Notification) => {
        if (notification.type === 'New Text Received') {
            setSelectedNotification(notification);
            if (notification.status === 'unread') {
                try {
                    const updatedNotification = await apiService.markNotificationRead(notification.id);
                    setNotifications(prev => prev.map(n => n.id === notification.id ? updatedNotification : n));
                } catch (err) {
                    console.error("Failed to mark notification as read");
                }
            }
        }
    };

    if (loading) {
        return <div className="p-6">Loading notifications...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <section className="bg-white dark:bg-brand-secondary/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <div className="flex items-center gap-2">
                    <div ref={filterRef} className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-white dark:bg-slate-700/80 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-300 dark:border-slate-600"
                        >
                            <Icon name="filter" className="h-5 w-5" />
                            <span>Filter</span>
                        </button>
                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-brand-secondary rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 p-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Filter by Priority</h4>
                                    {priorityOptions.map(p => (
                                        <FilterCheckbox key={p} label={p} checked={filters.priorities.has(p)} onChange={() => handleFilterChange('priorities', p)} />
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Filter by Status</h4>
                                     {statusOptions.map(s => (
                                        <FilterCheckbox key={s} label={s} checked={filters.statuses.has(s)} onChange={() => handleFilterChange('statuses', s)} />
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button onClick={clearFilters} className="w-full text-sm text-center text-brand-accent font-semibold hover:underline">
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input type="text" placeholder="Search by Title, Message, Debtor Name, ID..." className="w-80 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                    </div>
                    <button onClick={loadNotifications} className="flex items-center gap-2 bg-brand-success text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        <Icon name="refresh" className="h-5 w-5" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Summary Bar */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-brand-secondary rounded-lg border border-slate-200 dark:border-slate-700/50 flex items-center gap-8">
                <div className="flex items-center gap-2"><span className="text-slate-500 dark:text-slate-400">Total:</span><span className="font-bold text-slate-900 dark:text-white">{summaryStats.total}</span></div>
                <div className="flex items-center gap-2"><span className="text-slate-500 dark:text-slate-400">Unread:</span><span className="px-2 py-0.5 text-sm font-semibold bg-red-500 text-white rounded-full">{summaryStats.unread}</span></div>
                <div className="flex items-center gap-2"><span className="text-slate-500 dark:text-slate-400">Requires Action:</span> <span className="px-2 py-0.5 text-sm font-semibold bg-yellow-500 text-white rounded-full">{summaryStats.requiresAction}</span></div>
                 <div className="flex items-center gap-2"><span className="text-slate-500 dark:text-slate-400">High Priority:</span><span className="px-2 py-0.5 text-sm font-semibold bg-red-500 text-white rounded-full">{summaryStats.highPriority}</span></div>
            </div>

            {/* Notifications Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="p-4 w-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0} className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent" /></th>
                            <th scope="col" className="px-4 py-3 w-12">TYPE</th>
                            <th scope="col" className="px-4 py-3">TITLE & MESSAGE</th>
                            <th scope="col" className="px-4 py-3">DEBTOR</th>
                            <th scope="col" className="px-4 py-3">PRIORITY</th>
                            <th scope="col" className="px-4 py-3">STATUS</th>
                            <th scope="col" className="px-4 py-3">CREATED</th>
                            <th scope="col" className="px-4 py-3">ACTION</th>
                            <th scope="col" className="px-4 py-3">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredNotifications.map(n => (
                            <tr key={n.id} className={`border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-brand-secondary ${selectedIds.has(n.id) ? 'bg-slate-100 dark:bg-brand-secondary' : ''}`}>
                                <td className="p-4"><input type="checkbox" onChange={() => handleSelectOne(n.id)} checked={selectedIds.has(n.id)} className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent" /></td>
                                <td className="px-4 py-4"><Icon name={n.icon} className="h-6 w-6 text-slate-400" /></td>
                                <td className="px-4 py-4"><p className="font-bold text-slate-900 dark:text-white">{n.title}</p><p className="text-slate-500 dark:text-slate-400 text-xs">{n.message}</p></td>
                                <td className="px-4 py-4 font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">{n.debtorName}</td>
                                <td className="px-4 py-4"><PriorityBadge priority={n.priority} /></td>
                                <td className="px-4 py-4"><StatusBadge status={n.status} /></td>
                                <td className="px-4 py-4">{new Date(n.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-4"><button onClick={() => openConversation(n)} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-1.5 px-3 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Action</button></td>
                                <td className="px-4 py-4"><button className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"><Icon name="more-horizontal" className="h-5 w-5" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredNotifications.length === 0 && (
                    <div className="text-center py-16"><Icon name="search" className="h-12 w-12 mx-auto text-slate-400" /><h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">No Notifications Found</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters or check back later.</p></div>
                )}
            </div>

            {selectedNotification && (
                <ConversationModal
                    notification={selectedNotification}
                    onClose={() => setSelectedNotification(null)}
                    logBillingEvent={logBillingEvent}
                />
            )}
        </section>
    );
};

export default Notifications;
