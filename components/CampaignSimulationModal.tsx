import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { CampaignSimulationResult } from '../types';

interface CampaignSimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const mockResult: CampaignSimulationResult = {
    predictedPtpRate: 18.2,
    predictedTotalCollections: 82450.75,
    mostCommonObjection: {
        name: "I can't afford to pay right now.",
        percentage: 32.1
    },
    predictedComplianceFlags: 3,
};


const SimulationResultDisplay: React.FC<{ result: CampaignSimulationResult }> = ({ result }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md">
                <p className="text-xs text-sky-600 dark:text-brand-accent">Predicted PTP Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.predictedPtpRate}%</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md">
                <p className="text-xs text-green-600 dark:text-green-400">Predicted Collections</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">${result.predictedTotalCollections.toLocaleString()}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Compliance Flags</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.predictedComplianceFlags}</p>
            </div>
             <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md">
                <p className="text-xs text-orange-600 dark:text-orange-400">Top Objection</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.mostCommonObjection.percentage}%</p>
            </div>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-md">
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">Most Common Objection:</p>
            <p className="text-sm text-orange-800 dark:text-orange-200">"{result.mostCommonObjection.name}"</p>
        </div>
    </div>
);


const CampaignSimulationModal: React.FC<CampaignSimulationModalProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'running' | 'complete' | 'error'>('running');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setStatus('running');
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 300);

        setTimeout(() => {
            clearInterval(interval);
            setProgress(100);
            setStatus('complete');
        }, 3500);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <Icon name="flask-conical" className="h-6 w-6 text-brand-accent"/>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Campaign Simulation</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"><Icon name="x" className="h-6 w-6" /></button>
                </div>
                
                <div className="p-6">
                    {status === 'running' && (
                        <div className="text-center">
                            <Icon name="spinner" className="h-12 w-12 mx-auto text-brand-accent animate-spin mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Running AI Digital Twin Simulation...</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Analyzing thousands of debtor personas against your campaign configuration.</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                                <div className="bg-brand-accent h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}
                    {status === 'complete' && <SimulationResultDisplay result={mockResult} />}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg">
                        Close
                    </button>
                    <button disabled={status !== 'complete'} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
                        Launch Campaign with these Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignSimulationModal;