import React, { useState } from 'react';
import { CallReport } from '../../types';
import { Icon } from '../Icon';

const mockCallReportsData: CallReport[] = [
    {
        id: 'cr1',
        debtorName: 'Jane Doe',
        agentName: 'Zephyr',
        timestamp: '2024-08-01T14:22:00Z',
        outcome: 'PTP Secured',
        duration: 185,
        audioUrl: 'https://example.com/call1.mp3', // Placeholder
        transcript: [
            { speaker: 'AI', text: 'Hello, I am calling from a collection agency...', timestamp: 2 },
            { speaker: 'Debtor', text: 'Oh, right. I was expecting this call.', timestamp: 8 },
            { speaker: 'AI', text: 'We are calling about your outstanding balance of $875. Are you in a position to clear this today?', timestamp: 12 },
            { speaker: 'Debtor', text: "I can't pay it all right now, but I can make a payment.", timestamp: 25 },
            { speaker: 'AI', text: "I understand. We can set up a payment plan. How does two payments of $437.50 sound?", timestamp: 35 },
            { speaker: 'Debtor', text: 'Yes, that works for me. Thank you.', timestamp: 48 },
        ],
        aiSupervisorScore: 95,
        aiSupervisorNotes: "Excellent sentiment control and successful negotiation to a payment plan. Mini-Miranda was clear. No compliance issues detected.",
        humanFeedback: 'good'
    },
    {
        id: 'cr2',
        debtorName: 'John Smith',
        agentName: 'Kore',
        timestamp: '2024-08-01T11:05:00Z',
        outcome: 'Call Failed - Wrong Number',
        duration: 45,
        audioUrl: 'https://example.com/call2.mp3',
        transcript: [
            { speaker: 'AI', text: 'Hello, may I speak with John Smith?', timestamp: 3 },
            { speaker: 'Debtor', text: 'There is no one here by that name.', timestamp: 9 },
            { speaker: 'AI', text: 'I apologize. I must have the wrong number. I will update our records.', timestamp: 15 },
        ],
        aiSupervisorScore: 99,
        aiSupervisorNotes: "Correctly identified a wrong number and terminated the call appropriately. Professional and efficient.",
        humanFeedback: null
    },
     {
        id: 'cr3',
        debtorName: 'Peter Jones',
        agentName: 'Zephyr',
        timestamp: '2024-07-31T18:45:00Z',
        outcome: 'Refused to Pay',
        duration: 121,
        audioUrl: 'https://example.com/call3.mp3',
        transcript: [
            { speaker: 'AI', text: 'Hello, I am calling regarding your account...', timestamp: 5 },
            { speaker: 'Debtor', text: "I'm not paying this. This is ridiculous.", timestamp: 11 },
             { speaker: 'AI', text: "I understand your frustration, but the balance remains outstanding. Perhaps we can find a solution that works for you.", timestamp: 18 },
        ],
        aiSupervisorScore: 78,
        aiSupervisorNotes: "Agent maintained a calm and empathetic tone despite debtor frustration. Failed to secure PTP, but successfully de-escalated the conversation.",
        humanFeedback: null
    },
];

const TranscriptItem: React.FC<{ entry: CallReport['transcript'][0] }> = ({ entry }) => {
    const isAI = entry.speaker === 'AI';
    const formatTime = (seconds: number) => new Date(seconds * 1000).toISOString().substr(14, 5);
    return (
        <div className={`flex gap-3 ${isAI ? '' : 'justify-end'}`}>
            <div className={`max-w-md p-3 rounded-lg ${isAI ? 'bg-slate-200 dark:bg-slate-700' : 'bg-sky-500 dark:bg-brand-accent/80'}`}>
                <p className={`text-sm ${isAI ? 'text-slate-800 dark:text-white' : 'text-white'}`}>{entry.text}</p>
                <p className={`text-xs mt-1 ${isAI ? 'text-slate-500 dark:text-slate-400' : 'text-sky-100'}`}>{formatTime(entry.timestamp)}</p>
            </div>
        </div>
    );
};

interface ReportDetailProps {
    report: CallReport;
    onSetFeedback: (feedback: 'good' | 'bad' | null) => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onSetFeedback }) => {
    const scoreColor = report.aiSupervisorScore && report.aiSupervisorScore >= 85 ? 'text-green-500' : report.aiSupervisorScore && report.aiSupervisorScore >= 70 ? 'text-yellow-500' : 'text-red-500';

    return (
        <td colSpan={7} className="p-0">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transcript */}
                <div className="lg:col-span-1 space-y-3 max-h-96 overflow-y-auto pr-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white sticky top-0 bg-slate-50 dark:bg-slate-800/50 py-1">Transcript</h4>
                    {report.transcript.map((entry, index) => (
                        <TranscriptItem key={index} entry={entry} />
                    ))}
                </div>

                {/* Audio & Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Call Recording</h4>
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button className="p-2 bg-brand-accent text-white rounded-full"><Icon name="play" className="h-5 w-5"/></button>
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                            <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{Math.floor(report.duration / 60)}:{(report.duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    {report.aiSupervisorScore !== undefined && (
                        <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">AI Supervisor Analysis</h4>
                            <div className="flex items-start gap-4">
                                <div className="text-center">
                                    <p className={`text-4xl font-bold ${scoreColor}`}>{report.aiSupervisorScore}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">AI Score</p>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 border-l-2 border-slate-200 dark:border-slate-600 pl-4">{report.aiSupervisorNotes}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Provide Feedback (RLHF)</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Your feedback helps train our AI to handle calls better. Was this a good example of how an agent should perform?</p>
                        <div className="flex items-center gap-4">
                            <button onClick={() => onSetFeedback('good')} className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold border-2 transition-colors ${report.humanFeedback === 'good' ? 'bg-green-100 dark:bg-green-500/20 border-green-400 text-green-700 dark:text-green-300' : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                                <Icon name="thumbs-up" className="h-5 w-5" />
                                Good Call
                            </button>
                             <button onClick={() => onSetFeedback('bad')} className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold border-2 transition-colors ${report.humanFeedback === 'bad' ? 'bg-red-100 dark:bg-red-500/20 border-red-400 text-red-700 dark:text-red-300' : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                                <Icon name="thumbs-down" className="h-5 w-5" />
                                Bad Call
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </td>
    );
};


const CallReports: React.FC = () => {
    const [reports, setReports] = useState<CallReport[]>(mockCallReportsData);
    const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

    const handleToggleExpand = (reportId: string) => {
        setExpandedReportId(prevId => (prevId === reportId ? null : reportId));
    };

    const handleSetFeedback = (reportId: string, feedback: 'good' | 'bad' | null) => {
        setReports(prevReports =>
            prevReports.map(r =>
                r.id === reportId ? { ...r, humanFeedback: r.humanFeedback === feedback ? null : feedback } : r
            )
        );
    };

    const getScoreColor = (score: number) => {
        if (score > 85) return 'text-green-500 dark:text-green-400';
        if (score > 70) return 'text-yellow-500 dark:text-yellow-400';
        return 'text-red-500 dark:text-red-400';
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">AI Agent Interaction Log</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Debtor Name</th>
                            <th scope="col" className="px-6 py-3">Agent</th>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Outcome</th>
                            <th scope="col" className="px-6 py-3 text-center">Duration</th>
                            <th scope="col" className="px-6 py-3 text-center">AI Score</th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {reports.map(report => (
                            <React.Fragment key={report.id}>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => handleToggleExpand(report.id)}>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{report.debtorName}</td>
                                    <td className="px-6 py-4">{report.agentName}</td>
                                    <td className="px-6 py-4">{new Date(report.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4">{report.outcome}</td>
                                    <td className="px-6 py-4 text-center">{report.duration}s</td>
                                    <td className={`px-6 py-4 text-center font-bold text-lg ${report.aiSupervisorScore ? getScoreColor(report.aiSupervisorScore) : ''}`}>
                                        {report.aiSupervisorScore ?? 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Icon name="chevron-down" className={`h-5 w-5 transition-transform ${expandedReportId === report.id ? 'rotate-180' : ''}`} />
                                    </td>
                                </tr>
                                {expandedReportId === report.id && (
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <ReportDetail report={report} onSetFeedback={(feedback) => handleSetFeedback(report.id, feedback)} />
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallReports;