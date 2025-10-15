import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { NegotiationModel } from '../../types';
import Tooltip from '../Tooltip';

interface NegotiationModelStudioProps {
    models: NegotiationModel[];
    setModels: React.Dispatch<React.SetStateAction<NegotiationModel[]>>;
}

const SliderControl: React.FC<{ label: string; tooltip: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void; }> = 
({ label, tooltip, value, min, max, step = 1, unit = '', onChange }) => (
    <div>
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
                <Tooltip content={tooltip}><Icon name="info" className="h-4 w-4 text-slate-400" /></Tooltip>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}{unit}</span>
        </div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent" />
    </div>
);

const ToggleSwitch: React.FC<{ label: string; tooltip: string; checked: boolean; onChange: (checked: boolean) => void; }> = 
({ label, tooltip, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md">
        <div className="flex items-center gap-2">
            <label htmlFor={label} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">{label}</label>
            <Tooltip content={tooltip}><Icon name="info" className="h-4 w-4 text-slate-400" /></Tooltip>
        </div>
        <button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${checked ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const NegotiationModelStudio: React.FC<NegotiationModelStudioProps> = ({ models, setModels }) => {
    const [selectedModelId, setSelectedModelId] = useState<string | null>(models[0]?.id || null);
    const [editableModel, setEditableModel] = useState<Partial<NegotiationModel> | null>(null);

    useEffect(() => {
        if (selectedModelId) {
            const model = models.find(m => m.id === selectedModelId);
            setEditableModel(model ? { ...model } : null);
        } else {
            setEditableModel(null);
        }
    }, [selectedModelId, models]);

    const handleSelectModel = (id: string) => setSelectedModelId(id);

    const handleCreateNew = () => {
        const newModel: NegotiationModel = {
            id: `model_${Date.now()}`,
            name: 'New Negotiation Model',
            description: '',
            settlementAuthority: { maxPercentage: 30, requiresApprovalSimulation: false },
            offerPacing: 'gradual',
            paymentPlanFlexibility: { allowCustomPlans: false, maxDurationMonths: 6, minInstallmentPercentage: 10 },
            hardshipProtocol: 'link_to_hardship_playbook',
            allowedTactics: [],
        };
        setModels(prev => [...prev, newModel]);
        setSelectedModelId(newModel.id);
    };

    const handleDelete = () => {
        if (!selectedModelId || models.length <= 1) {
            alert("Cannot delete the last model.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete "${editableModel?.name}"?`)) {
            setModels(prev => prev.filter(m => m.id !== selectedModelId));
            setSelectedModelId(models.find(m => m.id !== selectedModelId)?.id || null);
        }
    };

    const handleSave = () => {
        if (!editableModel || !editableModel.id) return;
        setModels(prev => prev.map(m => m.id === editableModel.id ? (editableModel as NegotiationModel) : m));
        alert('Model saved!');
    };
    
    const handleFieldChange = (field: keyof NegotiationModel, value: any) => {
        if (editableModel) setEditableModel(prev => ({...prev, [field]: value}));
    };
    
    const handleNestedFieldChange = (section: keyof NegotiationModel, field: string, value: any) => {
        if (editableModel) {
            setEditableModel(prev => ({
                ...prev,
                [section]: { ...((prev as any)[section]), [field]: value }
            }));
        }
    };

    const handleTacticChange = (tactic: 'expiring_offer' | 'payment_in_full_discount' | 'broken_promise_fee_waiver') => {
        if (!editableModel || !editableModel.allowedTactics) return;
        const newTactics = editableModel.allowedTactics.includes(tactic)
            ? editableModel.allowedTactics.filter(t => t !== tactic)
            : [...editableModel.allowedTactics, tactic];
        handleFieldChange('allowedTactics', newTactics);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Negotiation Models</h3>
                    <button onClick={handleCreateNew} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-brand-accent"><Icon name="plus-square" className="h-5 w-5"/></button>
                </div>
                <div className="space-y-2">
                    {models.map(model => (
                        <button key={model.id} onClick={() => handleSelectModel(model.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedModelId === model.id ? 'bg-sky-100 dark:bg-brand-accent/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                            <p className={`font-semibold ${selectedModelId === model.id ? 'text-sky-700 dark:text-brand-accent' : 'text-slate-800 dark:text-white'}`}>{model.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{model.description}</p>
                        </button>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                {!editableModel ? (
                    <div className="flex items-center justify-center h-full text-center">
                        <div>
                            <Icon name="gavel" className="h-12 w-12 mx-auto text-slate-400" />
                            <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">Select a model to edit or create a new one.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit: {editableModel.name}</h2>
                            <div className="flex gap-2">
                                <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-md"><Icon name="trash" className="h-5 w-5"/></button>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500"><Icon name="check" className="h-5 w-5"/>Save Model</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Model Name</label>
                                <input type="text" value={editableModel.name || ''} onChange={(e) => handleFieldChange('name', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                                <textarea rows={2} value={editableModel.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-800 dark:text-white">Settlement Strategy</h4>
                            <SliderControl label="Max Settlement Discount" tooltip="Maximum percentage of the balance the agent is authorized to discount for a settlement." value={editableModel.settlementAuthority?.maxPercentage || 0} min={0} max={100} unit="%" onChange={val => handleNestedFieldChange('settlementAuthority', 'maxPercentage', val)} />
                            <ToggleSwitch label="Simulate Manager Approval" tooltip="If enabled, the agent will say things like 'Let me check with my manager...' before offering the max discount, to increase its perceived value." checked={editableModel.settlementAuthority?.requiresApprovalSimulation || false} onChange={val => handleNestedFieldChange('settlementAuthority', 'requiresApprovalSimulation', val)} />
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Offer Pacing</label>
                                <select value={editableModel.offerPacing || 'gradual'} onChange={e => handleFieldChange('offerPacing', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
                                    <option value="immediate">Immediate (Offer best deal first)</option>
                                    <option value="gradual">Gradual (Start low and increase)</option>
                                    <option value="last_resort">Last Resort (Only if debtor refuses)</option>
                                </select>
                            </div>
                        </div>

                         <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-800 dark:text-white">Payment Plan Strategy</h4>
                             <ToggleSwitch label="Allow Custom Plans" tooltip="Allow the agent to negotiate payment plan terms (duration, amount) beyond the pre-defined options." checked={editableModel.paymentPlanFlexibility?.allowCustomPlans || false} onChange={val => handleNestedFieldChange('paymentPlanFlexibility', 'allowCustomPlans', val)} />
                             <SliderControl label="Max Plan Duration" tooltip="The maximum number of months a payment plan can last." value={editableModel.paymentPlanFlexibility?.maxDurationMonths || 1} min={1} max={36} unit=" months" onChange={val => handleNestedFieldChange('paymentPlanFlexibility', 'maxDurationMonths', val)} />
                             <SliderControl label="Min Installment" tooltip="Minimum payment amount as a percentage of the total balance." value={editableModel.paymentPlanFlexibility?.minInstallmentPercentage || 1} min={1} max={50} unit="%" onChange={val => handleNestedFieldChange('paymentPlanFlexibility', 'minInstallmentPercentage', val)} />
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-800 dark:text-white">Special Protocols & Tactics</h4>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Hardship Protocol</label>
                                <select value={editableModel.hardshipProtocol || 'link_to_hardship_playbook'} onChange={e => handleFieldChange('hardshipProtocol', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
                                    <option value="link_to_hardship_playbook">Switch to Hardship Playbook</option>
                                    <option value="offer_pause">Offer 30-Day Payment Pause</option>
                                    <option value="verify_income">Attempt to Verify Income</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Allowed Tactics</label>
                                <div className="space-y-2 mt-2">
                                     <ToggleSwitch label="Expiring Offer" tooltip="Creates urgency by stating an offer is time-limited." checked={editableModel.allowedTactics?.includes('expiring_offer') || false} onChange={() => handleTacticChange('expiring_offer')} />
                                     <ToggleSwitch label="P-I-F Discount" tooltip="Offer a small additional discount for payment in full." checked={editableModel.allowedTactics?.includes('payment_in_full_discount') || false} onChange={() => handleTacticChange('payment_in_full_discount')} />
                                     <ToggleSwitch label="Fee Waiver" tooltip="Offer to waive a 'late fee' or 'broken promise fee' as a goodwill gesture." checked={editableModel.allowedTactics?.includes('broken_promise_fee_waiver') || false} onChange={() => handleTacticChange('broken_promise_fee_waiver')} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NegotiationModelStudio;
