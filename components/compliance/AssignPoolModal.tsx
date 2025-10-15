import React, { useState } from 'react';
import { Icon } from '../Icon';
import { NumberPool, BrandingProfile } from '../../types';

interface AssignPoolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (poolId: string, phoneIds: string[]) => void;
    onCreateAndSave: (poolName: string, brandingProfileId: string | undefined, phoneIds: string[]) => void;
    numberPools: NumberPool[];
    selectedPhoneIds: string[];
    brandingProfiles: BrandingProfile[];
}

const AssignPoolModal: React.FC<AssignPoolModalProps> = (props) => {
    const { isOpen, onClose, onSave, onCreateAndSave, numberPools, selectedPhoneIds, brandingProfiles } = props;
    
    const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
    const [selectedPoolId, setSelectedPoolId] = useState<string>(numberPools[0]?.id || '');
    const [newPoolName, setNewPoolName] = useState('');
    const [newPoolBrandingId, setNewPoolBrandingId] = useState<string | undefined>(brandingProfiles[0]?.id || undefined);

    if (!isOpen) return null;

    const handleSave = () => {
        if (activeTab === 'existing' && selectedPoolId) {
            onSave(selectedPoolId, selectedPhoneIds);
        } else if (activeTab === 'new' && newPoolName.trim()) {
            onCreateAndSave(newPoolName.trim(), newPoolBrandingId, selectedPhoneIds);
        }
        onClose();
    };

    const isSaveDisabled = (activeTab === 'existing' && !selectedPoolId) || (activeTab === 'new' && !newPoolName.trim());
    
    const TabButton: React.FC<{ tab: 'existing' | 'new'; label: string; }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-1/2 py-2 font-semibold text-sm transition-colors rounded-t-md ${activeTab === tab ? 'bg-white dark:bg-brand-secondary text-brand-accent' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Pool for {selectedPhoneIds.length} Number(s)</h2>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1">
                    <TabButton tab="existing" label="Assign to Existing Pool" />
                    <TabButton tab="new" label="Create New Pool" />
                </div>
                
                <div className="p-6 space-y-4">
                    {activeTab === 'existing' && (
                        <div>
                            <label htmlFor="pool-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Select Pool</label>
                            <select id="pool-select" value={selectedPoolId} onChange={e => setSelectedPoolId(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
                                {numberPools.map(p => {
                                    const brand = brandingProfiles.find(b => b.id === p.brandingProfileId);
                                    return <option key={p.id} value={p.id}>{p.name} {brand ? `(${brand.companyName})` : ''}</option>
                                })}
                            </select>
                        </div>
                    )}
                    {activeTab === 'new' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="new-pool-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">New Pool Name</label>
                                <input id="new-pool-name" type="text" value={newPoolName} onChange={e => setNewPoolName(e.target.value)} placeholder="e.g., Prime Numbers" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="branding-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Branding Profile (Optional)</label>
                                <select id="branding-select" value={newPoolBrandingId || ''} onChange={e => setNewPoolBrandingId(e.target.value || undefined)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md">
                                    <option value="">None</option>
                                    {brandingProfiles.map(p => <option key={p.id} value={p.id}>{p.companyName}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSave} disabled={isSaveDisabled} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50">Save</button>
                </div>
            </div>
        </div>
    );
};

export default AssignPoolModal;
