import React, { useState, useEffect, useRef } from 'react';
import { TrainingExample } from '../types';
import { Icon } from './Icon';
import TrainingUploadModal from './TrainingUploadModal';
import Tooltip from './Tooltip';
import { apiService } from '../services/apiService';

const TrainingExampleCard: React.FC<{ 
    example: TrainingExample; 
    onDelete: (id: string) => void; 
    onPlayAudio: (example: TrainingExample) => void;
    isPlaying: boolean;
}> = ({ example, onDelete, onPlayAudio, isPlaying }) => (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex items-center justify-between">
        <div>
            <p className="font-semibold text-slate-900 dark:text-white">{example.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded: {new Date(example.uploadedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
            {example.hasAudio && (
                <Tooltip content={isPlaying ? 'Pause Audio' : 'Play Audio'}>
                    <button onClick={() => onPlayAudio(example)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Icon name={isPlaying ? 'pause' : 'play'} className="h-5 w-5" />
                    </button>
                </Tooltip>
            )}
            {example.hasTranscript && <Tooltip content="Transcript available"><Icon name="reports" className="h-5 w-5 text-slate-500 dark:text-slate-300" /></Tooltip>}
            <button onClick={() => onDelete(example.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Delete">
                <Icon name="trash" className="h-5 w-5" />
            </button>
        </div>
    </div>
);

const TrainingColumn: React.FC<{ 
    title: string; 
    description: string; 
    examples: TrainingExample[]; 
    color: 'green' | 'red'; 
    tooltip: string; 
    onDelete: (id: string) => void; 
    onPlayAudio: (example: TrainingExample) => void;
    playingExampleId: string | null;
}> = ({ title, description, examples, color, tooltip, onDelete, onPlayAudio, playingExampleId }) => (
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
            {examples.map(ex => <TrainingExampleCard key={ex.id} example={ex} onDelete={onDelete} onPlayAudio={onPlayAudio} isPlaying={playingExampleId === ex.id} />)}
        </div>
    </div>
);

const TrainingCenter: React.FC = () => {
    const [trainingExamples, setTrainingExamples] = useState<TrainingExample[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [playingExampleId, setPlayingExampleId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchExamples = async () => {
            try {
                setLoading(true);
                const fetchedExamples = await apiService.getTrainingExamples();
                // Add a placeholder audio URL for demonstration
                const examplesWithAudio = fetchedExamples.map(ex => ({ ...ex, audioUrl: ex.hasAudio ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : undefined }));
                setTrainingExamples(examplesWithAudio);
            } catch (err) {
                setError('Failed to load training examples.');
            } finally {
                setLoading(false);
            }
        };
        fetchExamples();
    }, []);

    const handlePlayAudio = (example: TrainingExample) => {
        if (playingExampleId === example.id) {
            audioRef.current?.pause();
            setPlayingExampleId(null);
        } else {
            if (audioRef.current && example.audioUrl) {
                audioRef.current.src = example.audioUrl;
                audioRef.current.play();
                setPlayingExampleId(example.id);
            }
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => setPlayingExampleId(null);
        audio?.addEventListener('ended', handleEnded);
        return () => {
            audio?.removeEventListener('ended', handleEnded);
        }
    }, []);

    const handleDeleteExample = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this training example?')) {
            try {
                await apiService.deleteTrainingExample(id);
                setTrainingExamples(prev => prev.filter(ex => ex.id !== id));
            } catch (err) {
                alert('Failed to delete example.');
            }
        }
    };

    const handleSaveExample = async (newExampleData: Omit<TrainingExample, 'id' | 'uploadedAt'>) => {
        try {
            const newExample = await apiService.createTrainingExample(newExampleData);
            // Add placeholder audio URL for immediate playback
            const exampleWithAudio = { ...newExample, audioUrl: newExample.hasAudio ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : undefined };
            setTrainingExamples(prev => [exampleWithAudio, ...prev]);
        } catch (err) {
            alert('Failed to save example.');
        }
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
                    onDelete={handleDeleteExample}
                    onPlayAudio={handlePlayAudio}
                    playingExampleId={playingExampleId}
                />
                <TrainingColumn
                    title="Corrective Feedback"
                    description="Upload non-compliant or unsuccessful calls to teach the AI what to avoid."
                    examples={badExamples}
                    color="red"
                    tooltip="Examples of 'Bad Calls' are used to teach the AI what not to do. This includes compliance breaches, failed negotiations, or poor sentiment handling."
                    onDelete={handleDeleteExample}
                    onPlayAudio={handlePlayAudio}
                    playingExampleId={playingExampleId}
                />
            </div>

            <TrainingUploadModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSave={handleSaveExample}
            />
            <audio ref={audioRef} />
        </section>
    );
};

export default TrainingCenter;
