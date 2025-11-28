import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { VoiceLibraryEntry, VoiceStatus, AIAgentConfiguration } from '../../types';
import * as humanizationService from '../../services/humanizationService';
import VoiceLibraryModal from './VoiceLibraryModal';
import VoiceRecorder from '../analytics/VoiceRecorder';

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; tooltip: string; }> = ({ label, enabled, setEnabled, tooltip }) => (
    <div className="flex items-start justify-between">
        <div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
                <Tooltip content={tooltip}>
                    <Icon name="info" className="h-4 w-4 text-slate-400" />
                </Tooltip>
            </div>
        </div>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${enabled ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

interface HumanizationSettingsProps {
    config: AIAgentConfiguration;
    onConfigChange: (field: keyof AIAgentConfiguration, value: any) => void;
}


const HumanizationSettings: React.FC<HumanizationSettingsProps> = ({ config, onConfigChange }) => {
    const [voiceLibrary, setVoiceLibrary] = useState<VoiceLibraryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoice, setEditingVoice] = useState<VoiceLibraryEntry | null>(null);

    useEffect(() => {
        humanizationService.fetchVoiceLibrary().then(data => {
            setVoiceLibrary(data);
            setIsLoading(false);
        });
    }, []);
    
    const handleSaveVoice = async (voiceData: Omit<VoiceLibraryEntry, 'id' | 'status'> & { id?: string }) => {
        const savedVoice = await humanizationService.saveVoiceEntry(voiceData);
        if (voiceData.id) {
            setVoiceLibrary(prev => prev.map(v => v.id === savedVoice.id ? savedVoice : v));
        } else {
            setVoiceLibrary(prev => [...prev, savedVoice]);
        }
        setIsModalOpen(false);
        setEditingVoice(null);
    };

    const handleSaveClonedVoice = async (voiceName: string) => {
        const newVoiceData: Omit<VoiceLibraryEntry, 'id' | 'status'> = {
            voiceName,
            voiceProvider: 'Custom',
            voiceId: `custom_${voiceName.toLowerCase().replace(/\s/g, '_')}_${Date.now()}`,
            languageTag: 'en-US', // Defaulting for simplicity
            accent: 'Cloned'
        };
        const savedVoice = await humanizationService.saveVoiceEntry(newVoiceData);
        setVoiceLibrary(prev => [...prev, savedVoice]);
    };
    
    const handleToggleStatus = async (voiceId: string, newStatus: VoiceStatus) => {
        const updatedVoice = await humanizationService.updateVoiceStatus(voiceId, newStatus);
        setVoiceLibrary(prev => prev.map(v => v.id === voiceId ? updatedVoice : v));
    };

    const handleEditVoice = (voice: VoiceLibraryEntry) => {
        setEditingVoice(voice);
        setIsModalOpen(true);
    };

    const handleAddNewVoice = () => {
        setEditingVoice(null);
        setIsModalOpen(true);
    };
    
    const availableVoiceOptions = [
        { id: 'Zephyr (Warm, Empathetic)', name: 'Zephyr (Warm, Empathetic)'},
        { id: 'Kore (Professional, Clear)', name: 'Kore (Professional, Clear)'},
        { id: 'Puck (Calm, Reassuring)', name: 'Puck (Calm, Reassuring)'},
        { id: 'Charon (Deep, Authoritative)', name: 'Charon (Deep, Authoritative)'}
    ].concat(
        voiceLibrary
            .filter(v => v.status === 'active')
            .map(v => ({ id: v.voiceName, name: `${v.voiceName} (${v.accent})`}))
    );

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="globe" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Voice & Language</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Configure real-time accent adaptation and voice selection.</p>
                </div>
            </div>

            <div className="space-y-4">
                <ToggleSwitch
                    label="Automatic Accent Matching"
                    enabled={config.accentMatchingEnabled}
                    setEnabled={(val) => onConfigChange('accentMatchingEnabled', val)}
                    tooltip="When enabled, the AI will analyze the debtor's speech to identify their accent and language, then automatically switch to the most appropriate voice from your library to match."
                />

                <div>
                    <label htmlFor="defaultVoice" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Default Voice</label>
                    <select
                        id="defaultVoice"
                        value={config.defaultVoice}
                        onChange={(e) => onConfigChange('defaultVoice', e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                    >
                        {availableVoiceOptions.map(voice => (
                            <option key={voice.id} value={voice.id}>{voice.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold text-slate-800 dark:text-white">Custom Voice Library</h4>
                    <button onClick={handleAddNewVoice} className="flex items-center gap-2 text-xs font-semibold text-brand-accent hover:text-sky-400">
                        <Icon name="plus-square" className="h-4 w-4" />
                        Add Manually
                    </button>
                </div>
                <div className="overflow-auto max-h-48 border rounded-lg border-slate-200 dark:border-slate-700 mb-4">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                        <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-2">Voice Name</th>
                                <th scope="col" className="px-4 py-2">Accent</th>
                                <th scope="col" className="px-4 py-2 text-center">Status</th>
                                <th scope="col" className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center p-8"><Icon name="spinner" className="h-6 w-6 animate-spin mx-auto"/></td></tr>
                            ) : voiceLibrary.map(voice => (
                                <tr key={voice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">{voice.voiceName}</td>
                                    <td className="px-4 py-2">{voice.accent} ({voice.languageTag})</td>
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleToggleStatus(voice.id, voice.status === 'active' ? 'inactive' : 'active')} className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors flex-shrink-0 ${voice.status === 'active' ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                            <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${voice.status === 'active' ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <Tooltip content="Test Voice"><button onClick={() => humanizationService.playVoiceSample(voice)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-brand-accent"><Icon name="play" className="h-4 w-4"/></button></Tooltip>
                                            <Tooltip content="Edit Voice"><button onClick={() => handleEditVoice(voice)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-brand-accent"><Icon name="settings" className="h-4 w-4"/></button></Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div>
                    <h4 className="text-md font-semibold text-slate-800 dark:text-white mb-2">Voice Cloning</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Record a short audio sample to create a new custom voice for your agents.</p>
                    <VoiceRecorder onSaveClonedVoice={handleSaveClonedVoice} />
                </div>
            </div>
            
            <VoiceLibraryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveVoice}
                voice={editingVoice}
            />
        </div>
    );
};

export default HumanizationSettings;
