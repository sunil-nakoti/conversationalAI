// FIX: Removed invalid file headers that were causing syntax errors.
import React from 'react';
import { Icon } from '../Icon';
import { PaymentPortalSettings, BrandingProfile } from '../../types';
import Tooltip from '../Tooltip';
import AiChatbotWidget from './AiChatbotWidget';

interface PaymentPortalProps {
    settings: PaymentPortalSettings;
    setSettings: React.Dispatch<React.SetStateAction<PaymentPortalSettings>>;
    brandingProfiles: BrandingProfile[];
}

// Mock data for a sample debtor to provide context to the chatbot.
const mockDebtorForChatbot = {
    fullname: 'Jane Doe',
    currentbalance: 850.75,
    originalcreditor: 'Global Bank Inc.',
    settlementOfferPercentage: 40,
    paymentPlanOptions: "3 monthly payments of $283.58",
};

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; description?: string; }> = ({ label, enabled, setEnabled, description }) => (
    <div className="flex items-start justify-between">
        <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${enabled ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const PaymentPortal: React.FC<PaymentPortalProps> = ({ settings, setSettings, brandingProfiles }) => {
    
    const handleFieldChange = (field: keyof PaymentPortalSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-start gap-4 mb-6">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="credit-card" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Client Payment Portal</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Configure the white-labeled portal where debtors can make payments.</p>
                </div>
            </div>

            <div className="space-y-6">
                 <ToggleSwitch
                    label="Enable Payment Portal"
                    description="Activates the client-facing payment portal."
                    enabled={settings.isEnabled}
                    setEnabled={(val) => handleFieldChange('isEnabled', val)}
                />

                <div className={`space-y-6 transition-opacity ${settings.isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    
                    {/* Branding Section */}
                    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="text-md font-semibold text-slate-900 dark:text-white">Portal Branding</h4>
                        <div>
                            <label htmlFor="defaultBrandingProfileId" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                                Default Branding Profile
                            </label>
                            <select
                                id="defaultBrandingProfileId"
                                name="defaultBrandingProfileId"
                                value={settings.defaultBrandingProfileId || ''}
                                onChange={(e) => handleFieldChange('defaultBrandingProfileId', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            >
                                {brandingProfiles.map(profile => (
                                    <option key={profile.id} value={profile.id}>{profile.companyName}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                This branding will be shown when users navigate to the main payment page without a campaign-specific context.
                            </p>
                        </div>
                    </div>
                    
                    {/* Payment Options */}
                    <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                         <h4 className="text-md font-semibold text-slate-900 dark:text-white">Payment Options</h4>
                         <div className="flex items-center gap-6">
                            <ToggleSwitch label="Accept Credit Cards" enabled={settings.acceptCreditCard} setEnabled={(val) => handleFieldChange('acceptCreditCard', val)} />
                            <ToggleSwitch label="Accept ACH/Bank Transfer" enabled={settings.acceptAch} setEnabled={(val) => handleFieldChange('acceptAch', val)} />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Convenience Fee</label>
                             <div className="flex gap-2">
                                 <select 
                                    value={settings.convenienceFeeType}
                                    onChange={(e) => handleFieldChange('convenienceFeeType', e.target.value)}
                                    className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                >
                                     <option value="none">None</option>
                                     <option value="percentage">Percentage (%)</option>
                                     <option value="fixed">Fixed Amount ($)</option>
                                 </select>
                                 <input
                                    type="number"
                                    value={settings.convenienceFeeValue}
                                    onChange={(e) => handleFieldChange('convenienceFeeValue', parseFloat(e.target.value) || 0)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                    disabled={settings.convenienceFeeType === 'none'}
                                />
                             </div>
                         </div>
                    </div>

                    <div className="text-right pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                            Save Portal Settings
                        </button>
                    </div>
                </div>
            </div>
            
            <AiChatbotWidget debtorData={mockDebtorForChatbot} />
        </div>
    );
};

export default PaymentPortal;