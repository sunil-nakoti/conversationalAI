import React, { useState } from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { checkPhoneNumberReputation } from '../../services/geminiService';
import { ReputationCheckResult } from '../../types';

const ReputationResult: React.FC<{ result: ReputationCheckResult }> = ({ result }) => {
    const { risk_level, summary_insight } = result;
    const config = {
        High: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/20', icon: 'warning' as const, borderColor: 'border-red-400' },
        Medium: { color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/20', icon: 'alert-triangle' as const, borderColor: 'border-yellow-400' },
        Safe: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/20', icon: 'check' as const, borderColor: 'border-green-400' },
    }[risk_level];

    return (
        <div className={`mt-4 p-4 rounded-lg border-l-4 ${config.bg} ${config.borderColor}`}>
            <div className="flex items-center gap-3">
                <Icon name={config.icon} className={`h-8 w-8 ${config.color}`} />
                <div>
                    <h4 className={`text-lg font-semibold ${config.color}`}>Risk Level: {risk_level}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{summary_insight}</p>
                </div>
            </div>
        </div>
    );
};


const ReputationCheck: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ReputationCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!phoneNumber) return;
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const reputation = await checkPhoneNumberReputation(phoneNumber);
            setResult(reputation);
        } catch (err: any) {
            setError(err.message || "Failed to check reputation.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="search" className="h-6 w-6" />
                </div>
                <div>
                     <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Manual Phone Number Reputation Check</h3>
                        <Tooltip content="Check the web reputation of a single phone number for spam/scam indicators before using it in a campaign.">
                            <Icon name="info" className="h-5 w-5 text-slate-400" />
                        </Tooltip>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Our AI will analyze web search results to assess the risk associated with a number.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number (e.g., 555-123-4567)"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white"
                />
                <button
                    onClick={handleCheck}
                    disabled={isLoading || !phoneNumber}
                    className="flex items-center gap-2 bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Icon name="spinner" className="h-5 w-5 animate-spin" />
                            <span>Checking...</span>
                        </>
                    ) : (
                        <>
                            <Icon name="search" className="h-5 w-5" />
                            <span>Check</span>
                        </>
                    )}
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
            {result && <ReputationResult result={result} />}
        </div>
    );
};

export default ReputationCheck;