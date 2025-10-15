import React, { useState } from 'react';
import { Icon } from './Icon';
import { IconName } from '../types';

interface PaymentLoginProps {
    onLoginSuccess: () => void;
}

const InfoItem: React.FC<{ icon: IconName; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-3">
        <div className="bg-green-100 dark:bg-green-500/10 p-2 rounded-full">
            <Icon name={icon} className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-slate-700 dark:text-slate-300">{text}</span>
    </div>
);

const SecurityBadge: React.FC<{ icon: IconName; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Icon name={icon} className="h-5 w-5" />
        <span>{text}</span>
    </div>
);

const PaymentLogin: React.FC<PaymentLoginProps> = ({ onLoginSuccess }) => {
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [inputValue, setInputValue] = useState('(555) 555-5555');

    return (
        <div className="flex-1 bg-slate-50 dark:bg-brand-primary p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Welcome to Our Secure Self-Service Portal</h1>
                <p className="mt-4 text-xl font-semibold text-blue-600 dark:text-sky-400">Get the Same Low Payoff Everyone Gets Online</p>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Our automated system reduces costs – those savings are passed directly to you</p>

                <div className="mt-8 mx-auto max-w-md bg-white dark:bg-brand-secondary rounded-xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Please verify your information:</h2>
                    
                    <div className="mt-6 flex justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button 
                            onClick={() => setLoginMethod('phone')}
                            className={`w-1/2 py-2 rounded-md font-semibold text-sm transition-colors ${loginMethod === 'phone' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                            <Icon name="phone" className="h-4 w-4 inline mr-2" />
                            Phone
                        </button>
                        <button 
                            onClick={() => setLoginMethod('email')}
                            className={`w-1/2 py-2 rounded-md font-semibold text-sm transition-colors ${loginMethod === 'email' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                            <Icon name="email" className="h-4 w-4 inline mr-2" />
                            Email
                        </button>
                    </div>

                    <div className="relative mt-4">
                        <Icon 
                            name={loginMethod === 'phone' ? 'phone' : 'email'} 
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500"
                        />
                        <input 
                            type={loginMethod === 'phone' ? 'tel' : 'email'}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={loginMethod === 'phone' ? '(555) 555-5555' : 'your-email@example.com'}
                            className="w-full text-lg p-4 pl-12 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none"
                        />
                    </div>

                    <button 
                        onClick={onLoginSuccess}
                        className="w-full mt-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="shield-check" className="h-6 w-6" />
                        Access My Case
                    </button>

                    <button
                        onClick={onLoginSuccess}
                        className="w-full mt-2 bg-slate-600 text-white font-semibold py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                    >
                        Demo Login
                    </button>

                    <div className="mt-8 space-y-4 text-left">
                        <InfoItem icon="check" text="Save up to 70% Today" />
                        <InfoItem icon="clipboard-list" text="Instant Documentation" />
                        <InfoItem icon="wait" text="24/7 Support Available" />
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-around items-center">
                        <SecurityBadge icon="shield-check" text="Bank-Level Security" />
                        <SecurityBadge icon="gavel" text="FDCPA Compliant" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentLogin;