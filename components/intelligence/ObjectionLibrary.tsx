import React, { useState, useEffect } from 'react';
import { Objection, AiObjectionSuggestion } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';

const objectionCategories = [
    "Stalls & Financial Hardship",
    "Disputes & Questioning Validity",
    "Refusals & Legal Challenges",
    "Emotional & Evasive Responses",
    "Third-Party & Scammer Defenses"
];

const mockPlaybooks = [
    { id: 'pb1', name: 'Hardship Payment Plan' },
    { id: 'pb2', name: 'Debt Validation Script' },
    { id: 'pb3', name: 'Cease & Desist Protocol' },
    { id: 'pb4', name: 'Empathy & Reassurance' },
    { id: 'pb5', name: 'Company Legitimacy & Verification' },
    { id: 'pb6', name: 'Identity Verification & Dispute' },
    { id: 'pb7', name: 'Payment Tracing & Verification' },
    { id: 'pb8', name: 'Future Payment Commitment' },
    { id: 'pb9', name: 'Third-Party Authorization Protocol' },
    { id: 'pb10', name: 'Bankruptcy Cease Communication' },
    // New Playbooks
    { id: 'pb11', name: 'Small Partial Payment Acceptance' },
    { id: 'pb12', name: 'Spousal/Partner Deferral' },
    { id: 'pb13', name: 'Complex Financial Situation Probe' },
    { id: 'pb14', name: 'Request for Mailed Documents' },
    { id: 'pb15', name: 'Minor at Incurrence Validation' },
    { id: 'pb16', name: 'Original Creditor Resolution Claim' },
    { id: 'pb17', name: 'Failure to Provide Service/Product' },
    { id: 'pb18', name: 'Prior Settlement Claim Verification' },
    { id: 'pb19', name: 'Legal Representation Protocol' },
    { id: 'pb20', name: 'Judgment-Proof Claim Handling' },
    { id: 'pb21', name: 'FDCPA Rights Invocation' },
    { id: 'pb22', name: 'Harassment Claim De-escalation' },
    { id: 'pb23', name: 'Medical Emergency Pause Protocol' },
    { id: 'pb24', name: 'Hostile Debtor De-escalation' },
    { id: 'pb25', name: 'Emotional Distress Protocol' },
    { id: 'pb26', name: 'Immediate Hang-Up Follow-up Cadence' },
    { id: 'pb27', name: 'Licensing & Compliance Verification' },
    { id: 'pb28', name: 'Credit Bureau Dispute Protocol' },
    { id: 'pb29', name: 'Identity Theft & Fraud Claim' },
    { id: 'pb30', name: 'Statute of Limitations Defense' },
];

const initialObjections: Objection[] = [
    // Stalls & Financial Hardship
    { id: 'obj1', name: "I can't afford to pay right now.", category: "Stalls & Financial Hardship", keywords: ["can't afford", "no money", "lost my job"], linkedPlaybookId: 'pb1', linkedPlaybookName: 'Hardship Payment Plan', successRate: 15.2, avgSentimentShift: 0.8, avgCallDuration: 125 },
    { id: 'obj8', name: "I will pay later (e.g., next paycheck).", category: "Stalls & Financial Hardship", keywords: ["when I get paid", "next week", "tax refund", "later"], linkedPlaybookId: 'pb8', linkedPlaybookName: 'Future Payment Commitment', successRate: 35.7, avgSentimentShift: 0.2, avgCallDuration: 92 },
    { id: 'obj11', name: "I can only pay a small amount.", category: "Stalls & Financial Hardship", keywords: ["can only pay", "small amount", "that's all I have", "partial payment"], linkedPlaybookId: 'pb11', linkedPlaybookName: 'Small Partial Payment Acceptance', successRate: 25.1, avgSentimentShift: 0.5, avgCallDuration: 110 },
    { id: 'obj12', name: "I need to talk to my spouse/partner.", category: "Stalls & Financial Hardship", keywords: ["talk to my wife", "ask my husband", "partner", "spouse", "discuss it"], linkedPlaybookId: 'pb12', linkedPlaybookName: 'Spousal/Partner Deferral', successRate: 18.9, avgSentimentShift: 0.1, avgCallDuration: 85 },
    { id: 'obj13', name: "My financial situation is complicated.", category: "Stalls & Financial Hardship", keywords: ["complicated", "it's a long story", "you wouldn't understand", "personal finances"], linkedPlaybookId: 'pb13', linkedPlaybookName: 'Complex Financial Situation Probe', successRate: 10.5, avgSentimentShift: 0.9, avgCallDuration: 140 },
    { id: 'obj14', name: "Send me something in the mail.", category: "Stalls & Financial Hardship", keywords: ["mail me", "send it in writing", "paper copy", "letter"], linkedPlaybookId: 'pb14', linkedPlaybookName: 'Request for Mailed Documents', successRate: 40.3, avgSentimentShift: 0.0, avgCallDuration: 75 },
    
    // Disputes & Questioning Validity
    { id: 'obj2', name: "I don't believe I owe this debt.", category: "Disputes & Questioning Validity", keywords: ["not my debt", "don't owe", "proof"], linkedPlaybookId: 'pb2', linkedPlaybookName: 'Debt Validation Script', successRate: 8.4, avgSentimentShift: -0.5, avgCallDuration: 165 },
    { id: 'obj6', name: "This isn't my debt / You have the wrong person.", category: "Disputes & Questioning Validity", keywords: ["wrong person", "not me", "mistake"], linkedPlaybookId: 'pb6', linkedPlaybookName: 'Identity Verification & Dispute', successRate: 2.1, avgSentimentShift: -0.2, avgCallDuration: 65 },
    { id: 'obj7', name: "I already paid this debt.", category: "Disputes & Questioning Validity", keywords: ["already paid", "paid off", "settled", "payment sent"], linkedPlaybookId: 'pb7', linkedPlaybookName: 'Payment Tracing & Verification', successRate: 5.1, avgSentimentShift: -1.2, avgCallDuration: 180, challengerPlaybookId: 'pb2', challengerPlaybookName: 'Debt Validation Script' },
    { id: 'obj15', name: "I was a minor when this debt was incurred.", category: "Disputes & Questioning Validity", keywords: ["was a minor", "under 18", "was a kid", "not of age"], linkedPlaybookId: 'pb15', linkedPlaybookName: 'Minor at Incurrence Validation', successRate: 1.5, avgSentimentShift: -0.8, avgCallDuration: 95 },
    { id: 'obj16', name: "The original creditor told me this was resolved.", category: "Disputes & Questioning Validity", keywords: ["they said it was fine", "original creditor resolved", "was taken care of", "wrote it off"], linkedPlaybookId: 'pb16', linkedPlaybookName: 'Original Creditor Resolution Claim', successRate: 7.8, avgSentimentShift: -0.4, avgCallDuration: 130 },
    { id: 'obj17', name: "I never received the product/service.", category: "Disputes & Questioning Validity", keywords: ["never got it", "didn't receive", "service not rendered", "product was returned"], linkedPlaybookId: 'pb17', linkedPlaybookName: 'Failure to Provide Service/Product', successRate: 4.3, avgSentimentShift: -0.9, avgCallDuration: 155 },
    { id: 'obj18', name: "This account was included in a previous settlement.", category: "Disputes & Questioning Validity", keywords: ["previous settlement", "already settled", "part of a deal", "paid them"], linkedPlaybookId: 'pb18', linkedPlaybookName: 'Prior Settlement Claim Verification', successRate: 6.2, avgSentimentShift: -1.0, avgCallDuration: 170 },

    // Refusals & Legal Challenges
    { id: 'obj3', name: "Stop calling me.", category: "Refusals & Legal Challenges", keywords: ["stop calling", "don't contact", "harassment"], linkedPlaybookId: 'pb3', linkedPlaybookName: 'Cease & Desist Protocol', successRate: 0.1, avgSentimentShift: -2.5, avgCallDuration: 35 },
    { id: 'obj10', name: "I am filing for bankruptcy.", category: "Refusals & Legal Challenges", keywords: ["bankruptcy", "filing", "attorney"], linkedPlaybookId: 'pb10', linkedPlaybookName: 'Bankruptcy Cease Communication', successRate: 0.0, avgSentimentShift: -1.5, avgCallDuration: 45 },
    { id: 'obj19', name: "My lawyer told me not to talk to you.", category: "Refusals & Legal Challenges", keywords: ["lawyer said", "attorney advised", "legal counsel", "not to speak"], linkedPlaybookId: 'pb19', linkedPlaybookName: 'Legal Representation Protocol', successRate: 0.2, avgSentimentShift: -1.8, avgCallDuration: 50 },
    { id: 'obj20', name: "I am judgment-proof.", category: "Refusals & Legal Challenges", keywords: ["judgment proof", "can't collect", "social security", "no assets", "unemployed"], linkedPlaybookId: 'pb20', linkedPlaybookName: 'Judgment-Proof Claim Handling', successRate: 3.3, avgSentimentShift: -0.3, avgCallDuration: 115 },
    { id: 'obj21', name: "I am invoking my rights under the FDCPA.", category: "Refusals & Legal Challenges", keywords: ["FDCPA", "my rights", "fair debt", "violation"], linkedPlaybookId: 'pb21', linkedPlaybookName: 'FDCPA Rights Invocation', successRate: 0.5, avgSentimentShift: -2.0, avgCallDuration: 60 },
    { id: 'obj22', name: "This is harassment.", category: "Refusals & Legal Challenges", keywords: ["harassing me", "too many calls", "stop harassing", "report you"], linkedPlaybookId: 'pb22', linkedPlaybookName: 'Harassment Claim De-escalation', successRate: 2.8, avgSentimentShift: 1.5, avgCallDuration: 120 },
    
    // Emotional & Evasive Responses
    { id: 'obj4', name: "I'm going through a lot right now.", category: "Emotional & Evasive Responses", keywords: ["stress", "overwhelmed", "personal issues"], linkedPlaybookId: 'pb4', linkedPlaybookName: 'Empathy & Reassurance', successRate: 22.4, avgSentimentShift: 1.8, avgCallDuration: 150 },
    { id: 'obj23', name: "I am dealing with a medical emergency.", category: "Emotional & Evasive Responses", keywords: ["medical emergency", "in the hospital", "sick", "health issues"], linkedPlaybookId: 'pb23', linkedPlaybookName: 'Medical Emergency Pause Protocol', successRate: 12.0, avgSentimentShift: 2.1, avgCallDuration: 80 },
    { id: 'obj24', name: "[Debtor is angry/yelling]", category: "Emotional & Evasive Responses", keywords: ["[unintelligible yelling]", "swearing", "profanity", "angry tone"], linkedPlaybookId: 'pb24', linkedPlaybookName: 'Hostile Debtor De-escalation', successRate: 19.5, avgSentimentShift: 2.5, avgCallDuration: 135 },
    { id: 'obj25', name: "This is causing me too much stress.", category: "Emotional & Evasive Responses", keywords: ["anxiety", "stressing me out", "mental health", "can't handle this"], linkedPlaybookId: 'pb25', linkedPlaybookName: 'Emotional Distress Protocol', successRate: 15.8, avgSentimentShift: 1.9, avgCallDuration: 110 },
    { id: 'obj26', name: "[Debtor hangs up immediately]", category: "Emotional & Evasive Responses", keywords: ["[hangs up]", "click", "call dropped", "disconnected"], linkedPlaybookId: 'pb26', linkedPlaybookName: 'Immediate Hang-Up Follow-up Cadence', successRate: 4.5, avgSentimentShift: -0.1, avgCallDuration: 15 },
    
    // Third-Party & Scammer Defenses
    { id: 'obj5', name: "How do I know you're a legitimate company?", category: "Third-Party & Scammer Defenses", keywords: ["scam", "legitimate", "prove it", "how do i know"], linkedPlaybookId: 'pb5', linkedPlaybookName: 'Company Legitimacy & Verification', successRate: 55.6, avgSentimentShift: 0.7, avgCallDuration: 105 },
    { id: 'obj9', name: "I'm working with a debt management company.", category: "Third-Party & Scammer Defenses", keywords: ["debt consolidation", "credit counseling", "debt relief", "my lawyer told me"], linkedPlaybookId: 'pb9', linkedPlaybookName: 'Third-Party Authorization Protocol', successRate: 9.8, avgSentimentShift: 0.3, avgCallDuration: 90 },
    { id: 'obj27', name: "What is your license number?", category: "Third-Party & Scammer Defenses", keywords: ["license number", "licensed to collect", "state license", "are you licensed"], linkedPlaybookId: 'pb27', linkedPlaybookName: 'Licensing & Compliance Verification', successRate: 60.1, avgSentimentShift: 0.5, avgCallDuration: 85 },
    { id: 'obj28', name: "I'm disputing this with the credit bureaus.", category: "Third-Party & Scammer Defenses", keywords: ["disputing with", "credit bureau", "Experian", "TransUnion", "Equifax", "credit report"], linkedPlaybookId: 'pb28', linkedPlaybookName: 'Credit Bureau Dispute Protocol', successRate: 11.2, avgSentimentShift: -0.6, avgCallDuration: 120 },
    { id: 'obj29', name: "My identity was stolen.", category: "Third-Party & Scammer Defenses", keywords: ["identity theft", "fraud", "not me", "someone stole my identity"], linkedPlaybookId: 'pb29', linkedPlaybookName: 'Identity Theft & Fraud Claim', successRate: 2.5, avgSentimentShift: -0.9, avgCallDuration: 145 },
    { id: 'obj30', name: "You are violating the statute of limitations.", category: "Third-Party & Scammer Defenses", keywords: ["statute of limitations", "time-barred", "too old to collect", "out of statute"], linkedPlaybookId: 'pb30', linkedPlaybookName: 'Statute of Limitations Defense', successRate: 1.2, avgSentimentShift: -1.7, avgCallDuration: 70 },
];

const mockAiSuggestions: AiObjectionSuggestion[] = [
    { 
        id: 'sug1', 
        title: 'Statute of Limitations Mention',
        summary: 'Debtors are mentioning the age of the debt, possibly questioning its legal collectibility.',
        keywords: ['too old', 'statute of limitations', 'time-barred'],
        detectionCount: 112,
        firstDetected: new Date(Date.now() - 7 * 86400000).toISOString(),
        detectionHistory: [
            { date: '7d ago', count: 5 }, { date: '6d ago', count: 8 }, { date: '5d ago', count: 7 }, 
            { date: '4d ago', count: 12 }, { date: '3d ago', count: 15 }, { date: '2d ago', count: 22 }, 
            { date: '1d ago', count: 28 }, { date: 'today', count: 15}
        ]
    },
    { 
        id: 'sug2', 
        title: 'Identity Theft Claim',
        summary: 'An increasing number of debtors are claiming the debt is fraudulent due to identity theft.',
        keywords: ['not me', 'identity stolen', 'victim of fraud', 'this is fraud'],
        detectionCount: 42,
        firstDetected: new Date(Date.now() - 5 * 86400000).toISOString(),
        detectionHistory: [
            { date: '7d ago', count: 2 }, { date: '6d ago', count: 3 }, { date: '5d ago', count: 5 }, 
            { date: '4d ago', count: 8 }, { date: '3d ago', count: 7 }, { date: '2d ago', count: 9 }, 
            { date: '1d ago', count: 6 }, { date: 'today', count: 2}
        ]
    },
    { 
        id: 'sug3', 
        title: 'Call Recording Notification',
        summary: 'Debtors are proactively stating they are recording the call, indicating higher consumer awareness.',
        keywords: ['recording this call', 'am I being recorded', 'this is being recorded'],
        detectionCount: 19,
        firstDetected: new Date(Date.now() - 2 * 86400000).toISOString(),
        detectionHistory: [
            { date: '7d ago', count: 0 }, { date: '6d ago', count: 1 }, { date: '5d ago', count: 1 }, 
            { date: '4d ago', count: 2 }, { date: '3d ago', count: 4 }, { date: '2d ago', count: 5 }, 
            { date: '1d ago', count: 3 }, { date: 'today', count: 3}
        ]
    }
];

interface SemanticMergeSuggestion {
    id: string;
    objectionIds: string[];
    objectionNames: string[];
    similarityScore: number;
    reasoning: string;
}

const mockMergeSuggestions: SemanticMergeSuggestion[] = [
    {
        id: 'merge1',
        objectionIds: ['obj7', 'obj18'],
        objectionNames: ["I already paid this debt.", "This account was included in a previous settlement."],
        similarityScore: 0.95,
        reasoning: "These objections are 95% semantically similar and often use overlapping keywords like 'paid', 'settled', 'already'. Merging them would streamline playbook responses."
    }
];

const TrendChart: React.FC<{ data: { date: string; count: number }[] }> = ({ data }) => {
    if (!data || data.length < 2) return <div className="h-20 flex items-center justify-center text-xs text-slate-400">Not enough data for trend.</div>;

    const width = 200;
    const height = 50;
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.count / maxCount) * height}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 mt-2" preserveAspectRatio="none">
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline fill="url(#gradient)" stroke="currentColor" strokeWidth="2" points={`0,${height} ${points} ${width},${height}`} />
        </svg>
    );
};


const SuggestionCard: React.FC<{ suggestion: AiObjectionSuggestion, onCreate: (suggestion: AiObjectionSuggestion) => void }> = ({ suggestion, onCreate }) => (
    <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{suggestion.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">First detected: {new Date(suggestion.firstDetected).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-sky-600 dark:text-brand-accent">{suggestion.detectionCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Detections</p>
            </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 my-3">{suggestion.summary}</p>
        <div className="text-sky-600 dark:text-brand-accent">
            <TrendChart data={suggestion.detectionHistory || []} />
        </div>
        <div className="mb-4 mt-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Detected Keywords:</p>
            <div className="flex flex-wrap gap-2">
                {suggestion.keywords.map(kw => (
                    <span key={kw} className="bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 text-xs font-medium px-2 py-1 rounded-full">{kw}</span>
                ))}
            </div>
        </div>
        <button 
            onClick={() => onCreate(suggestion)}
            className="mt-auto w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
            <Icon name="plus-square" className="h-5 w-5"/>
            Create Objection
        </button>
    </div>
);

const MergeSuggestionCard: React.FC<{ suggestion: SemanticMergeSuggestion }> = ({ suggestion }) => (
    <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Merge Suggestion</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {suggestion.objectionNames.map(name => <span key={name} className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 text-xs font-medium px-2 py-1 rounded-full">{name}</span>)}
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-sky-600 dark:text-brand-accent">{(suggestion.similarityScore * 100).toFixed(0)}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Similarity</p>
            </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 my-3 italic">"{suggestion.reasoning}"</p>
        <div className="flex justify-end gap-2">
            <button className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-1.5 px-3 rounded-lg text-sm">Dismiss</button>
            <button className="bg-brand-accent text-white font-semibold py-1.5 px-3 rounded-lg text-sm">Review & Merge</button>
        </div>
    </div>
);


const ObjectionCategory: React.FC<{
    category: string;
    objections: Objection[];
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: (objection: Objection) => void;
    onDelete: (objectionId: string) => void;
}> = ({ category, objections, isExpanded, onToggle, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{category}</h4>
            <Icon name="chevron-down" className={`h-6 w-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} />
        </button>
        {isExpanded && (
            <div className="p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                        <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Objection Name</th>
                                <th scope="col" className="px-4 py-3">Linked Playbook</th>
                                <th scope="col" className="px-4 py-3 text-center">Success Rate</th>
                                <th scope="col" className="px-4 py-3 text-center">Sentiment Shift</th>
                                <th scope="col" className="px-4 py-3 text-center">Avg. Duration</th>
                                <th scope="col" className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objections.map(obj => {
                                const sentimentColor = obj.avgSentimentShift && obj.avgSentimentShift > 0 ? 'text-green-500' : obj.avgSentimentShift && obj.avgSentimentShift < 0 ? 'text-red-500' : 'text-slate-500';
                                return (
                                <tr key={obj.id} className="border-b border-slate-200 dark:border-slate-700/50 last:border-0">
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{obj.name}</td>
                                    <td className="px-4 py-3 text-sky-600 dark:text-brand-accent">{obj.linkedPlaybookName}</td>
                                    <td className="px-4 py-3 text-center font-bold text-green-600 dark:text-green-400">{obj.successRate?.toFixed(1)}%</td>
                                    <td className={`px-4 py-3 text-center font-bold ${sentimentColor}`}>{obj.avgSentimentShift?.toFixed(1)}</td>
                                    <td className="px-4 py-3 text-center">{obj.avgCallDuration}s</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Tooltip content="Simulate Playbook"><button className="p-1 text-slate-500 hover:text-green-500"><Icon name="beaker" className="h-4 w-4" /></button></Tooltip>
                                            <Tooltip content="A/B Test Playbook"><button className="p-1 text-slate-500 hover:text-yellow-500"><Icon name="refresh" className="h-4 w-4" /></button></Tooltip>
                                            <Tooltip content="Edit Objection"><button onClick={() => onEdit(obj)} className="p-1 text-slate-500 hover:text-brand-accent"><Icon name="settings" className="h-4 w-4" /></button></Tooltip>
                                            <Tooltip content="Delete Objection"><button onClick={() => onDelete(obj.id)} className="p-1 text-slate-500 hover:text-brand-danger"><Icon name="trash" className="h-4 w-4" /></button></Tooltip>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);

const ObjectionLibrary: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'defined' | 'suggestions'>('defined');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([objectionCategories[0]]);
    const [objections, setObjections] = useState<Objection[]>(initialObjections);
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
        setEditingObjection(null); // Ensure we are in "create" mode
        setActiveTab('defined');
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const playbook = mockPlaybooks.find(p => p.id === formData.linkedPlaybookId);
        if (!playbook) return;

        // FIX: The 'keywords' property in `formData` is a string for the form input, but the `Objection` type
        // expects a string array. This was causing a type conflict when spreading `formData`. The fix is to
        // destructure `formData` to separate the string `keywords` before spreading the rest, then
        // reassembling the object with the correctly typed array.
        const { keywords, ...restOfFormData } = formData;
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);

        const dataToSave: Omit<Objection, 'id'> = {
            ...restOfFormData,
            keywords: keywordsArray,
            linkedPlaybookName: playbook.name,
        };
        
        if (editingObjection) {
            setObjections(prev => prev.map(o => o.id === editingObjection.id ? { ...dataToSave, id: editingObjection.id } as Objection : o));
        } else {
            const newObjection: Objection = { ...dataToSave, id: `obj_${Date.now()}` } as Objection;
            setObjections(prev => [newObjection, ...prev]);
        }
        setEditingObjection(null);
    };

    const handleEdit = (objection: Objection) => {
        setEditingObjection(objection);
    };

    const handleDelete = (objectionId: string) => {
        if (window.confirm("Are you sure you want to delete this objection?")) {
            setObjections(prev => prev.filter(o => o.id !== objectionId));
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

    return (
        <div>
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                 <button
                    onClick={() => setActiveTab('defined')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'defined'
                            ? 'border-brand-accent text-brand-accent'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    <Icon name="shield-check" className="h-5 w-5" />
                    Defined Objections
                </button>
                 <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'suggestions'
                            ? 'border-brand-accent text-brand-accent'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    <Icon name="brain-circuit" className="h-5 w-5" />
                    AI Suggestions
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
                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-fit">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{editingObjection ? 'Edit Objection' : 'Add New Objection'}</h3>
                        <form className="space-y-4" onSubmit={handleSave}>
                            {!editingObjection && (
                                <button type="button" className="w-full flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-500/30 transition-colors">
                                    <Icon name="award" className="h-5 w-5"/>
                                    Suggest Playbook from Golden Scripts
                                </button>
                            )}
                            <div>
                                <label htmlFor="objection-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Objection Name</label>
                                <input type="text" id="objection-name" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g., I can't pay right now" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleFormChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white">
                                    {objectionCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="keywords" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Keywords (comma-separated)</label>
                                <input type="text" id="keywords" name="keywords" value={formData.keywords} onChange={handleFormChange} placeholder="can't pay, no money" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="playbook-link" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Link to Playbook</label>
                                <select id="playbook-link" name="linkedPlaybookId" value={formData.linkedPlaybookId} onChange={handleFormChange} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white">
                                    {mockPlaybooks.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                {editingObjection && (
                                    <button type="button" onClick={handleCancelEdit} className="w-full bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                                    <Icon name="check" className="h-5 w-5" />
                                    {editingObjection ? 'Update Objection' : 'Save Objection'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {activeTab === 'suggestions' && (
                <div>
                     <div className="flex items-center gap-3 mb-4">
                        <Icon name="beaker" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI-Powered Objection Discovery</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Our AI has identified the following patterns from call transcripts that may represent new objections.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockAiSuggestions.map(suggestion => (
                            <SuggestionCard key={suggestion.id} suggestion={suggestion} onCreate={handleCreateFromSuggestion} />
                        ))}
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon name="copy" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Semantic Merge Suggestions</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Our AI has identified redundant objections that could be merged for better consistency.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {mockMergeSuggestions.map(suggestion => (
                                <MergeSuggestionCard key={suggestion.id} suggestion={suggestion} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ObjectionLibrary;