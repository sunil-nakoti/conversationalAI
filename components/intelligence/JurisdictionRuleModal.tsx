// FIX: Removed invalid file header that was causing a syntax error.
import React, { useState, useEffect } from 'react';
import { JurisdictionRule } from '../../types';

interface JurisdictionRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (rule: JurisdictionRule) => void;
    rule: JurisdictionRule | null;
}

const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const JurisdictionRuleModal: React.FC<JurisdictionRuleModalProps> = ({ isOpen, onClose, onSave, rule }) => {
    const [formData, setFormData] = useState<JurisdictionRule>({
        id: '', state: 'CA', callFrequencyLimit: 3, callFrequencyDays: 7, timeOfDayStart: '08:00', timeOfDayEnd: '20:00', enforce_pre_dial_scrub: false, isActive: true,
    });

    useEffect(() => {
        if (rule) {
            setFormData(rule);
        } else {
            setFormData({
                id: '', state: 'AL', callFrequencyLimit: 3, callFrequencyDays: 7, timeOfDayStart: '08:00', timeOfDayEnd: '21:00', enforce_pre_dial_scrub: false, isActive: true,
            });
        }
    }, [rule, isOpen]);
    
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{rule ? 'Edit Jurisdiction Rule' : 'Add New Jurisdiction Rule'}</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <ToggleSwitch label="Rule Active" enabled={formData.isActive} setEnabled={(val) => setFormData(p => ({...p, isActive: val}))} />
                    
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">State</label>
                        <select id="state" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white">
                            {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="callFrequencyLimit" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Max Calls</label>
                            <input type="number" id="callFrequencyLimit" name="callFrequencyLimit" value={formData.callFrequencyLimit} onChange={handleChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="callFrequencyDays" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Per # of Days</label>
                            <input type="number" id="callFrequencyDays" name="callFrequencyDays" value={formData.callFrequencyDays} onChange={handleChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="timeOfDayStart" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Calling Hours Start</label>
                            <input type="time" id="timeOfDayStart" name="timeOfDayStart" value={formData.timeOfDayStart} onChange={handleChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="timeOfDayEnd" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Calling Hours End</label>
                            <input type="time" id="timeOfDayEnd" name="timeOfDayEnd" value={formData.timeOfDayEnd} onChange={handleChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                         <ToggleSwitch label="Enforce Pre-Dial High-Risk Scrub" enabled={formData.enforce_pre_dial_scrub} setEnabled={(val) => setFormData(p => ({...p, enforce_pre_dial_scrub: val}))} />
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">When enabled, the system will check for reassigned numbers and known litigators before placing a call in this jurisdiction.</p>
                    </div>

                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Save Rule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JurisdictionRuleModal;
