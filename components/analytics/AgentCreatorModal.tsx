import React, { useState } from 'react';
import { Icon } from '../Icon';
import { AIAgentConfiguration, NegotiationModel } from '../../types';
import Tooltip from '../Tooltip';

interface AgentCreatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, config: AIAgentConfiguration) => void;
    negotiationModels: NegotiationModel[];
}

const AgentCreatorModal: React.FC<AgentCreatorModalProps> = ({ isOpen, onClose, onSave, negotiationModels }) => {
    const [name, setName] = useState('');
    const [config, setConfig] = useState<AIAgentConfiguration>({
        basePersona: 'empathetic',
        systemPrompt: 'You are a helpful and understanding collections assistant.',
        responseLatency: 400,
        interruptionSensitivity: 8,
        negotiationModelId: negotiationModels[0]?.id || '',
        defaultVoice: 'Zephyr (Warm, Empathetic)',
        naturalPauses: true,
        varyPitch: true,
        accentMatchingEnabled: false,
        tacticUrgency: 0,
        tacticEmpathy: 0,
        tacticSocialProof: 0,
        tacticAuthority: 0,
    });

    if (!isOpen) {
        return null;
    }

    const handleConfigChange = (field: keyof AIAgentConfiguration, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!name.trim()) {
            alert("Agent name is required.");
            return;
        }
        onSave(name, config);
    };

    const inputClass = "w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md placeholder:text-slate-500 text-slate-900 dark:text-white";

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New AI Agent</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <Icon name="x" className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Agent Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g., Hermes" />
                    </div>
                    <div>
                        <label htmlFor="basePersona" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Base Persona</label>
                        <select id="basePersona" value={config.basePersona} onChange={(e) => handleConfigChange('basePersona', e.target.value)} className={inputClass}>
                            <option value="empathetic">Empathetic & Solution-Oriented</option>
                            <option value="direct">Direct & Assertive</option>
                            <option value="professional">Professional & Formal</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">System Prompt (Instructions)</label>
                        <textarea id="systemPrompt" rows={4} value={config.systemPrompt} onChange={(e) => handleConfigChange('systemPrompt', e.target.value)} className={inputClass} />
                    </div>
                     <div>
                        <label htmlFor="negotiationModelId" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Negotiation Model</label>
                         <select id="negotiationModelId" value={config.negotiationModelId} onChange={(e) => handleConfigChange('negotiationModelId', e.target.value)} className={inputClass}>
                            {negotiationModels.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="defaultVoice" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Default Voice</label>
                        <input type="text" id="defaultVoice" value={config.defaultVoice} onChange={(e) => handleConfigChange('defaultVoice', e.target.value)} className={inputClass} placeholder="e.g., Custom-Cloned Voice" />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Create and Save Agent
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentCreatorModal;