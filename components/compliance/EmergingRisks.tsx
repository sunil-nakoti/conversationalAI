import React, { useState } from 'react';
import { EmergingRiskTrend } from '../../types';
import { Icon } from '../Icon';
import CreateEmergingRiskModal from './CreateEmergingRiskModal';
import { apiService } from '../../services/apiService';

interface EmergingRisksProps {
    trends: EmergingRiskTrend[];
    setTrends: React.Dispatch<React.SetStateAction<EmergingRiskTrend[]>>;
}

const TrendCard: React.FC<{ trend: EmergingRiskTrend }> = ({ trend }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-900 dark:text-white">{trend.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Detected: {new Date(trend.detectedDate).toLocaleDateString()}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{trend.summary}</p>
        <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Keywords:</span>
            {trend.keywords.map(kw => (
                <span key={kw} className="bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-full">{kw}</span>
            ))}
        </div>
    </div>
);

const EmergingRisks: React.FC<EmergingRisksProps> = ({ trends, setTrends }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveRisk = async (newRiskData: Omit<EmergingRiskTrend, 'id' | 'detectedDate' | 'user'>) => {
        try {
            const savedRisk = await apiService.createEmergingRisk(newRiskData);
            setTrends(prevTrends => [savedRisk, ...prevTrends]);
        } catch (error) {
            console.error("Failed to save emerging risk", error);
        }
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                    <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                        <Icon name="trending-up" className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI-Driven Emerging Risk Trends</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Proactive analysis of call transcripts to identify potential compliance risks and new debtor language patterns.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-shrink-0 bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-accent-dark flex items-center gap-2"
                >
                    <Icon name="plus" className="h-4 w-4" />
                    Add Risk
                </button>
            </div>
            <div className="space-y-4">
                {trends.map(trend => <TrendCard key={trend.id} trend={trend} />)}
            </div>
            <CreateEmergingRiskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveRisk} 
            />
        </div>
    );
};

export default EmergingRisks;
