import React, { useState, useEffect } from 'react';
import { Objection, AiObjectionSuggestion } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { apiService } from '../../services/apiService';

const objectionCategories = [
    "Stalls & Financial Hardship",
    "Disputes & Questioning Validity",
    "Refusals & Legal Challenges",
    "Emotional & Evasive Responses",
    "Third-Party & Scammer Defenses"
];

const mockPlaybooks = [
    { id: 'pb1', name: 'Hardship Payment Plan' }, { id: 'pb2', name: 'Debt Validation Script' }, { id: 'pb3', name: 'Cease & Desist Protocol' }, { id: 'pb4', name: 'Empathy & Reassurance' }, { id: 'pb5', name: 'Company Legitimacy & Verification' }, { id: 'pb6', name: 'Identity Verification & Dispute' }, { id: 'pb7', name: 'Payment Tracing & Verification' }, { id: 'pb8', name: 'Future Payment Commitment' }, { id: 'pb9', name: 'Third-Party Authorization Protocol' }, { id: 'pb10', name: 'Bankruptcy Cease Communication' }, { id: 'pb11', name: 'Small Partial Payment Acceptance' }, { id: 'pb12', name: 'Spousal/Partner Deferral' }, { id: 'pb13', name: 'Complex Financial Situation Probe' }, { id: 'pb14', name: 'Request for Mailed Documents' }, { id: 'pb15', name: 'Minor at Incurrence Validation' }, { id: 'pb16', name: 'Original Creditor Resolution Claim' }, { id: 'pb17', name: 'Failure to Provide Service/Product' }, { id: 'pb18', name: 'Prior Settlement Claim Verification' }, { id: 'pb19', name: 'Legal Representation Protocol' }, { id: 'pb20', name: 'Judgment-Proof Claim Handling' }, { id: 'pb21', name: 'FDCPA Rights Invocation' }, { id: 'pb22', name: 'Harassment Claim De-escalation' }, { id: 'pb23', name: 'Medical Emergency Pause Protocol' }, { id: 'pb24', name: 'Hostile Debtor De-escalation' }, { id: 'pb25', name: 'Emotional Distress Protocol' }, { id: 'pb26', name: 'Immediate Hang-Up Follow-up Cadence' }, { id: 'pb27', name: 'Licensing & Compliance Verification' }, { id: 'pb28', name: 'Credit Bureau Dispute Protocol' }, { id: 'pb29', name: 'Identity Theft & Fraud Claim' }, { id: 'pb30', name: 'Statute of Limitations Defense' },
];

const mockAiObjectionSuggestions: AiObjectionSuggestion[] = [
    { id: 'sug1', title: 'Request for Written Communication', summary: 'Debtors are increasingly asking for all communication to be in writing. This may be a tactic learned from online forums.', keywords: ['in writing', 'email only', 'mail me'], detectionCount: 15, firstDetected: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'sug2', title: '"Pay for Delete" Inquiry', summary: 'Debtors are asking if payment will result in deletion of the trade line from their credit report. This requires a specific, compliant response.', keywords: ['pay for delete', 'remove from credit', 'delete this'], detectionCount: 8, firstDetected: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];


interface ObjectionLibraryProps {
    objections: Objection[];
    setObjections: React.Dispatch<React.SetStateAction<Objection[]>>;
}

const ObjectionCategory: React.FC<{ category: string, objections: Objection[], isExpanded: boolean, onToggle: () => void, onEdit: (obj: Objection) => void, onDelete: (id: string) => void }> = ({ category, objections, isExpanded, onToggle, onEdit, onDelete }) => (
    <div className="bg-slate-50 dark:bg-brand-secondary/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4">
            <h4 className="font-semibold text-slate-800 dark:text-white">{category}</h4>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">{objections.length} objections</span>
                <Icon name="chevron-down" className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
        </button>
        {isExpanded && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-3">
                {objections.map(obj => (
                    <div key={obj.id} className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{obj.name}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {obj.keywords.map(kw => <span key={kw} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full">{kw}</span>)}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => onEdit(obj)} className="p-1.5 text-slate-500 hover:text-brand-accent"><Icon name="settings" className="h-4 w-4"/></button>
                                <button onClick={() => onDelete(obj.id)} className="p-1.5 text-slate-500 hover:text-brand-danger"><Icon name="trash" className="h-4 w-4"/></button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm flex items-center gap-2 text-sky-600 dark:text-sky-400">
                            <Icon name="drip" className="h-4 w-4"/>
                            <span>Response Playbook: {obj.linkedPlaybookName}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const SuggestionCard: React.FC<{ suggestion: AiObjectionSuggestion, onCreate: (sug: AiObjectionSuggestion) => void }> = ({ suggestion, onCreate }) => (
    <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-lg text-slate-900 dark:text-white">{suggestion.title}</h4>
            <span className="text-sm text-slate-500 dark:text-slate-400">Detected {suggestion.detectionCount} times</span>
        </div>
        <p className="text-xs text-slate-400">First seen: {new Date(suggestion.firstDetected).toLocaleDateString()}</p>
        <p className="text-sm my-2 text-slate-600 dark:text-slate-300">{suggestion.summary}</p>
        <div className="flex flex-wrap gap-1 mt-1">
            {suggestion.keywords.map(kw => <span key={kw} className="text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 px-1.5 py-0.5 rounded-full">{kw}</span>)}
        </div>
        <div className="mt-4 text-right">
            <button onClick={() => onCreate(suggestion)} className="flex items-center gap-2 ml-auto bg-brand-accent text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-sky-500">
                <Icon name="plus-square" className="h-4 w-4"/>
                Create Objection from Suggestion
            </button>
        </div>
    </div>
);

const ObjectionLibrary: React.FC<ObjectionLibraryProps> = ({ objections, setObjections }) => {
    const [activeTab, setActiveTab] = useState<'defined' | 'suggestions'>('defined');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([objectionCategories[0]]);
    const [editingObjection, setEditingObjection] = useState<Objection | null>(null);

    const defaultFormState: Omit<Objection, 'id' | 'linkedPlaybookName' | 'keywords'> & { keywords: string } = {
        name: '',
        category: objectionCategories[0],
        keywords: '',
        linkedPlaybookId: mockPlaybooks[0].id,
    };
    
    const [formData, setFormData] = useState(defaultFormState);
    
    useEffect(() => {
        if (editingObjection) {
            setFormData({
                ...editingObjection,
                keywords: editingObjection.keywords.join(', '),
            });
        } else {
            setFormData(defaultFormState);
        }
    }, [editingObjection]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCreateFromSuggestion = (suggestion: AiObjectionSuggestion) => {
        setFormData({
            name: suggestion.title,
            keywords: suggestion.keywords.join(', '),
            category: objectionCategories[0],
            linkedPlaybookId: mockPlaybooks[0].id,
        });
        setEditingObjection(null);
        setActiveTab('defined');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const playbook = mockPlaybooks.find(p => p.id === formData.linkedPlaybookId);
        if (!playbook) return;

        const { keywords, ...restOfFormData } = formData;
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);

        const dataToSave: Omit<Objection, 'id'> = {
            ...restOfFormData,
            keywords: keywordsArray,
            linkedPlaybookName: playbook.name,
        };
        
        let updatedObjections: Objection[];
        if (editingObjection) {
            updatedObjections = objections.map(o => o.id === editingObjection.id ? { ...dataToSave, id: editingObjection.id } as Objection : o);
        } else {
            const newObjection: Objection = { ...dataToSave, id: `obj_${Date.now()}` } as Objection;
            updatedObjections = [newObjection, ...objections];
        }
        
        setObjections(updatedObjections);
        try {
            await apiService.updateObjections(updatedObjections);
        } catch (err) {
            alert('Failed to save objections to the server.');
        }

        setEditingObjection(null);
        setFormData(defaultFormState);
    };

    const handleEdit = (objection: Objection) => {
        setEditingObjection(objection);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (objectionId: string) => {
        if (window.confirm("Are you sure you want to delete this objection?")) {
            const updatedObjections = objections.filter(o => o.id !== objectionId);
            setObjections(updatedObjections);
            try {
                await apiService.updateObjections(updatedObjections);
            } catch (err) {
                alert('Failed to delete objection on the server.');
            }

            if (editingObjection?.id === objectionId) {
                setEditingObjection(null);
            }
        }
    };
    
    const handleCancelEdit = () => {
        setEditingObjection(null);
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const objectionsByCategory = objections.reduce((acc, obj) => {
        (acc[obj.category] = acc[obj.category] || []).push(obj);
        return acc;
    }, {} as Record<string, Objection[]>);

    const inputClass = "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white";

    return (
        <div>
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                <button onClick={() => setActiveTab('defined')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'defined' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <Icon name="clipboard-list" className="h-5 w-5"/> Defined Objections
                </button>
                <button onClick={() => setActiveTab('suggestions')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'suggestions' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>
                    <Icon name="brain-circuit" className="h-5 w-5"/> AI Suggestions ({mockAiObjectionSuggestions.length})
                </button>
            </div>
            {activeTab === 'defined' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Objection Categories</h3>
                        {objectionCategories.map(category => (
                             <ObjectionCategory
                                key={category}
                                category={category}
                                objections={objectionsByCategory[category] || []}
                                isExpanded={expandedCategories.includes(category)}
                                onToggle={() => toggleCategory(category)}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                     <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-fit sticky top-24">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{editingObjection ? 'Edit Objection' : 'Create New Objection'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Objection Name</label>
                                <input id="name" name="name" type="text" value={formData.name} onChange={handleFormChange} placeholder="e.g., I already paid this" className={inputClass} required />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleFormChange} className={inputClass}>
                                    {objectionCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="keywords" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Detection Keywords</label>
                                <textarea id="keywords" name="keywords" rows={3} value={formData.keywords} onChange={handleFormChange} placeholder="e.g., already paid, paid off, settled" className={inputClass} required />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Comma-separated phrases the AI will listen for.</p>
                            </div>
                             <div>
                                <label htmlFor="linkedPlaybookId" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Response Playbook</label>
                                <select id="linkedPlaybookId" name="linkedPlaybookId" value={formData.linkedPlaybookId} onChange={handleFormChange} className={inputClass}>
                                    {mockPlaybooks.map(pb => <option key={pb.id} value={pb.id}>{pb.name}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                {editingObjection && <button type="button" onClick={handleCancelEdit} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg">Cancel</button>}
                                <button type="submit" className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg">{editingObjection ? 'Save Changes' : 'Create Objection'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
             {activeTab === 'suggestions' && (
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI-Suggested Objections</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Our AI has detected new or recurring objection patterns from your call data. Review them to improve your handling strategies.</p>
                    {mockAiObjectionSuggestions.map(sug => (
                        <SuggestionCard key={sug.id} suggestion={sug} onCreate={handleCreateFromSuggestion} />
                    ))}
                </div>
             )}
        </div>
    );
};

export default ObjectionLibrary;
