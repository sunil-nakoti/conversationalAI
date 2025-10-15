

import React, { useState } from 'react';
// FIX: Corrected import path for types
import { TrainingExample } from '../types';
import { Icon } from './Icon';
import TrainingUploadModal from './TrainingUploadModal';
// FIX: Imported Tooltip component to handle hover text for icons.
import Tooltip from './Tooltip';

const initialTrainingExamples: TrainingExample[] = [
    { id: 't1', title: 'Successful PTP Negotiation', type: 'good', hasAudio: true, hasTranscript: true, uploadedAt: '2024-08-02T10:00:00Z' },
    { id: 't2', 'title': 'Excellent De-escalation', type: 'good', hasAudio: true, hasTranscript: false, uploadedAt: '2024-08-01T15:30:00Z' },
    { id: 't3', 'title': 'Clear Mini-Miranda Delivery', type: 'good', hasAudio: false, hasTranscript: true, uploadedAt: '2024-07-31T11:00:00Z' },
    { id: 't4', 'title': 'Missed Compliance Keyword', type: 'bad', hasAudio: true, hasTranscript: true, uploadedAt: '2024-08-02T09:15:00Z' },
    { id: 't5', 'title': 'Incorrect Tone for Situation', type: 'bad', hasAudio: true, hasTranscript: false, uploadedAt: '2024-07-30T14:00:00Z' },
];

const TrainingExampleCard: React.FC<{ example: TrainingExample }> = ({ example }) => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
        <div>
            <p className="font-semibold text-slate-900 dark:text-white">{example.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded: {new Date(example.uploadedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
            {/* FIX: Replaced unsupported 'title' prop with Tooltip component. */}
            {example.hasAudio && <Tooltip content="Audio available"><Icon name="microphone" className="h-5 w-5 text-slate-500 dark:text-slate-300" /></Tooltip>}
            {/* FIX: Replaced unsupported 'title' prop with Tooltip component. */}
            {example.hasTranscript && <Tooltip content="Transcript available"><Icon name="reports" className="h-5 w-5 text-slate-500 dark:text-slate-300" /></Tooltip>}
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Delete">
                <Icon name="trash" className="h-5 w-5" />
            </button>
        </div>
    </div>
);

const TrainingColumn: React.FC<{ title: string; description: string; examples: TrainingExample[]; color: 'green' | 'red'; tooltip: string; }> = ({ title, description, examples, color, tooltip }) => (
    <div className={`bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border-t-4 ${color === 'green' ? 'border-brand-success' : 'border-brand-danger'}`}>
        <div className="flex items-center gap-3 mb-2">
            <Icon name={color === 'green' ? 'check' : 'warning'} className={`h-6 w-6 ${color === 'green' ? 'text-brand-success' : 'text-brand-danger'}`} />
            <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                <Tooltip content={tooltip}>
                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                </Tooltip>
            </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
        <div className="space-y-3">
            {examples.map(ex => <TrainingExampleCard key={ex.id} example={ex} />)}
        </div>
    </div>
);

const TrainingCenter: React.FC = () => {
    const [trainingExamples, setTrainingExamples] = useState<TrainingExample[]>(initialTrainingExamples);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleSaveExample = (newExampleData: Omit<TrainingExample, 'id' | 'uploadedAt'>) => {
        const newExample: TrainingExample = {
            ...newExampleData,
            id: `t${Date.now()}`,
            uploadedAt: new Date().toISOString(),
        };
        setTrainingExamples(prev => [newExample, ...prev]);
    };

    const goodExamples = trainingExamples.filter(e => e.type === 'good');
    const badExamples = trainingExamples.filter(e => e.type === 'bad');

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Agent Training Center</h2>
                    <Tooltip content="Improve agent performance through reinforcement learning. Upload examples of good and bad calls to provide a feedback loop for the AI.">
                        <Icon name="info" className="h-5 w-5 text-slate-400" />
                    </Tooltip>
                </div>
                 <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                    <Icon name="upload" className="h-5 w-5" />
                    Upload Training Example
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrainingColumn
                    title="Positive Reinforcement"
                    description="Upload successful calls as a gold standard for the AI to learn from."
                    examples={goodExamples}
                    color="green"
                    tooltip="Examples of 'Good Calls' are used to teach the AI what to do. This includes successful negotiations, compliant conversations, and effective de-escalation."
                />
                <TrainingColumn
                    title="Corrective Feedback"
                    description="Upload non-compliant or unsuccessful calls to teach the AI what to avoid."
                    examples={badExamples}
                    color="red"
                    tooltip="Examples of 'Bad Calls' are used to teach the AI what not to do. This includes compliance breaches, failed negotiations, or poor sentiment handling."
                />
            </div>

            <TrainingUploadModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSave={handleSaveExample}
            />
        </section>
    );
};

export default TrainingCenter;