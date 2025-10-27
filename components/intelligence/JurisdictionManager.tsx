// FIX: Removed invalid file header that was causing a syntax error.
import React, { useState } from 'react';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
// FIX: Corrected import path for types.ts
import { JurisdictionRule } from '../../types';
import JurisdictionRuleModal from './JurisdictionRuleModal';
import { apiService } from '../../services/apiService';

interface JurisdictionManagerProps {
    rules: JurisdictionRule[];
    setRules: React.Dispatch<React.SetStateAction<JurisdictionRule[]>>;
}

const JurisdictionManager: React.FC<JurisdictionManagerProps> = ({ rules, setRules }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<JurisdictionRule | null>(null);

    const handleSaveRule = async (ruleToSave: JurisdictionRule) => {
        let updatedRules;
        if (ruleToSave.id) {
            updatedRules = rules.map(r => (r.id === ruleToSave.id ? ruleToSave : r));
        } else {
            updatedRules = [...rules, { ...ruleToSave, id: `rule${Date.now()}` }];
        }

        try {
            // Call the API to save the rules
            await apiService.saveJurisdictionRules(updatedRules);
            setRules(updatedRules); // Update the local state on success
            setIsModalOpen(false);
            setSelectedRule(null);
        } catch (error) {
            console.error("Failed to save jurisdiction rules:", error);
            // Optionally, show an error message to the user
        }
    };

    const handleAddNew = () => {
        setSelectedRule(null);
        setIsModalOpen(true);
    };

    const handleEdit = (rule: JurisdictionRule) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-start gap-4">
                    <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                        <Icon name="gavel" className="h-6 w-6" />
                    </div>
                    <div>
                         <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Jurisdiction Rule Engine</h3>
                            <Tooltip content="Manage state-specific compliance rules like call frequency and calling hours. These rules are automatically enforced by the AI dialer.">
                                <Icon name="info" className="h-5 w-5 text-slate-400" />
                            </Tooltip>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Define and manage state-level compliance rules.</p>
                    </div>
                </div>
                 <button onClick={handleAddNew} className="flex items-center gap-2 bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                     <Icon name="plus-square" className="h-5 w-5" />
                     Add New Rule
                 </button>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                     <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">State</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Call Frequency</th>
                            <th scope="col" className="px-6 py-3">Calling Hours</th>
                            <th scope="col" className="px-6 py-3 text-center">Pre-Dial Scrub</th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map(rule => (
                            <tr key={rule.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{rule.state}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${rule.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'}`}>
                                        {rule.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{rule.callFrequencyLimit} calls / {rule.callFrequencyDays} days</td>
                                <td className="px-6 py-4">{rule.timeOfDayStart} - {rule.timeOfDayEnd}</td>
                                <td className="px-6 py-4 text-center">
                                     <Icon name={rule.enforce_pre_dial_scrub ? 'check' : 'x'} className={`h-5 w-5 mx-auto ${rule.enforce_pre_dial_scrub ? 'text-green-500' : 'text-red-500'}`} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(rule)} className="font-medium text-sky-600 dark:text-brand-accent hover:underline">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <JurisdictionRuleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRule}
                rule={selectedRule}
            />
        </div>
    );
};

export default JurisdictionManager;