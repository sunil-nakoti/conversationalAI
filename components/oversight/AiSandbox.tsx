

import React, { useState } from 'react';
// FIX: Corrected import path for types
import { SandboxResult } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';

const mockResult: SandboxResult = {
    predictedRpcRate: 31.2,
    predictedPtpRate: 14.7,
    predictedNegativeSentiment: 8.3,
    predictedComplianceFlags: 1,
    insight: "The 'Challenger B' agent shows a higher PTP rate due to its proactive offer of a 2-payment split, but generated one compliance flag for potentially rushing the Mini-Miranda."
};

const PredictiveReport: React.FC<{ result: SandboxResult }> = ({ result }) => (
    <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-600">
        <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-3">Predictive Report</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-200 dark:bg-slate-700/50 p-3 rounded-md">
                <p className="text-xs text-sky-600 dark:text-brand-accent">RPC Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.predictedRpcRate}%</p>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700/50 p-3 rounded-md">
                <p className="text-xs text-sky-600 dark:text-brand-accent">PTP Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.predictedPtpRate}%</p>
            </div>
             <div className="bg-slate-200 dark:bg-slate-700/50 p-3 rounded-md">
                <p className="text-xs text-orange-500 dark:text-orange-400">Negative Sentiment</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.predictedNegativeSentiment}%</p>
            </div>
             <div className="bg-slate-200 dark:bg-slate-700/50 p-3 rounded-md">
                <p className="text-xs text-red-500 dark:text-red-400">Compliance Flags</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.predictedComplianceFlags}</p>
            </div>
        </div>
         <div className="mt-4 p-3 bg-sky-100 dark:bg-sky-900/30 rounded-md">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">AI-Generated Insight:</p>
            <p className="text-sm text-sky-800 dark:text-sky-200">{result.insight}</p>
        </div>
    </div>
);

const AiSandbox: React.FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [agent, setAgent] = useState<string>('challenger_b');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SandboxResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    }

    const runSimulation = () => {
        if (!fileName) return;
        setIsLoading(true);
        setResult(null);
        setTimeout(() => {
            setResult(mockResult);
            setIsLoading(false);
        }, 2500);
    }

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="beaker" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Sandbox & Predictive Simulation</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Test new AI configurations on a campaign data set without contacting real debtors to get a predictive performance report.</p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">1. Upload Campaign File</label>
                    <label htmlFor="file-upload" className="flex items-center gap-2 w-full justify-center p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md cursor-pointer hover:border-brand-accent transition-colors text-slate-600 dark:text-slate-300">
                        <Icon name="upload" className="h-5 w-5" />
                        <span>{fileName || 'Click to select a CSV file'}</span>
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                </div>
                 <div>
                    <label htmlFor="agent-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">2. Select "Challenger" AI Agent</label>
                    <select id="agent-select" value={agent} onChange={e => setAgent(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white">
                        <option value="challenger_a">Challenger A (Direct, Assertive)</option>
                        <option value="challenger_b">Challenger B (Empathetic, Solution-Oriented)</option>
                        <option value="control_v1">Control v1.3 (Current Champion)</option>
                    </select>
                </div>
                 <div>
                    <button 
                        onClick={runSimulation}
                        disabled={!fileName || isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Icon name="spinner" className="h-5 w-5 animate-spin"/>
                                Running Simulation...
                            </>
                        ) : (
                             <>
                                <Icon name="beaker" className="h-5 w-5" />
                                Run Predictive Simulation
                            </>
                        )}
                    </button>
                </div>
            </div>
            {result && <PredictiveReport result={result} />}
        </div>
    );
};

export default AiSandbox;