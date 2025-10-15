import React from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { AIAgentConfiguration } from '../../types';

const CheckboxWithTooltip: React.FC<{ label: string; tooltip: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, tooltip, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <label htmlFor={label} className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">{label}</label>
            <Tooltip content={tooltip}>
                <Icon name="info" className="h-4 w-4 text-slate-400" />
            </Tooltip>
        </div>
        <input
            id={label}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded text-brand-accent focus:ring-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500"
        />
    </div>
);

interface PersonalityForgeProps {
    agentName: string;
    config: AIAgentConfiguration;
    onConfigChange: (field: keyof AIAgentConfiguration, value: any) => void;
}

const PersonalityForge: React.FC<PersonalityForgeProps> = ({ agentName, config, onConfigChange }) => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="robot" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Personality Forge</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Craft the personality of <span className="font-bold">{agentName}</span>.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="basePersona" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Base Persona</label>
                    <select
                        id="basePersona"
                        value={config.basePersona}
                        onChange={(e) => onConfigChange('basePersona', e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                    >
                        <option value="empathetic">Empathetic & Solution-Oriented</option>
                        <option value="direct">Direct & Assertive</option>
                        <option value="professional">Professional & Formal</option>
                    </select>
                </div>
                <div>
                     <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">System Prompt (Instructions)</label>
                     <textarea
                        id="systemPrompt"
                        rows={5}
                        value={config.systemPrompt}
                        onChange={(e) => onConfigChange('systemPrompt', e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                     />
                     <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                        <strong>Tip:</strong> Use placeholders like <code>{'{branding.companyName}'}</code> to dynamically insert campaign branding into the prompt.
                     </div>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 space-y-3">
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300">Vocal Humanization</h4>
                <CheckboxWithTooltip 
                    label="Enable Natural Pauses & Fillers"
                    tooltip="When enabled, the AI will inject subtle, human-like pauses and filler words (e.g., 'um', 'uh') to sound less robotic. Use sparingly for professional personas."
                    checked={config.naturalPauses}
                    onChange={(val) => onConfigChange('naturalPauses', val)}
                />
                <CheckboxWithTooltip 
                    label="Vary Vocal Pitch & Intonation"
                    tooltip="Engages a more dynamic Text-to-Speech model that varies tone and pitch, making the agent sound more engaging. May slightly increase audio generation latency."
                    checked={config.varyPitch}
                    onChange={(val) => onConfigChange('varyPitch', val)}
                />
            </div>
        </div>
    );
};

export default PersonalityForge;