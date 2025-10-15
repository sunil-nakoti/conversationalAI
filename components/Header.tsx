import React, { useState, useEffect, useRef } from 'react';
import { User, View } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onViewChange: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onViewChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    return (
        <header className="bg-white dark:bg-brand-secondary h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-10">
            <div>
                 {/* This space can be used for breadcrumbs or page titles in the future */}
            </div>
            
            {user && (
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <Icon name="user" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight capitalize">{user.role}</p>
                        </div>
                        <Icon name="chevron-down" className={`h-4 w-4 text-slate-400 transition-transform hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-brand-secondary rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 animate-fade-in-down">
                            <button 
                                onClick={() => {
                                    onViewChange('profile');
                                    setIsDropdownOpen(false);
                                }} 
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                            >
                                <Icon name="user" className="h-4 w-4" />
                                My Profile
                            </button>
                            <button 
                                onClick={onLogout} 
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                                <Icon name="x" className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
