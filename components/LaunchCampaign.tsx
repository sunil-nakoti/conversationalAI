import React, { useState, useRef, useEffect } from 'react';
import { Portfolio, SavedPlaybook, AvailablePhoneNumber, SelectableAIAgent, ReputationCheckResult, BrandingProfile, CampaignSimulationResult } from '../types';
import { Icon } from './Icon';
import Tooltip from './Tooltip';
import { checkPhoneNumberReputation } from '../services/geminiService';
import CampaignSimulationModal from './CampaignSimulationModal';

interface LaunchCampaignProps {
    portfolios: Portfolio[];
    playbooks: SavedPlaybook[];
    phoneNumbers: AvailablePhoneNumber[];
    aiAgents: SelectableAIAgent[];
    brandingProfiles: BrandingProfile[];
    onLaunch: (portfolioId: string, brandingProfileId: string) => void;
}

const ReputationStatusBadge: React.FC<{ phone: AvailablePhoneNumber }> = ({ phone }) => {
    switch (phone.reputationStatus) {
        case 'checking':
            return (
                <Tooltip content="Checking reputation...">
                    <Icon name="spinner" className="h-4 w-4 text-slate-400 animate-spin" />
                </Tooltip>
            );
        case 'error':
            return (
                 <Tooltip content="Reputation check failed.">
                    <Icon name="warning" className="h-4 w-4 text-red-400" />
                </Tooltip>
            );
        case 'checked':
            if (!phone.reputationResult) return null;
            const { risk_level } = phone.reputationResult;
            const config = {
                High: { color: 'text-red-500 dark:text-red-400', icon: 'warning' as const, label: 'High Risk' },
                Medium: { color: 'text-yellow-500 dark:text-yellow-400', icon: 'alert-triangle' as const, label: 'Medium Risk' },
                Safe: { color: 'text-green-500 dark:text-green-400', icon: 'check' as const, label: 'Safe' },
            }[risk_level];

            return (
                <Tooltip content={phone.reputationResult.summary_insight}>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${config.color}`}>
                        <Icon name={config.icon} className="h-4 w-4" />
                        <span>{config.label}</span>
                    </div>
                </Tooltip>
            );
        default:
            return null;
    }
};


const LaunchCampaign: React.FC<LaunchCampaignProps> = ({ portfolios, playbooks, phoneNumbers, aiAgents, brandingProfiles, onLaunch }) => {
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
    const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(playbooks[0]?.id || '');
    const [selectedAgentId, setSelectedAgentId] = useState<string>(aiAgents[0]?.id || '');
    const [selectedBrandingProfileId, setSelectedBrandingProfileId] = useState<string>(brandingProfiles[0]?.id || '');
    const [selectedPhoneNumberIds, setSelectedPhoneNumberIds] = useState<Set<string>>(new Set());
    const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
    const [localPhoneNumbers, setLocalPhoneNumbers] = useState<AvailablePhoneNumber[]>([]);
    const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
    
    const phoneDropdownRef = useRef<HTMLDivElement>(null);
    const idlePortfolios = portfolios.filter(p => p.status === 'Idle' && p.numberOfAccounts > 0);

    useEffect(() => {
        setLocalPhoneNumbers(phoneNumbers.map(p => ({
            ...p,
            reputationStatus: p.reputationStatus || 'idle',
            reputationResult: p.reputationResult || null
        })));
    }, [phoneNumbers]);

    useEffect(() => {
        if (!isPhoneDropdownOpen) return;
        
        const runChecks = async () => {
            let numbersToCheck: AvailablePhoneNumber[] = [];

            setLocalPhoneNumbers(currentNumbers => {
                numbersToCheck = currentNumbers.filter(p => p.reputationStatus === 'idle');
                if (numbersToCheck.length > 0) {
                    const idsToCheck = new Set(numbersToCheck.map(n => n.id));
                    return currentNumbers.map(p =>
                        idsToCheck.has(p.id) ? { ...p, reputationStatus: 'checking' } : p
                    );
                }
                return currentNumbers;
            });

            if (numbersToCheck.length === 0) return;

            const results = await Promise.all(
                numbersToCheck.map(async (phone) => {
                    try {
                        const result = await checkPhoneNumberReputation(phone.number);
                        return { id: phone.id, status: 'checked' as const, result };
                    } catch (error) {
                        console.error(`Reputation check failed for ${phone.number}:`, error);
                        return { id: phone.id, status: 'error' as const, result: null };
                    }
                })
            );

            setLocalPhoneNumbers(currentNumbers => {
                const resultsById = new Map(results.map(r => [r.id, r]));
                return currentNumbers.map(p => {
                    if (resultsById.has(p.id)) {
                        const res = resultsById.get(p.id)!;
                        return { ...p, reputationStatus: res.status, reputationResult: res.result };
                    }
                    return p;
                });
            });
        };

        runChecks();
    }, [isPhoneDropdownOpen]);

     useEffect(() => {
        const highRiskIds = localPhoneNumbers
            .filter(p => p.reputationStatus === 'checked' && p.reputationResult?.risk_level === 'High')
            .map(p => p.id);

        if (highRiskIds.length > 0) {
            setSelectedPhoneNumberIds(prev => {
                const newSet = new Set(prev);
                let changed = false;
                highRiskIds.forEach(id => {
                    if (newSet.has(id)) {
                        newSet.delete(id);
                        changed = true;
                    }
                });
                return changed ? newSet : prev;
            });
        }
    }, [localPhoneNumbers]);

    const handleLaunch = () => {
        if (selectedPortfolioId) {
            onLaunch(selectedPortfolioId, selectedBrandingProfileId);
            setSelectedPortfolioId(''); 
            setSelectedPhoneNumberIds(new Set());
        }
    };
    
    const handleRunSimulation = () => {
        if (selectedPortfolioId) {
            setIsSimulationModalOpen(true);
        }
    };

    const togglePhoneNumber = (id: string) => {
        setSelectedPhoneNumberIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target as Node)) {
                setIsPhoneDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const inputClasses = "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50 text-slate-900 dark:text-white";

    return (
        <section className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Launch New Campaign</h2>
                <Tooltip content="Configure and launch a new AI campaign by selecting a portfolio, playbook, phone number(s), and agent.">
                    <Icon name="rocket" className="h-5 w-5 text-sky-500 dark:text-brand-accent" />
                </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                    <label htmlFor="portfolio-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">1. Select Portfolio</label>
                    <select
                        id="portfolio-select"
                        value={selectedPortfolioId}
                        onChange={(e) => setSelectedPortfolioId(e.target.value)}
                        className={inputClasses}
                        disabled={idlePortfolios.length === 0}
                    >
                        <option value="" disabled>{idlePortfolios.length > 0 ? 'Choose a portfolio...' : 'No idle portfolios'}</option>
                        {idlePortfolios.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.numberOfAccounts} accounts)</option>
                        ))}
                    </select>
                </div>
                
                <div className="relative" ref={phoneDropdownRef}>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">2. Assign Phone Number(s)</label>
                    <button
                        type="button"
                        onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                        className={`${inputClasses} flex items-center justify-between text-left`}
                    >
                        <span>
                            {selectedPhoneNumberIds.size > 0 ? `${selectedPhoneNumberIds.size} number(s) selected` : 'Select numbers...'}
                        </span>
                        <Icon name="chevron-down" className={`h-5 w-5 text-slate-400 transition-transform ${isPhoneDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isPhoneDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {localPhoneNumbers.map(phone => {
                                const isHighRisk = phone.reputationStatus === 'checked' && phone.reputationResult?.risk_level === 'High';
                                return (
                                    <label key={phone.id} className={`flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 ${isHighRisk ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input 
                                            type="checkbox"
                                            checked={selectedPhoneNumberIds.has(phone.id)}
                                            onChange={() => togglePhoneNumber(phone.id)}
                                            disabled={isHighRisk}
                                            className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm text-slate-800 dark:text-white">{phone.number}</span>
                                        <div className="ml-auto">
                                            <ReputationStatusBadge phone={phone} />
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <div>
                    <label htmlFor="playbook-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">3. Assign AI Playbook</label>
                    <select
                        id="playbook-select"
                        value={selectedPlaybookId}
                        onChange={(e) => setSelectedPlaybookId(e.target.value)}
                        className={inputClasses}
                    >
                        {playbooks.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="branding-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">4. Select Branding</label>
                    <select
                        id="branding-select"
                        value={selectedBrandingProfileId}
                        onChange={(e) => setSelectedBrandingProfileId(e.target.value)}
                        className={inputClasses}
                        disabled={brandingProfiles.length === 0}
                    >
                        {brandingProfiles.length === 0 ? (
                             <option>No profiles</option>
                        ) : (
                            brandingProfiles.map(p => (
                                <option key={p.id} value={p.id}>{p.companyName}</option>
                            ))
                        )}
                    </select>
                </div>

                <div>
                     <label htmlFor="agent-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">5. Select AI Agent</label>
                    <select
                        id="agent-select"
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        className={inputClasses}
                    >
                        {aiAgents.map(a => (
                            <option key={a.id} value={a.id}>{a.name} ({a.description})</option>
                        ))}
                    </select>
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end gap-2">
                <button
                    onClick={handleRunSimulation}
                    disabled={!selectedPortfolioId || selectedPhoneNumberIds.size === 0}
                    className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                    <Icon name="flask-conical" className="h-5 w-5" />
                    Run Simulation
                </button>
                <button
                    onClick={handleLaunch}
                    disabled={!selectedPortfolioId || selectedPhoneNumberIds.size === 0}
                    className="flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    <Icon name="rocket" className="h-5 w-5" />
                    Launch Campaign
                </button>
            </div>
            <CampaignSimulationModal
                isOpen={isSimulationModalOpen}
                onClose={() => setIsSimulationModalOpen(false)}
            />
        </section>
    );
};

export default LaunchCampaign;