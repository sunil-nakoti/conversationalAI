import React from 'react';
import { Icon } from '../Icon';
import { ConversationalAuditEntry } from '../../types';

interface ConversationalAuditProps {
    auditData: ConversationalAuditEntry[];
}

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


const ConversationalAudit: React.FC<ConversationalAuditProps> = ({ auditData }) => {
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
                {auditData.map(entry => <RiskCard key={entry.id} entry={entry} />)}
            </div>
        </div>
    );
};

export default ConversationalAudit;
