import React from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { IntelligenceTab, AIAgentConfiguration, NegotiationModel } from '../../types';

interface SliderControlProps {
    label: string;
    tooltip: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    minLabel: string;
    maxLabel: string;
    onChange: (value: number) => void;
}

const SliderControl: React.FC<SliderControlProps> = ({ label, tooltip, value, min, max, step = 1, unit = '', minLabel, maxLabel, onChange }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
                    <Tooltip content={tooltip}>
                        <Icon name="info" className="h-4 w-4 text-slate-400" />
                    </Tooltip>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
};


interface PerformanceTuningProps {
    onNavigate: (tab: IntelligenceTab) => void;
    config: AIAgentConfiguration;
    onConfigChange: (field: keyof AIAgentConfiguration | 'isPrometheusEnabled', value: any) => void;
    negotiationModels: NegotiationModel[];
    isPrometheusEnabled?: boolean;
}

const PerformanceTuning: React.FC<PerformanceTuningProps> = ({ onNavigate, config, onConfigChange, negotiationModels, isPrometheusEnabled }) => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="trending-up" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance & Behavior Tuning</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Fine-tune the agent's real-time responsiveness and strategic decision-making.</p>
                </div>
            </div>
            
             <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-500/20">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <Icon name="flame" className="h-5 w-5 text-orange-500" />
                        <label className="text-sm font-medium text-orange-800 dark:text-orange-300">Enable "Prometheus Mode"</label>
                         <Tooltip content="Autonomous Agent Optimizer: The AI will create and test challenger versions of itself to find better-performing models.">
                            <Icon name="info" className="h-4 w-4 text-slate-400" />
                        </Tooltip>
                    </div>
                    <button type="button" onClick={() => onConfigChange('isPrometheusEnabled', !isPrometheusEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${isPrometheusEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isPrometheusEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <SliderControl
                    label="Response Latency"
                    tooltip="Controls how quickly the AI responds after the debtor stops speaking. Lower latency feels faster but risks interrupting. Higher latency provides a more thoughtful pause."
                    value={config.responseLatency}
                    min={0}
                    max={1500}
                    step={50}
                    unit="ms"
                    minLabel="Aggressive (0ms)"
                    maxLabel="Deliberate (1500ms)"
                    onChange={(val) => onConfigChange('responseLatency', val)}
                />
                <SliderControl
                    label="Interruption Sensitivity"
                    tooltip="Controls how easily the agent can be interrupted. High sensitivity means the agent will stop talking instantly if the debtor speaks, which is crucial for de-escalation."
                    value={config.interruptionSensitivity}
                    min={1}
                    max={10}
                    minLabel="Low (Finish Thought)"
                    maxLabel="High (Yield Immediately)"
                    onChange={(val) => onConfigChange('interruptionSensitivity', val)}
                />
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label htmlFor="negotiationModelId" className="text-sm font-medium text-slate-600 dark:text-slate-300">Negotiation Model</label>
                        <Tooltip content="Defines the agent's authority and strategy for negotiating payments and settlements.">
                            <Icon name="info" className="h-4 w-4 text-slate-400" />
                        </Tooltip>
                    </div>
                    <select 
                        id="negotiationModelId" 
                        value={config.negotiationModelId} 
                        onChange={(e) => onConfigChange('negotiationModelId', e.target.value)} 
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                    >
                        {negotiationModels.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/50 space-y-6">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800 dark:text-white">Tactics Tuning</h4>
                    <Tooltip content="Fine-tune the agent's persuasive strategy based on principles of human psychology to guide the debtor towards payment.">
                        <Icon name="info" className="h-4 w-4 text-slate-400" />
                    </Tooltip>
                </div>
                <SliderControl
                    label="Urgency / Patience"
                    tooltip="Adjusts the agent's pacing. Urgency favors phrases like 'this offer expires soon.' Patience favors phrases that reduce pressure."
                    value={config.tacticUrgency ?? 0}
                    min={-10}
                    max={10}
                    minLabel="Patient"
                    maxLabel="Urgent"
                    onChange={(val) => onConfigChange('tacticUrgency', val)}
                />
                <SliderControl
                    label="Logic / Empathy"
                    tooltip="Adjusts the agent's appeal. Logic focuses on facts about the debt. Empathy focuses on acknowledging the debtor's hardship."
                    value={config.tacticEmpathy ?? 0}
                    min={-10}
                    max={10}
                    minLabel="Factual"
                    maxLabel="Empathetic"
                    onChange={(val) => onConfigChange('tacticEmpathy', val)}
                />
                <SliderControl
                    label="Social Proof / Individual Focus"
                    tooltip="Adjusts framing. Social Proof uses phrases like 'many people choose this plan.' Individual Focus uses phrases like 'a custom plan for you.'"
                    value={config.tacticSocialProof ?? 0}
                    min={-10}
                    max={10}
                    minLabel="Individual"
                    maxLabel="Group"
                    onChange={(val) => onConfigChange('tacticSocialProof', val)}
                />
                <SliderControl
                    label="Authority / Collaboration"
                    tooltip="Adjusts positioning. Authority uses direct, firm language. Collaboration frames the agent and debtor as a team."
                    value={config.tacticAuthority ?? 0}
                    min={-10}
                    max={10}
                    minLabel="Collaborative"
                    maxLabel="Authoritative"
                    onChange={(val) => onConfigChange('tacticAuthority', val)}
                />
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700/50 mt-6">
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">The agent's strategic responses are governed by its assigned Playbook and its ability to handle defined Objections.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => onNavigate('playbooks')}
                        className="flex items-center justify-center gap-2 w-full p-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Icon name="gavel" className="h-5 w-5" />
                        Edit Conversational Playbooks
                    </button>
                    <button 
                        onClick={() => onNavigate('objections')}
                        className="flex items-center justify-center gap-2 w-full p-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <Icon name="shield-check" className="h-5 w-5" />
                        Configure Objection Handling
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerformanceTuning;