import React, { useState, useEffect, useRef } from 'react';
import { LoginEvent } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

interface LiveLoginNotificationsProps {
    loginEvents: LoginEvent[];
}

const LiveLoginNotifications: React.FC<LiveLoginNotificationsProps> = ({ loginEvents }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnseen, setHasUnseen] = useState(false);
    const prevEventCount = useRef(loginEvents.length);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loginEvents.length > prevEventCount.current) {
            setHasUnseen(true);
        }
        prevEventCount.current = loginEvents.length;
    }, [loginEvents]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleToggle = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setHasUnseen(false);
        }
    };

    const timeAgo = (timestamp: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
        if (seconds < 5) return 'just now';
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    const recentLogins = loginEvents.slice(0, 5);

    return (
        <div className="relative" ref={dropdownRef}>
            <Tooltip content="Recent Payment Portal Logins">
                <button
                    onClick={handleToggle}
                    className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <Icon name="globe" className="h-6 w-6" />
                    {hasUnseen && (
                        <span className="absolute top-1 right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                    )}
                </button>
            </Tooltip>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-brand-secondary rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-900 dark:text-white">Recent Portal Logins</h4>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {recentLogins.length > 0 ? (
                            recentLogins.map(event => (
                                <div key={event.id} className="p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <Icon name="user-check" className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{event.debtorName} logged in.</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{event.ipAddress}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(event.timestamp)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                No recent login events.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveLoginNotifications;
