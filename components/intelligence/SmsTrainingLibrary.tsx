import React, { useState, useEffect } from 'react';
import { SmsTemplate, AiSmsSuggestion } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

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

const initialSmsTemplates: SmsTemplate[] = [
    // Initial Contact
    { id: 'sms1', name: 'Standard Initial Outreach', category: 'Initial Contact', purpose: 'Initial Outreach', message: 'Hello {debtor.fullname}, this is a message from {branding.companyName} regarding account #{debtor.accountnumber}. Please call us at {branding.phoneNumber} to discuss this matter.', ctr: 2.5, replyRate: 15.2, conversionRate: 1.8, optOutRate: 0.5, avgSentiment: 5.5, complianceScore: 95 },
    { id: 'sms2', name: 'Urgent Initial Outreach', category: 'Initial Contact', purpose: 'Initial Outreach', message: 'URGENT: {debtor.fullname}, we need to speak with you about your account with {debtor.originalcreditor}. Contact us at {branding.phoneNumber} immediately. Account: #{debtor.accountnumber}.', ctr: 3.1, replyRate: 18.0, conversionRate: 2.1, optOutRate: 0.8, avgSentiment: 4.2, complianceScore: 90 },
    { id: 'sms3', name: 'Portal Introduction', category: 'Initial Contact', purpose: 'Portal Introduction', message: 'Hi {debtor.fullname}. Manage your account #{debtor.accountnumber} with {branding.companyName} online 24/7. View options and make payments here: {payment.link}', ctr: 18.2, replyRate: 5.5, conversionRate: 9.1, optOutRate: 0.3, avgSentiment: 7.1, complianceScore: 100 },
    { id: 'sms4', name: 'Verification Request', category: 'Initial Contact', purpose: 'Identity Verification', message: 'For your security, please verify your identity for account #{debtor.accountnumber} with {branding.companyName} by replying with your ZIP code.', ctr: 0.1, replyRate: 65.2, conversionRate: 0.5, optOutRate: 0.1, avgSentiment: 6.0, complianceScore: 100 },
    { id: 'sms5', name: 'Wrong Number Check', category: 'Initial Contact', purpose: 'Wrong Number Check', message: 'We are trying to reach {debtor.fullname}. If this is not you, please reply STOP.', ctr: 0.0, replyRate: 22.8, conversionRate: 0.0, optOutRate: 22.0, avgSentiment: 5.0, complianceScore: 100 },

    // Payment Reminders
    { id: 'sms6', name: 'Friendly Payment Reminder', category: 'Payment Reminders', purpose: 'Payment Reminder (Soft)', message: 'Hi {debtor.fullname}, just a friendly reminder that your payment of ${payment.amount} is due on {payment.due_date}. You can pay here: {payment.link}', ctr: 12.8, replyRate: 8.1, conversionRate: 6.2, optOutRate: 0.2, avgSentiment: 7.8, complianceScore: 100, isAbTesting: true, challengerMessage: 'Hi {debtor.fullname}, your payment of ${payment.amount} is due {payment.due_date}. Don\'t forget to pay to keep your account in good standing. Pay here: {payment.link}' },
    { id: 'sms7', name: 'Upcoming Payment Notice', category: 'Payment Reminders', purpose: 'Upcoming Payment Reminder', message: 'Your scheduled payment of ${payment.amount} for account #{debtor.accountnumber} will be processed in 2 days. No action is needed.', ctr: 1.5, replyRate: 3.2, conversionRate: 0.1, optOutRate: 0.1, avgSentiment: 8.5, complianceScore: 100 },
    { id: 'sms8', name: 'Overdue Notice (Firm)', category: 'Payment Reminders', purpose: 'Payment Reminder (Firm)', message: 'Your payment of ${payment.amount} is now overdue. Please contact us at {branding.phoneNumber} to resolve this and avoid further action. Account #{debtor.accountnumber}.', ctr: 9.5, replyRate: 25.4, conversionRate: 4.5, optOutRate: 1.2, avgSentiment: 3.1, complianceScore: 85 },
    { id: 'sms9', name: 'Broken Promise Follow-up', category: 'Payment Reminders', purpose: 'Broken Promise Follow-up', message: 'Hi {debtor.fullname}, we have not yet received the payment you scheduled for {payment.due_date}. Please contact us immediately at {branding.phoneNumber}.', ctr: 8.1, replyRate: 30.1, conversionRate: 5.3, optOutRate: 1.5, avgSentiment: 2.8, complianceScore: 90 },
    { id: 'sms10', name: 'Failed Payment Notice', category: 'Payment Reminders', purpose: 'Failed Payment Notice', message: 'We were unable to process your payment of ${payment.amount} for account #{debtor.accountnumber}. Please update your payment method here: {payment.link}', ctr: 25.6, replyRate: 10.5, conversionRate: 12.3, optOutRate: 0.4, avgSentiment: 6.5, complianceScore: 100 },
    
    // Negotiation & Offers
    { id: 'sms11', name: 'Settlement Offer (Percentage)', category: 'Negotiation & Offers', purpose: 'Settlement Offer', message: 'Good news {debtor.fullname}! You may be eligible to resolve your account #{debtor.accountnumber} for just 50% of the balance. Offer expires in 48 hours. Call {branding.phoneNumber}.', ctr: 15.2, replyRate: 12.3, conversionRate: 8.7, optOutRate: 0.4, avgSentiment: 8.2, complianceScore: 95 },
    { id: 'sms12', name: 'Settlement Offer (Direct Link)', category: 'Negotiation & Offers', purpose: 'Settlement Offer', message: '{debtor.fullname}, you can resolve your outstanding balance of ${debtor.currentbalance} for a one-time payment of $${settlement.amount}. Pay here: {payment.link}', ctr: 22.3, replyRate: 6.8, conversionRate: 15.4, optOutRate: 0.3, avgSentiment: 8.0, complianceScore: 95 },
    { id: 'sms13', name: 'Payment Plan Offer', category: 'Negotiation & Offers', purpose: 'Payment Plan Offer', message: 'Can\'t pay in full? We can help. Set up a flexible payment plan for your account with {branding.companyName} here: {payment.link}', ctr: 19.8, replyRate: 9.2, conversionRate: 10.1, optOutRate: 0.3, avgSentiment: 7.5, complianceScore: 100 },
    { id: 'sms14', name: 'Hardship Assistance', category: 'Negotiation & Offers', purpose: 'Hardship Assistance Offer', message: 'Hi {debtor.fullname}, we understand things can be difficult. If you\'re experiencing financial hardship, please call us at {branding.phoneNumber} to discuss available options.', ctr: 1.2, replyRate: 40.5, conversionRate: 3.3, optOutRate: 0.1, avgSentiment: 9.1, complianceScore: 100 },
    { id: 'sms15', name: 'Final Offer Notice', category: 'Negotiation & Offers', purpose: 'Final Settlement Offer', message: 'FINAL NOTICE: This is the last opportunity to resolve your account #{debtor.accountnumber} with a discount. Call {branding.phoneNumber} now to avoid escalation.', ctr: 10.1, replyRate: 19.5, conversionRate: 6.8, optOutRate: 2.1, avgSentiment: 2.5, complianceScore: 75 },
    
    // Confirmations & Follow-ups
    { id: 'sms16', name: 'Payment Confirmation', category: 'Confirmations & Follow-ups', purpose: 'Payment Confirmation', message: 'Thank you for your payment of ${payment.amount}. Your confirmation number is {payment.confirmation_id}. Your account has been updated.', ctr: 1.1, replyRate: 2.0, conversionRate: 0, optOutRate: 0.1, avgSentiment: 9.5, complianceScore: 100 },
    { id: 'sms17', name: 'Payment Plan Confirmation', category: 'Confirmations & Follow-ups', purpose: 'Payment Plan Confirmation', message: 'Your payment plan has been successfully set up. Your first payment of ${payment.amount} is scheduled for {payment.due_date}.', ctr: 2.3, replyRate: 4.1, conversionRate: 0, optOutRate: 0.1, avgSentiment: 9.0, complianceScore: 100 },
    { id: 'sms18', name: 'Paid in Full Notice', category: 'Confirmations & Follow-ups', purpose: 'Paid in Full Notice', message: 'Congratulations, {debtor.fullname}! Your account #{debtor.accountnumber} has been paid in full. Thank you.', ctr: 0.8, replyRate: 1.5, conversionRate: 0, optOutRate: 0.0, avgSentiment: 9.8, complianceScore: 100 },
    { id: 'sms19', name: 'Post-Call Follow-up', category: 'Confirmations & Follow-ups', purpose: 'Post-Call Follow-up', message: 'Thank you for speaking with us today. As discussed, you can view your payment options here: {payment.link}', ctr: 35.2, replyRate: 3.1, conversionRate: 20.5, optOutRate: 0.1, avgSentiment: 8.8, complianceScore: 100 },
    { id: 'sms20', name: 'Compliance Info Snippet', category: 'Confirmations & Follow-ups', purpose: 'Compliance Info', message: 'This is a message from a debt collector. This is an attempt to collect a debt and any information obtained will be used for that purpose.', ctr: 0.0, replyRate: 0.5, conversionRate: 0.0, optOutRate: 0.2, avgSentiment: 5.0, complianceScore: 100 },
];


const mockAiSmsSuggestions: AiSmsSuggestion[] = [
    { id: 'sug1', source: 'conversation', suggestedMessage: 'Hi {debtor.fullname}, I understand things are tough. We have new flexible payment options that might help. Are you open to discussing them?', reasoning: 'This message from a manual conversation had a 35% higher positive reply rate and led to a payment plan setup.', predictedConversionLift: 12 },
    { id: 'sug2', source: 'generation', suggestedMessage: 'Hi {debtor.fullname}, we haven\'t heard from you regarding your account #{debtor.accountnumber}. We can help you resolve this. Please call {branding.phoneNumber} at your convenience.', reasoning: 'Generated as a friendly, low-pressure re-engagement message for dormant accounts.', predictedConversionLift: 5 },
];


const KpiDisplay: React.FC<{ icon: any, value: string, tooltip: string }> = ({ icon, value, tooltip }) => (
    <Tooltip content={tooltip}>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Icon name={icon} className="h-4 w-4" />
            <span className="font-semibold">{value}</span>
        </div>
    </Tooltip>
);

const SmsCategory: React.FC<{
    category: string; templates: SmsTemplate[]; isExpanded: boolean; onToggle: () => void; onEdit: (template: SmsTemplate) => void; onDelete: (templateId: string) => void;
}> = ({ category, templates, isExpanded, onToggle, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{category}</h4>
            <Icon name="chevron-down" className={`h-6 w-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} />
        </button>
        {isExpanded && (
            <div className="p-4 overflow-x-auto">
                <table className="w-full min-w-[1200px] text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Template Name</th>
                            <th scope="col" className="px-4 py-3">Message</th>
                            <th scope="col" className="px-4 py-3">Performance</th>
                            <th scope="col" className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map(t => (
                            <tr key={t.id} className="border-b border-slate-200 dark:border-slate-700/50 last:border-0">
                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                    {t.name}
                                    {t.isAbTesting && <span className="ml-2 text-xs font-bold text-yellow-500">[A/B Test]</span>}
                                </td>
                                <td className="px-4 py-3 text-slate-500 dark:text-slate-300 max-w-sm truncate">{t.message}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-4">
                                        <KpiDisplay icon="trending-up" value={`${t.ctr?.toFixed(1) ?? 'N/A'}%`} tooltip="Click-Through Rate" />
                                        <KpiDisplay icon="message-square" value={`${t.replyRate?.toFixed(1) ?? 'N/A'}%`} tooltip="Reply Rate" />
                                        <KpiDisplay icon="dollar" value={`${t.conversionRate?.toFixed(1) ?? 'N/A'}%`} tooltip="Payment Conversion Rate (24h)" />
                                        <KpiDisplay icon="zap-off" value={`${t.optOutRate?.toFixed(1) ?? 'N/A'}%`} tooltip="Opt-Out Rate" />
                                        <KpiDisplay icon="thumbs-up" value={`${t.avgSentiment?.toFixed(1) ?? 'N/A'}/10`} tooltip="Avg. Reply Sentiment" />
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Tooltip content="A/B Test"><button className="p-1 text-slate-500 hover:text-yellow-500"><Icon name="refresh" className="h-4 w-4" /></button></Tooltip>
                                        <Tooltip content="Edit"><button onClick={() => onEdit(t)} className="p-1 text-slate-500 hover:text-brand-accent"><Icon name="settings" className="h-4 w-4" /></button></Tooltip>
                                        <Tooltip content="Delete"><button onClick={() => onDelete(t.id)} className="p-1 text-slate-500 hover:text-brand-danger"><Icon name="trash" className="h-4 w-4" /></button></Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);


const ComplianceGuard: React.FC<{ score: number; issues: string[] }> = ({ score, issues }) => {
    const color = score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500';
    const text = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement';
    return (
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{score}</p>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Compliance Score</p>
                </div>
                <div className="flex-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${score}%` }}></div>
                    </div>
                    <p className={`text-sm font-semibold mt-1 ${color.replace('bg-', 'text-')}`}>{text}</p>
                </div>
            </div>
            {issues.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
                    {issues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                            <Icon name="warning" className="h-4 w-4" />
                            <span>{issue}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SmsTrainingLibrary: React.FC = () => {
    const [templates, setTemplates] = useState<SmsTemplate[]>(initialSmsTemplates);
    const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([smsCategories[0]]);
    const [activeTab, setActiveTab] = useState<'defined' | 'suggestions'>('defined');
    const [editingVersion, setEditingVersion] = useState<'control' | 'challenger'>('control');
    const [complianceScore, setComplianceScore] = useState(100);
    const [complianceIssues, setComplianceIssues] = useState<string[]>([]);
    const [showAIGenerate, setShowAIGenerate] = useState(false);

    const [formData, setFormData] = useState<Partial<SmsTemplate>>({
        name: '', category: smsCategories[0], message: '', purpose: mockPurposes[0], challengerMessage: ''
    });

    useEffect(() => {
        if (editingTemplate) {
            setFormData(editingTemplate);
        } else {
            setFormData({ name: '', category: smsCategories[0], message: '', purpose: mockPurposes[0], challengerMessage: '' });
        }
    }, [editingTemplate]);

    useEffect(() => {
        const message = editingVersion === 'control' ? formData.message : formData.challengerMessage;
        if (!message) {
            setComplianceScore(100);
            setComplianceIssues([]);
            return;
        }

        let score = 100;
        const issues: string[] = [];
        
        if (!message.toLowerCase().includes('{branding.companyName}'.toLowerCase())) {
            score -= 25;
            issues.push('Missing required disclosure: {branding.companyName}');
        }
        if (/(legal action|arrest|threat)/i.test(message)) {
            score -= 50;
            issues.push('Contains high-risk language (e.g., "legal action").');
        }
        if (message.length > 160) {
            score -= 10;
            issues.push('Message may exceed standard SMS length (160 characters).');
        }
        
        setComplianceScore(Math.max(0, score));
        setComplianceIssues(issues);

    }, [formData.message, formData.challengerMessage, editingVersion]);


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData };
        if (!dataToSave.isAbTesting) {
            delete dataToSave.challengerMessage;
        }

        if (editingTemplate) {
            setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? (dataToSave as SmsTemplate) : t));
        } else {
            const newTemplate = { ...dataToSave, id: `sms_${Date.now()}` } as SmsTemplate;
            setTemplates(prev => [newTemplate, ...prev]);
        }
        setEditingTemplate(null);
    };

    const handleEdit = (template: SmsTemplate) => setEditingTemplate(template);
    const handleDelete = (templateId: string) => {
        if (window.confirm("Delete this template?")) {
            setTemplates(prev => prev.filter(t => t.id !== templateId));
            if (editingTemplate?.id === templateId) setEditingTemplate(null);
        }
    };
    const handleCancelEdit = () => setEditingTemplate(null);
    const toggleCategory = (category: string) => setExpandedCategories(p => p.includes(category) ? p.filter(c => c !== category) : [...p, category]);

    const templatesByCategory = templates.reduce((acc, obj) => {
        (acc[obj.category] = acc[obj.category] || []).push(obj);
        return acc;
    }, {} as Record<string, SmsTemplate[]>);

    return (
        <div>
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                 <button onClick={() => setActiveTab('defined')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'defined' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><Icon name="sms" className="h-5 w-5" />Defined Templates</button>
                 <button onClick={() => setActiveTab('suggestions')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'suggestions' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><Icon name="brain-circuit" className="h-5 w-5" />AI Suggestions</button>
            </div>
            
            {activeTab === 'defined' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">SMS Template Library & Performance</h3>
                        {smsCategories.map(category => (
                            <SmsCategory key={category} category={category} templates={templatesByCategory[category] || []} isExpanded={expandedCategories.includes(category)} onToggle={() => toggleCategory(category)} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-fit sticky top-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{editingTemplate ? 'Edit SMS Template' : 'Add New SMS Template'}</h3>
                        <button onClick={() => setShowAIGenerate(true)} className="w-full flex items-center justify-center gap-2 bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 font-semibold py-2 px-4 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-500/30 mb-4"><Icon name="brain-circuit" className="h-5 w-5"/>Generate with AI</button>
                        <form className="space-y-4" onSubmit={handleSave}>
                            {/* Form fields */}
                             <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Template Name</label>
                                <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
                            </div>
                            {/* A/B Test UI */}
                            {formData.isAbTesting ? (
                                <div>
                                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2">
                                        <button type="button" onClick={() => setEditingVersion('control')} className={`w-1/2 py-1.5 rounded-md text-sm font-semibold ${editingVersion === 'control' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>Control</button>
                                        <button type="button" onClick={() => setEditingVersion('challenger')} className={`w-1/2 py-1.5 rounded-md text-sm font-semibold ${editingVersion === 'challenger' ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>Challenger</button>
                                    </div>
                                     <textarea name={editingVersion === 'control' ? 'message' : 'challengerMessage'} rows={4} value={editingVersion === 'control' ? formData.message : formData.challengerMessage || ''} onChange={handleFormChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
                                </div>
                            ) : (
                                 <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Message Content</label>
                                    <textarea name="message" rows={4} value={formData.message || ''} onChange={handleFormChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
                                </div>
                            )}
                            <ComplianceGuard score={complianceScore} issues={complianceIssues} />
                             {/* FIX: Changed onClick to call setFormData directly, resolving "Expected 1 arguments, but got 2" error. */}
                             {!formData.isAbTesting && <button type="button" onClick={() => setFormData(prev => ({...prev, isAbTesting: true}))} className="w-full text-sm font-semibold text-brand-accent hover:underline">Create A/B Test</button>}
                            {/* Other form fields */}
                            <div className="flex gap-2">
                                {editingTemplate && <button type="button" onClick={handleCancelEdit} className="w-full bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg">Cancel</button>}
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg"><Icon name="check" className="h-5 w-5" />{editingTemplate ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
             {activeTab === 'suggestions' && (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Icon name="brain-circuit" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Template Suggestions</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Our AI has identified high-performing manual messages that could be turned into templates.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockAiSmsSuggestions.map(sug => (
                            <div key={sug.id} className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                                <p className="text-sm bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md italic text-slate-700 dark:text-slate-200">"{sug.suggestedMessage}"</p>
                                <div className="mt-3 p-3 bg-sky-50 dark:bg-sky-500/10 rounded-md">
                                    <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">AI Reasoning:</p>
                                    <p className="text-sm text-sky-700 dark:text-sky-200">{sug.reasoning}</p>
                                    {sug.predictedConversionLift && <p className="mt-1 font-bold text-green-600 dark:text-green-400">Predicted Conversion Lift: +{sug.predictedConversionLift}%</p>}
                                </div>
                                <button className="w-full mt-3 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"><Icon name="plus-square" className="h-5 w-5"/>Create Template from Suggestion</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmsTrainingLibrary;