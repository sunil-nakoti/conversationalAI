import React, { useState, useEffect } from 'react';
import { SmsTemplate, AiSmsSuggestion } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { apiService } from '../../services/apiService';

const smsCategories = [
    "Initial Contact",
    "Payment Reminders",
    "Negotiation & Offers",
    "Confirmations & Follow-ups"
];

const mockPurposes = [
    'Initial Outreach', 'Portal Introduction', 'Identity Verification', 'Wrong Number Check', 'Information Follow-up',
    'Payment Reminder (Soft)', 'Payment Reminder (Firm)', 'Broken Promise Follow-up', 'Upcoming Payment Reminder',
    'Failed Payment Notice', 'Final Payment Reminder', 'Payment Plan Grace Period Ending', 'Settlement Offer',
    'Final Settlement Offer', 'Small PIF Discount', 'Payment Plan Offer', 'Hardship Assistance Offer',
    'Negotiation Re-engagement', 'Payment Confirmation', 'Payment Plan Confirmation', 'Settlement Confirmation',
    'Paid in Full Notice', 'Contact Info Confirmation', 'Post-Call Follow-up', 'Compliance Info',
];

interface SmsTrainingLibraryProps {
    templates: SmsTemplate[];
    setTemplates: React.Dispatch<React.SetStateAction<SmsTemplate[]>>;
}

const KpiDisplay: React.FC<{ label: string, value: string | number | undefined, unit?: string, tooltip: string }> = ({ label, value, unit, tooltip }) => (
    <Tooltip content={tooltip}>
        <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{value ?? 'N/A'}{unit}</p>
        </div>
    </Tooltip>
);

const SmsCategory: React.FC<{ category: string, templates: SmsTemplate[], isExpanded: boolean, onToggle: () => void, onEdit: (template: SmsTemplate) => void, onDelete: (id: string) => void }> = ({ category, templates, isExpanded, onToggle, onEdit, onDelete }) => (
    <div className="bg-slate-50 dark:bg-brand-secondary/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4">
            <h4 className="font-semibold text-slate-800 dark:text-white">{category}</h4>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{templates.length} templates</span>
                <Icon name="chevron-down" className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
        </button>
        {isExpanded && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-3">
                {templates.map(template => (
                    <div key={template.id} className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{template.name}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{template.message}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => onEdit(template)} className="p-1.5 text-slate-500 hover:text-brand-accent"><Icon name="settings" className="h-4 w-4"/></button>
                                <button onClick={() => onDelete(template.id)} className="p-1.5 text-slate-500 hover:text-brand-danger"><Icon name="trash" className="h-4 w-4"/></button>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-around">
                            <KpiDisplay label="CTR" value={template.ctr} unit="%" tooltip="Click-Through Rate" />
                            <KpiDisplay label="Reply Rate" value={template.replyRate} unit="%" tooltip="Percentage of recipients who replied" />
                            <KpiDisplay label="Conversion" value={template.conversionRate} unit="%" tooltip="Percentage of recipients who made a payment" />
                            <KpiDisplay label="Opt-Out" value={template.optOutRate} unit="%" tooltip="Percentage of recipients who opted out" />
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const AiSuggestionCard: React.FC<{ suggestion: AiSmsSuggestion, onAccept: (suggestion: AiSmsSuggestion) => void, onDismiss: (id: string) => void }> = ({ suggestion, onAccept, onDismiss }) => (
    <div className="bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-start">
            <p className="text-sm text-sky-800 dark:text-sky-200 font-medium">"{suggestion.suggestedMessage}"</p>
            <div className="flex items-center gap-1 ml-4">
                <Tooltip content="Accept this suggestion and turn it into a new template">
                    <button onClick={() => onAccept(suggestion)} className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><Icon name="check" className="h-5 w-5"/></button>
                </Tooltip>
                <Tooltip content="Dismiss this suggestion">
                    <button onClick={() => onDismiss(suggestion.id)} className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><Icon name="close" className="h-5 w-5"/></button>
                </Tooltip>
            </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
            <div className="flex items-center gap-1">
                <Icon name="sparkles" className="h-4 w-4 text-yellow-500"/>
                <span><strong>Reasoning:</strong> {suggestion.reasoning}</span>
            </div>
            <div className="flex items-center gap-1">
                <Icon name="arrow-up-right" className="h-4 w-4 text-green-500"/>
                <span><strong>Predicted Lift:</strong> +{suggestion.predictedConversionLift}% Conversion</span>
            </div>
        </div>
    </div>
);

const SmsTrainingLibrary: React.FC<SmsTrainingLibraryProps> = ({ templates, setTemplates }) => {
    const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([smsCategories[0]]);
    const [activeTab, setActiveTab] = useState<'defined' | 'suggestions'>('defined');
    const [isSaving, setIsSaving] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<AiSmsSuggestion[]>([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const suggestions = await apiService.getAiSmsSuggestions();
                setAiSuggestions(suggestions);
            } catch (error) {
                console.error("Failed to fetch AI SMS suggestions:", error);
            }
        };

        fetchSuggestions();
    }, []);

    const defaultFormState: Omit<SmsTemplate, 'id'> = {
        name: '',
        category: smsCategories[0],
        purpose: mockPurposes[0],
        message: '',
    };

    const [formData, setFormData] = useState(defaultFormState);

    useEffect(() => {
        if (editingTemplate) {
            setFormData(editingTemplate);
        } else {
            setFormData(defaultFormState);
        }
    }, [editingTemplate]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingTemplate) {
                const updatedTemplate = await apiService.updateSmsTemplate(editingTemplate.id, formData);
                setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
            } else {
                const createdTemplate = await apiService.createSmsTemplate(formData);
                setTemplates(prev => [createdTemplate, ...prev]);
            }
            setEditingTemplate(null);
            setFormData(defaultFormState);
        } catch (err) {
            console.error('Failed to save template:', err);
            alert('Failed to save template.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleEdit = (template: SmsTemplate) => {
        setEditingTemplate(template);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (templateId: string) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            try {
                await apiService.deleteSmsTemplate(templateId);
                setTemplates(prev => prev.filter(t => t.id !== templateId));
                if (editingTemplate?.id === templateId) {
                    setEditingTemplate(null);
                }
            } catch (err) {
                console.error('Failed to delete template:', err);
                alert('Failed to delete template.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingTemplate(null);
    };

    const handleAcceptSuggestion = (suggestion: AiSmsSuggestion) => {
        setFormData({
            name: `AI Suggestion - ${suggestion.source}`,
            category: smsCategories[0], // Default category
            purpose: mockPurposes[0], // Default purpose
            message: suggestion.suggestedMessage,
        });
        setActiveTab('defined');
        handleDismissSuggestion(suggestion.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDismissSuggestion = (suggestionId: string) => {
        setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const templatesByCategory = templates.reduce((acc, template) => {
        (acc[template.category] = acc[template.category] || []).push(template);
        return acc;
    }, {} as Record<string, SmsTemplate[]>);

    const inputClass = "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white";

    return (
        <div>
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                <button onClick={() => setActiveTab('defined')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'defined' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <Icon name="clipboard-list" className="h-5 w-5"/> Defined Templates
                </button>
                <button onClick={() => setActiveTab('suggestions')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'suggestions' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <Icon name="sparkles" className="h-5 w-5"/> AI Suggestions
                    {aiSuggestions.length > 0 && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">{aiSuggestions.length}</span>}
                </button>
            </div>

            {activeTab === 'defined' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">SMS Categories</h3>
                        {smsCategories.map(category => (
                            <SmsCategory
                                key={category}
                                category={category}
                                templates={templatesByCategory[category] || []}
                                isExpanded={expandedCategories.includes(category)}
                                onToggle={() => toggleCategory(category)}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-fit sticky top-24">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{editingTemplate ? 'Edit SMS Template' : 'Create New Template'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Template Name</label>
                                <input id="name" name="name" type="text" value={formData.name} onChange={handleFormChange} placeholder="e.g., Initial Outreach - Friendly" className={inputClass} required />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleFormChange} className={inputClass}>
                                    {smsCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="purpose" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Purpose</label>
                                <select id="purpose" name="purpose" value={formData.purpose} onChange={handleFormChange} className={inputClass}>
                                    {mockPurposes.map(pur => <option key={pur} value={pur}>{pur}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Message</label>
                                <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleFormChange} placeholder="Enter your SMS content here. Use {debtor.fullname} for personalization." className={inputClass} required />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Variables: {`{debtor.fullname}`}, {`{debtor.accountnumber}`}, {`{branding.companyName}`}</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                {editingTemplate && <button type="button" onClick={handleCancelEdit} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg">Cancel</button>}
                                <button type="submit" disabled={isSaving} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg disabled:bg-slate-400">
                                    {isSaving ? 'Saving...' : (editingTemplate ? 'Save Changes' : 'Create Template')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'suggestions' && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">AI-Powered SMS Suggestions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Our AI analyzes successful conversations and industry best practices to recommend new SMS templates.
                        Accept a suggestion to edit and save it as a new template.
                    </p>
                    <div className="space-y-4">
                        {aiSuggestions.length > 0 ? (
                            aiSuggestions.map(suggestion => (
                                <AiSuggestionCard 
                                    key={suggestion.id} 
                                    suggestion={suggestion}
                                    onAccept={handleAcceptSuggestion}
                                    onDismiss={handleDismissSuggestion}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                                <Icon name="bot" className="h-12 w-12 mx-auto text-slate-400"/>
                                <h4 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">No New Suggestions</h4>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Check back later for new AI-powered recommendations.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmsTrainingLibrary;