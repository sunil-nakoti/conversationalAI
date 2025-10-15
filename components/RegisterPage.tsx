import React, { useState } from 'react';
import { Icon } from './Icon';

interface RegisterPageProps {
    onRegister: (userData: { name, email, password }) => Promise<void>;
    onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await onRegister({ name, email, password });
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-brand-primary p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Arc AI</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Create Your Account</p>
                </div>

                <div className="bg-white dark:bg-brand-secondary rounded-xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-6">Sign Up</h2>
                    
                    {error && (
                        <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" required />
                        </div>
                        <div>
                             <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" required />
                        </div>
                         <div>
                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Confirm Password</label>
                            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" required />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Icon name="spinner" className="h-5 w-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>
                    
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-semibold text-brand-accent hover:underline">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
