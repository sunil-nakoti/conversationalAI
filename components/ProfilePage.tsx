import React from 'react';
import { User } from '../types';
import { Icon } from './Icon';

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
    return (
        <section className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                <div className="flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <Icon name="user" className="w-12 h-12 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                    <span className="mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 capitalize">
                        {user.role}
                    </span>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Details</h3>
                    <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">User ID</span>
                            <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{user.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Name</span>
                            <span className="text-sm text-slate-800 dark:text-white">{user.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</span>
                            <span className="text-sm text-slate-800 dark:text-white">{user.email}</span>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                     <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Actions</h3>
                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-semibold py-2 px-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                     >
                         <Icon name="x" className="h-5 w-5"/>
                        Log Out
                    </button>
                 </div>
            </div>
        </section>
    );
};

export default ProfilePage;
