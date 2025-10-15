import React, { useState } from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { BrandingProfile, BrandedCallingSettings } from '../../types';
import BrandingProfileModal from './BrandingProfileModal';

interface BrandingManagerProps {
    profiles: BrandingProfile[];
    setProfiles: React.Dispatch<React.SetStateAction<BrandingProfile[]>>;
    brandedCallingSettings: BrandedCallingSettings;
    setBrandedCallingSettings: React.Dispatch<React.SetStateAction<BrandedCallingSettings>>;
    onPreviewPaymentPage: (profileId: string) => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; tooltip: string; }> = ({ label, enabled, setEnabled, tooltip }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <Tooltip content={tooltip}><Icon name="info" className="h-4 w-4 text-slate-400" /></Tooltip>
        </div>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${enabled ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const BrandingManager: React.FC<BrandingManagerProps> = ({ profiles, setProfiles, brandedCallingSettings, setBrandedCallingSettings, onPreviewPaymentPage }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Partial<BrandingProfile> | null>(null);

    const handleAddNew = () => {
        setEditingProfile(null);
        setIsModalOpen(true);
    };

    const handleEdit = (profile: BrandingProfile) => {
        setEditingProfile(profile);
        setIsModalOpen(true);
    };

    const handleSave = (profileToSave: BrandingProfile) => {
        if (profileToSave.id && profiles.some(p => p.id === profileToSave.id)) {
            setProfiles(profiles.map(p => p.id === profileToSave.id ? profileToSave : p));
        } else {
            setProfiles([...profiles, profileToSave]);
        }
    };
    
    const handleDelete = (profileId: string) => {
        if(window.confirm("Are you sure you want to delete this branding profile?")) {
            setProfiles(profiles.filter(p => p.id !== profileId));
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Branded Calling Settings</h3>
                <div className="space-y-4">
                    <ToggleSwitch 
                        label="Enable Branded Calling (CNAM)"
                        enabled={brandedCallingSettings.isEnabled}
                        setEnabled={(val) => setBrandedCallingSettings(p => ({...p, isEnabled: val}))}
                        tooltip="When enabled, outbound calls will attempt to display your company name on the recipient's caller ID."
                    />
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Default Branding Profile</label>
                        <select 
                            value={brandedCallingSettings.defaultBrandingProfileId || ''} 
                            onChange={(e) => setBrandedCallingSettings(p => ({...p, defaultBrandingProfileId: e.target.value}))} 
                            disabled={!brandedCallingSettings.isEnabled}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50"
                        >
                             <option value="">None</option>
                             {profiles.map(p => <option key={p.id} value={p.id}>{p.companyName}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Branding Profiles</h3>
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        <Icon name="plus-square" className="h-5 w-5" />
                        Add New Profile
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                        <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Company Name</th>
                                <th scope="col" className="px-6 py-3">Phone</th>
                                <th scope="col" className="px-6 py-3">Website</th>
                                <th scope="col" className="px-6 py-3 text-center">Integrations</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map(profile => (
                                <tr key={profile.id} className="border-b border-slate-200 dark:border-slate-700/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: profile.brandColor}}></div>
                                        {profile.companyName}
                                    </td>
                                    <td className="px-6 py-4">{profile.phoneNumber}</td>
                                    <td className="px-6 py-4">{profile.websiteUrl}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Tooltip content={profile.paymentPortalIsEnabled ? "Payment Portal: Enabled" : "Payment Portal: Disabled"}>
                                                <Icon name="credit-card" className={`h-5 w-5 ${profile.paymentPortalIsEnabled ? 'text-green-500' : 'text-slate-400'}`} />
                                            </Tooltip>
                                            <Tooltip content={profile.twilioSid ? "Twilio Integrated" : "Twilio Not Integrated"}>
                                                <Icon name="phone" className={`h-5 w-5 ${profile.twilioSid ? 'text-green-500' : 'text-slate-400'}`} />
                                            </Tooltip>
                                            <Tooltip content={profile.paymentGatewayApiKey ? "Payment Gateway Integrated" : "Payment Gateway Not Integrated"}>
                                                <Icon name="dollar" className={`h-5 w-5 ${profile.paymentGatewayApiKey ? 'text-green-500' : 'text-slate-400'}`} />
                                            </Tooltip>
                                            <Tooltip content={profile.clientApiKey ? "External API Enabled" : "External API Disabled"}>
                                                <Icon name="link" className={`h-5 w-5 ${profile.clientApiKey ? 'text-green-500' : 'text-slate-400'}`} />
                                            </Tooltip>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Tooltip content="Preview Payment Page"><button onClick={() => onPreviewPaymentPage(profile.id)} className="p-1 text-slate-500 hover:text-green-500"><Icon name="eye" className="h-4 w-4" /></button></Tooltip>
                                            <Tooltip content="Edit Profile"><button onClick={() => handleEdit(profile)} className="p-1 text-slate-500 hover:text-brand-accent"><Icon name="settings" className="h-4 w-4" /></button></Tooltip>
                                            <Tooltip content="Delete Profile"><button onClick={() => handleDelete(profile.id)} className="p-1 text-slate-500 hover:text-brand-danger"><Icon name="trash" className="h-4 w-4" /></button></Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BrandingProfileModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                profile={editingProfile}
            />
        </div>
    );
};

export default BrandingManager;