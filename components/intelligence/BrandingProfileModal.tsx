import React, { useState, useEffect } from 'react';
import { BrandingProfile, WebhookEventType, NotificationPlatform, NotificationEventType, NotificationIntegration } from '../../types';
import { Icon } from '../Icon';

interface BrandingProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: BrandingProfile) => void;
    profile: Partial<BrandingProfile> | null;
}

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-md font-semibold text-slate-900 dark:text-white">{title}</h3>
        {children}
    </div>
);

const webhookEventTypes: WebhookEventType[] = ['call_completed', 'sms_received', 'payment_successful', 'ptp_created'];
const notificationEventTypes: NotificationEventType[] = ['rpc', 'opt_in', 'ptp', 'payment_made'];
const notificationPlatforms: NotificationPlatform[] = ['discord', 'slack', 'teams'];


const BrandingProfileModal: React.FC<BrandingProfileModalProps> = ({ isOpen, onClose, onSave, profile }) => {
    const [formData, setFormData] = useState<Partial<BrandingProfile>>({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                ...profile,
                notificationIntegrations: profile.notificationIntegrations?.map(n => ({...n})) || []
            });
        } else {
            setFormData({
                companyName: '',
                logoUrl: '',
                brandColor: '#38BDF8',
                phoneNumber: '',
                emailAddress: '',
                websiteUrl: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                paymentPortalIsEnabled: true,
                acceptCreditCard: true,
                acceptAch: true,
                convenienceFeeType: 'none',
                convenienceFeeValue: 0,
                clientApiKey: `arc-${[...Array(4)].map(() => Math.random().toString(36).substring(2, 6)).join('-')}`,
                rateLimit: 100,
                webhookEvents: [],
                notificationIntegrations: [],
            });
        }
    }, [profile, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleWebhookEventChange = (event: WebhookEventType) => {
        const currentEvents = formData.webhookEvents || [];
        const newEvents = currentEvents.includes(event)
            ? currentEvents.filter(e => e !== event)
            : [...currentEvents, event];
        setFormData(prev => ({ ...prev, webhookEvents: newEvents }));
    };

    const regenerateApiKey = () => {
        const newKey = `arc-${[...Array(4)].map(() => Math.random().toString(36).substring(2, 6)).join('-')}`;
        setFormData(prev => ({ ...prev, clientApiKey: newKey }));
    };

    const handleCopyKey = () => {
        if (formData.clientApiKey) {
            navigator.clipboard.writeText(formData.clientApiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    // --- Notification Integration Handlers ---
    const handleAddIntegration = () => {
        const newIntegration: NotificationIntegration = {
            id: `integ_${Date.now()}`,
            platform: 'discord',
            webhookUrl: '',
            events: []
        };
        setFormData(prev => ({
            ...prev,
            notificationIntegrations: [...(prev.notificationIntegrations || []), newIntegration]
        }));
    };

    const handleUpdateIntegration = (id: string, field: keyof Omit<NotificationIntegration, 'id'>, value: any) => {
        setFormData(prev => ({
            ...prev,
            notificationIntegrations: (prev.notificationIntegrations || []).map(integ => 
                integ.id === id ? { ...integ, [field]: value } : integ
            )
        }));
    };
    
     const handleNotificationEventChange = (integrationId: string, event: NotificationEventType) => {
        const integration = formData.notificationIntegrations?.find(i => i.id === integrationId);
        if (!integration) return;
        const newEvents = integration.events.includes(event)
            ? integration.events.filter(e => e !== event)
            : [...integration.events, event];
        handleUpdateIntegration(integrationId, 'events', newEvents);
    };

    const handleDeleteIntegration = (id: string) => {
        setFormData(prev => ({
            ...prev,
            notificationIntegrations: (prev.notificationIntegrations || []).filter(integ => integ.id !== id)
        }));
    };


    const handleSave = () => {
        onSave({
            id: formData.id || `bp_${Date.now()}`,
            ...formData
        } as BrandingProfile);
        onClose();
    };

    const inputClass = "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white";

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.id ? 'Edit' : 'Create'} Branding Profile</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"><Icon name="x" className="h-6 w-6" /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Company Name *</label>
                            <input type="text" name="companyName" value={formData.companyName || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Brand Color</label>
                            <input type="color" name="brandColor" value={formData.brandColor || '#38BDF8'} onChange={handleChange} className={`${inputClass} h-10`} />
                        </div>
                    </div>
                    {/* ... other basic fields ... */}
                     <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Logo URL</label>
                        <input type="text" name="logoUrl" value={formData.logoUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://example.com/logo.png" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Contact Phone</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Contact Email</label>
                            <input type="email" name="emailAddress" value={formData.emailAddress || ''} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Website URL</label>
                        <input type="text" name="websiteUrl" value={formData.websiteUrl || ''} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Street Address</label>
                        <input type="text" name="streetAddress" value={formData.streetAddress || ''} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium mb-1">City</label><input type="text" name="city" value={formData.city || ''} onChange={handleChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium mb-1">State</label><input type="text" name="state" value={formData.state || ''} onChange={handleChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium mb-1">Zip Code</label><input type="text" name="zipCode" value={formData.zipCode || ''} onChange={handleChange} className={inputClass} /></div>
                    </div>

                    {/* Payment Portal Settings */}
                    <FormSection title="Payment Portal Settings">
                         <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <input type="checkbox" name="paymentPortalIsEnabled" checked={formData.paymentPortalIsEnabled} onChange={handleChange} className="h-4 w-4 rounded text-brand-accent" />
                            <span className="text-sm font-medium">Enable Payment Portal for this Brand</span>
                        </label>
                        {/* ... other payment settings ... */}
                    </FormSection>

                    {/* Core API Integrations */}
                    <FormSection title="Core API Integrations">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Twilio Account SID</label><input type="text" name="twilioSid" value={formData.twilioSid || ''} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="block text-sm font-medium mb-1">Twilio Auth Token</label><input type="password" name="twilioAuthToken" value={formData.twilioAuthToken || ''} onChange={handleChange} className={inputClass} /></div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Payment Gateway API Key</label><input type="text" name="paymentGatewayApiKey" value={formData.paymentGatewayApiKey || ''} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="block text-sm font-medium mb-1">Payment Gateway Secret Key</label><input type="password" name="paymentGatewaySecretKey" value={formData.paymentGatewaySecretKey || ''} onChange={handleChange} className={inputClass} /></div>
                        </div>
                    </FormSection>

                    {/* External API Access */}
                    <FormSection title="External API Access & Webhooks">
                         <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Client API Key</label>
                            <div className="flex gap-2">
                                <input type="text" readOnly value={formData.clientApiKey || 'No key generated'} className={`${inputClass} bg-slate-100 dark:bg-slate-800 font-mono`} />
                                <button type="button" onClick={handleCopyKey} className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 p-2 rounded-md hover:bg-slate-300"><Icon name={copied ? 'check' : 'copy'} className="h-5 w-5" /></button>
                                <button type="button" onClick={regenerateApiKey} className="flex-shrink-0 bg-slate-200 dark:bg-slate-700 p-2 rounded-md hover:bg-slate-300"><Icon name="refresh" className="h-5 w-5" /></button>
                            </div>
                        </div>
                         <div><label className="block text-sm font-medium mb-1">Rate Limit (requests/min)</label><input type="number" name="rateLimit" value={formData.rateLimit || 100} onChange={handleChange} className={inputClass} /></div>
                         <div><label className="block text-sm font-medium mb-1">Webhook URL</label><input type="url" name="webhookUrl" value={formData.webhookUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://client-crm.com/webhook" /></div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Webhook Events</label>
                            <div className="grid grid-cols-2 gap-2">
                                {webhookEventTypes.map(event => (
                                    <label key={event} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                        <input type="checkbox" checked={formData.webhookEvents?.includes(event)} onChange={() => handleWebhookEventChange(event)} className="h-4 w-4 rounded text-brand-accent" />
                                        <span>{event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </FormSection>

                    {/* Notification Triggers */}
                    <FormSection title="Real-time Notification Triggers">
                        <div className="space-y-3">
                            {(formData.notificationIntegrations || []).map((integ) => (
                                <div key={integ.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 relative">
                                    <button onClick={() => handleDeleteIntegration(integ.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"><Icon name="trash" className="h-4 w-4"/></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Platform</label>
                                            <select value={integ.platform} onChange={e => handleUpdateIntegration(integ.id, 'platform', e.target.value)} className={inputClass}>
                                                {notificationPlatforms.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Webhook URL</label>
                                            <input type="url" value={integ.webhookUrl} onChange={e => handleUpdateIntegration(integ.id, 'webhookUrl', e.target.value)} className={inputClass} placeholder="Paste URL here..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Trigger Events</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {notificationEventTypes.map(event => (
                                                 <label key={event} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                                    <input type="checkbox" checked={integ.events.includes(event)} onChange={() => handleNotificationEventChange(integ.id, event)} className="h-4 w-4 rounded text-brand-accent" />
                                                    <span className="text-sm">{event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button type="button" onClick={handleAddIntegration} className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            <Icon name="plus-square" className="h-5 w-5" />
                            Add Notification Trigger
                        </button>
                    </FormSection>

                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg">Save Profile</button>
                </div>
            </div>
        </div>
    );
};

export default BrandingProfileModal;