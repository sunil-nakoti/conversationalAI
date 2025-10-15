import React, { useState } from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { JurisdictionRule, ProposedRuleUpdate } from '../../types';
import { researchComplianceUpdates } from '../../services/geminiService';

interface ComplianceUpdatesProps {
    jurisdictionRules: JurisdictionRule[];
    setJurisdictionRules: React.Dispatch<React.SetStateAction<JurisdictionRule[]>>;
    proposedRuleUpdates: ProposedRuleUpdate[];
    setProposedRuleUpdates: React.Dispatch<React.SetStateAction<ProposedRuleUpdate[]>>;
    isAutoComplianceEnabled: boolean;
    setIsAutoComplianceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; description: React.ReactNode; }> = ({ label, enabled, setEnabled, description }) => (
    <div className="flex items-start justify-between">
        <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>
        </div>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${enabled ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ProposalCard: React.FC<{
    proposal: ProposedRuleUpdate;
    onApprove: (proposalId: string) => void;
    onDismiss: (proposalId: string) => void;
}> = ({ proposal, onApprove, onDismiss }) => {

    const confidenceColor = proposal.confidence >= 0.9 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' 
        : proposal.confidence >= 0.7 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300' 
        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
    
    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Update for {proposal.jurisdictionCode}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${confidenceColor}`}>
                    Confidence: {(proposal.confidence * 100).toFixed(0)}%
                </span>
            </div>
            
            <div className="my-3 space-y-2">
                {Object.entries(proposal.proposedChanges).map(([key, value]) => {
                    const currentVal = proposal.currentRule[key as keyof typeof proposal.currentRule];
                    const labels: Record<string, string> = {
                        callFrequencyLimit: 'Call Frequency Limit',
                        callFrequencyDays: 'Call Frequency Period',
                        timeOfDayStart: 'Calling Hours Start',
                        timeOfDayEnd: 'Calling Hours End',
                    };
                    return (
                        <div key={key} className="flex items-center text-sm">
                            <span className="w-48 text-slate-500 dark:text-slate-400">{labels[key] || key}:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400 line-through mr-2">{currentVal}</span>
                            <Icon name="arrow-right" className="h-4 w-4 text-slate-400 mr-2" />
                            <span className="font-semibold text-green-600 dark:text-green-400">{value}</span>
                        </div>
                    );
                })}
            </div>
            
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">AI Analyst Reasoning:</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{proposal.reasoning}"</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Source:</span> {proposal.sourceTitle}
                </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => onDismiss(proposal.id)} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700">Dismiss</button>
                <a 
                    href={proposal.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 font-semibold py-2 px-4 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-500/30 transition-colors"
                >
                    <Icon name="link" className="h-4 w-4" />
                    Review Source
                </a>
                <button onClick={() => onApprove(proposal.id)} className="bg-brand-success text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">Approve & Apply</button>
            </div>
        </div>
    );
};

const ComplianceUpdates: React.FC<ComplianceUpdatesProps> = (props) => {
    const { jurisdictionRules, setJurisdictionRules, proposedRuleUpdates, setProposedRuleUpdates, isAutoComplianceEnabled, setIsAutoComplianceEnabled } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const applyUpdate = (proposalId: string, proposalsList: ProposedRuleUpdate[]) => {
        const proposal = proposalsList.find(p => p.id === proposalId);
        if (!proposal) return;

        setJurisdictionRules(prevRules =>
            prevRules.map(rule =>
                rule.state === proposal.jurisdictionCode
                    ? { ...rule, ...proposal.proposedChanges }
                    : rule
            )
        );
    };

    const handleRunCheck = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await Promise.all(
                jurisdictionRules.map(rule => researchComplianceUpdates(rule))
            );

            const newProposals = results.filter((p): p is ProposedRuleUpdate => p !== null);

            if (newProposals.length === 0) {
                 alert("No new compliance updates found at this time.");
                 setIsLoading(false);
                 return;
            }

            if (isAutoComplianceEnabled) {
                const autoApproved: string[] = [];
                const manualReview: ProposedRuleUpdate[] = [];

                newProposals.forEach(proposal => {
                    if (proposal.confidence >= 0.95) {
                        applyUpdate(proposal.id, newProposals);
                        autoApproved.push(proposal.jurisdictionCode);
                    } else {
                        manualReview.push(proposal);
                    }
                });

                setProposedRuleUpdates(prev => [...prev, ...manualReview]);
                if(autoApproved.length > 0) {
                    alert(`Auto-applied high-confidence updates for: ${autoApproved.join(', ')}.`);
                }
                 if(manualReview.length > 0) {
                    alert(`${manualReview.length} new update(s) require manual review.`);
                }

            } else {
                 setProposedRuleUpdates(prev => [...prev, ...newProposals.filter(np => !prev.some(p => p.id === np.id))]);
                 alert(`Found ${newProposals.length} potential compliance update(s) for your review.`);
            }

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during the compliance check.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = (proposalId: string) => {
        applyUpdate(proposalId, proposedRuleUpdates);
        setProposedRuleUpdates(prev =>
            prev.map(p => p.id === proposalId ? { ...p, status: 'applied' } : p)
        );
    };

    const handleDismiss = (proposalId: string) => {
        setProposedRuleUpdates(prev =>
            prev.map(p => p.id === proposalId ? { ...p, status: 'dismissed' } : p)
        );
    };
    
    const pendingUpdates = proposedRuleUpdates.filter(p => p.status === 'pending');
    
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Autonomous Compliance Engine</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Schedule AI to research regulatory changes and automatically update your compliance rules.</p>
                    </div>
                     <button onClick={handleRunCheck} disabled={isLoading} className="flex items-center gap-2 bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:opacity-50">
                        <Icon name={isLoading ? 'spinner' : 'refresh'} className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Checking...' : 'Run Compliance Check'}
                    </button>
                </div>
                 {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <ToggleSwitch
                        label="Enable Fully Autonomous Compliance Updates"
                        enabled={isAutoComplianceEnabled}
                        setEnabled={setIsAutoComplianceEnabled}
                        description={
                            <span className="text-brand-warning font-semibold flex items-center gap-1">
                                <Icon name="warning" className="h-4 w-4" />
                                WARNING: High-confidence changes will be applied automatically without manual review.
                            </span>
                        }
                    />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Pending Updates ({pendingUpdates.length})</h3>
                {pendingUpdates.length > 0 ? (
                    <div className="space-y-4">
                        {pendingUpdates.map(p => <ProposalCard key={p.id} proposal={p} onApprove={handleApprove} onDismiss={handleDismiss} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-brand-secondary rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                        <Icon name="check" className="h-12 w-12 mx-auto text-green-500" />
                        <p className="mt-2 font-semibold text-slate-900 dark:text-white">All rules are up to date.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Click "Run Compliance Check" to search for new updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplianceUpdates;