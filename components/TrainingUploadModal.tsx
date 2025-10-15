
import React, { useState } from 'react';
// FIX: Corrected import path for types
import { TrainingExample } from '../types';
import { Icon } from './Icon';

interface TrainingUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (example: Omit<TrainingExample, 'id' | 'uploadedAt'>) => void;
}

const TrainingUploadModal: React.FC<TrainingUploadModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'good' | 'bad'>('good');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        if (!title.trim()) {
            setError('Example title is required.');
            return;
        }
        if (!audioFile && !transcript.trim()) {
            setError('Please upload an audio file or provide a transcript.');
            return;
        }

        onSave({
            title,
            type,
            hasAudio: !!audioFile,
            hasTranscript: !!transcript.trim(),
        });
        
        // Reset state and close
        setTitle('');
        setType('good');
        setAudioFile(null);
        setTranscript('');
        setError(null);
        onClose();
    };

    const handleClose = () => {
        // Reset state on close
        setTitle('');
        setType('good');
        setAudioFile(null);
        setTranscript('');
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Training Example</h2>
                    <button onClick={handleClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="example-title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Example Title</label>
                        <input
                            type="text"
                            id="example-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Successful PTP Negotiation"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Example Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="example-type"
                                    value="good"
                                    checked={type === 'good'}
                                    onChange={() => setType('good')}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 ${type === 'good' ? 'border-brand-success bg-brand-success' : 'border-slate-400 dark:border-slate-500'} flex items-center justify-center`}>
                                    {type === 'good' && <div className="w-2 h-2 rounded-full bg-white dark:bg-brand-secondary"></div>}
                                </div>
                                <span className={type === 'good' ? 'text-brand-success' : 'text-slate-600 dark:text-slate-300'}>Good Call (Positive Reinforcement)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="example-type"
                                    value="bad"
                                    checked={type === 'bad'}
                                    onChange={() => setType('bad')}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 ${type === 'bad' ? 'border-brand-danger bg-brand-danger' : 'border-slate-400 dark:border-slate-500'} flex items-center justify-center`}>
                                     {type === 'bad' && <div className="w-2 h-2 rounded-full bg-white dark:bg-brand-secondary"></div>}
                                </div>
                                <span className={type === 'bad' ? 'text-brand-danger' : 'text-slate-600 dark:text-slate-300'}>Bad Call (Corrective Feedback)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="audio-file" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Call Recording (Optional)</label>
                        <label htmlFor="audio-file" className="flex items-center gap-2 w-full justify-center p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md cursor-pointer hover:border-brand-accent transition-colors">
                            <Icon name="upload" className="h-5 w-5" />
                            <span className="text-slate-600 dark:text-slate-300">{audioFile ? audioFile.name : 'Click to select an audio file'}</span>
                        </label>
                        <input id="audio-file" type="file" className="hidden" accept="audio/*" onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)} />
                    </div>

                    <div>
                        <label htmlFor="transcript" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Call Transcript (Optional)</label>
                        <textarea
                            id="transcript"
                            rows={4}
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Paste the call transcript here..."
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white"
                        />
                    </div>
                     {error && <p className="text-sm text-brand-danger">{error}</p>}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={handleClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Save Training Example
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainingUploadModal;