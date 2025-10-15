
import React from 'react';
// FIX: Corrected import path for types
import { Debtor, IconName } from '../types';
// FIX: Corrected import path for Icon component
import { Icon } from './Icon';

interface DiscordNotificationProps {
    debtor: Debtor;
    message: string;
    icon: IconName;
    onClose: () => void;
}

const DiscordNotification: React.FC<DiscordNotificationProps> = ({ debtor, message, icon, onClose }) => {
    const isSuccess = icon === 'check';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';

    return (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm">
            <div className={`bg-white dark:bg-brand-secondary rounded-lg shadow-2xl flex border-l-4 ${borderColor}`}>
                <div className="p-4 flex-1">
                    <div className="flex items-center mb-2">
                        <div className="flex-shrink-0">
                           <Icon name={icon} className={`h-6 w-6 ${iconColor}`}/>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{message}</h3>
                        </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                       <div>
                           <p className="font-semibold">Full Name</p>
                           <p>{debtor.fullname}</p>
                       </div>
                       <div>
                           <p className="font-semibold">Account Number</p>
                           <p>{debtor.accountnumber}</p>
                       </div>
                        <div>
                           <p className="font-semibold">Original Creditor</p>
                           <p>{debtor.originalcreditor}</p>
                       </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white">
                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default DiscordNotification;