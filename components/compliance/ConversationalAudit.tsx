import React from 'react';
import { Icon } from '../Icon';
import { ConversationalAuditEntry } from '../../types';

const mockAuditData: ConversationalAuditEntry[] = [
    {
        id: 'aud1',
        callId: 'cr3',
        debtorName: 'Peter Jones',
        agentName: 'Zephyr',
        timestamp: '2024-07-31T18:45:00Z',
        riskType: 'Emotional Escalation',
        riskScore: 85,
        summary: 'Call sentiment started neutral but rapidly declined to highly negative after the first payment request. The agent maintained a calm tone, but the sharp sentiment shift poses a potential UDAAP risk.',
        flaggedTranscriptSnippet: "...I understand your frustration, but the balance remains... (Debtor: This is harassment! I'm done!)",
        sentimentTrend: [0.5, 0.4, 0.1, 0.0]
    },
    {
        id: 'aud2',
        callId: 'cr_x1',
        debtorName: 'Sarah P.',
        agentName: 'Kore',
        timestamp: '2024-08-01T10:15:00Z',
        riskType: 'Pressure Tactics',
        riskScore: 72,
        summary: "The phrase 'credit report' was mentioned 4 times within a 90-second window. While not explicitly threatening, this frequency could be interpreted as a pressure tactic.",
        flaggedTranscriptSnippet: "...this will be noted on your credit report. It is important for your credit report that we resolve this...",
        sentimentTrend: [0.6, 0.5, 0.4, 0.4]
    },
    {
        id: 'aud3',
        callId: 'cr_y2',
        debtorName: 'David C.',
        agentName: 'Zephyr',
        timestamp: '2024-08-02T11:30:00Z',
        riskType: 'Potential Confusion',
        riskScore: 65,
        summary: "Debtor stated 'I don't understand' or 'I'm confused' multiple times regarding the settlement offer terms. The agent re-explained, but the repetition suggests the offer's complexity may pose a clarity risk.",
        flaggedTranscriptSnippet: "Debtor: I don't understand the percentage. Agent: It's a 40% discount... Debtor: I'm still confused about the total.",
        sentimentTrend: [0.7, 0.6, 0.5, 0.4]
    },
];

const SentimentTrendChart: React.FC<{ trend: number[] }> = ({ trend }) => {
    if (!trend || trend.length < 2) return null;

    const width = 100;
    const height = 20;
    const points = trend.map((d, i) => `${(i / (trend.length - 1)) * width},${height - (d * height)}`).join(' ');

    const color = trend[trend.length - 1] < 0.3 ? 'text-red-500' : trend[trend.length - 1] < 0.6 ? 'text-yellow-500' : 'text-green-500';

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-8 ${color}`} preserveAspectRatio="none">
            <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} />
        </svg>
    );
};

const RiskCard: React.FC<{ entry: ConversationalAuditEntry }> = ({ entry }) => {
    const riskColor = entry.riskScore > 80 ? 'border-red-500' : entry.riskScore > 60 ? 'border-yellow-500' : 'border-sky-500';

    return (
        <div className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border-l-4 ${riskColor}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{entry.riskType}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{entry.debtorName} with {entry.agentName} on {new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${riskColor.replace('border-', 'text-')}`}>{entry.riskScore}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Risk Score</p>
                </div>
            </div>
            <div className="my-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Summary:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{entry.summary}"</p>
            </div>
             <div className="my-3 p-2 bg-slate-200 dark:bg-slate-700/50 rounded">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-300">"{entry.flaggedTranscriptSnippet}"</p>
            </div>
            <div>
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Sentiment Trend:</p>
                 <SentimentTrendChart trend={entry.sentimentTrend} />
            </div>
             <div className="mt-4 text-right">
                <button className="text-sm font-semibold text-brand-accent hover:underline">Review Full Call</button>
            </div>
        </div>
    );
};


const ConversationalAudit: React.FC = () => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="user-round-search" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Conversational Compliance & Sentiment Audit</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">AI-driven analysis of conversational patterns to flag potential UDAAP risks beyond simple keywords.</p>
                </div>
            </div>
            <div className="space-y-4">
                {mockAuditData.map(entry => <RiskCard key={entry.id} entry={entry} />)}
            </div>
        </div>
    );
};

export default ConversationalAudit;