
import React, { useState, useEffect } from 'react';
import { VoiceLibraryEntry } from '../../types';
import { Icon } from '../Icon';

interface VoiceLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (voice: Omit<VoiceLibraryEntry, 'id' | 'status'> & { id?: string }) => void;
    voice: VoiceLibraryEntry | null;
}

const VoiceLibraryModal: React.FC<VoiceLibraryModalProps> = ({ isOpen, onClose, onSave, voice }) => {
    const [formData, setFormData] = useState({
        voiceName: '',
        voiceProvider: 'Google TTS',
        voiceId: '',
        languageTag: '',
        accent: '',
    });

    useEffect(() => {
        if (voice) {
            setFormData({
                voiceName: voice.voiceName,
                voiceProvider: voice.voiceProvider,
                voiceId: voice.voiceId,
                languageTag: voice.languageTag,
                accent: voice.accent,
            });
        } else {
            setFormData({ voiceName: '', voiceProvider: 'Google TTS', voiceId: '', languageTag: '', accent: '' });
        }
    }, [voice, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // FIX: Explicitly create a type-safe object to pass to onSave, casting voiceProvider to match the expected type.
        onSave({
            id: voice?.id,
            voiceName: formData.voiceName,
            voiceProvider: formData.voiceProvider as VoiceLibraryEntry['voiceProvider'],
            voiceId: formData.voiceId,
            languageTag: formData.languageTag,
            accent: formData.accent,
        });
    };
    
    const inputClass = "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white";

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{voice ? 'Edit' : 'Add New'} Voice</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <Icon name="x" className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="voiceName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Voice Name</label>
                        <input type="text" id="voiceName" name="voiceName" value={formData.voiceName} onChange={handleChange} className={inputClass} placeholder="e.g., Matthew - Southern US" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="voiceProvider" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Voice Provider</label>
                            <select id="voiceProvider" name="voiceProvider" value={formData.voiceProvider} onChange={handleChange} className={inputClass}>
                                <option>Google TTS</option>
                                <option>ElevenLabs</option>
                                <option>Custom</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="voiceId" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Provider's Voice ID</label>
                            <input type="text" id="voiceId" name="voiceId" value={formData.voiceId} onChange={handleChange} className={inputClass} placeholder="e.g., en-US-Wavenet-D" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="languageTag" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Language Tag</label>
                            <input type="text" id="languageTag" name="languageTag" value={formData.languageTag} onChange={handleChange} className={inputClass} placeholder="e.g., en-US" />
                        </div>
                        <div>
                            <label htmlFor="accent" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Accent</label>
                            <input type="text" id="accent" name="accent" value={formData.accent} onChange={handleChange} className={inputClass} placeholder="e.g., Southern" />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Save Voice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoiceLibraryModal;
