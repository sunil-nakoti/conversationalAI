import React, { useState } from 'react';
// FIX: Corrected import path for types.ts
import { CanvasNodeData, Objection, Playbook, NegotiationModel } from '../../types';
import { Icon } from '../Icon';

interface SettingsPanelProps {
    selectedNode: CanvasNodeData | null;
    updateNodeSettings: (nodeId: string, newSettings: any) => void;
    onDelete: () => void;
    onClose: () => void;
    objections: Objection[];
    playbooks: Playbook[];
    negotiationModels: NegotiationModel[];
}

const placeholders = [
    '{debtor.fullname}',
    '{debtor.accountnumber}',
    '{debtor.currentbalance}',
    '{debtor.originalcreditor}',
    '{agent.phone_number}',
    '{payment.link}',
    '{payment.amount}',
    '{payment.due_date}',
];

const PlaceholderList: React.FC = () => {
    const [copiedPlaceholder, setCopiedPlaceholder] = useState<string | null>(null);

    const handleCopy = (placeholder: string) => {
        navigator.clipboard.writeText(placeholder);
        setCopiedPlaceholder(placeholder);
        setTimeout(() => {
            setCopiedPlaceholder(null);
        }, 1500);
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h5 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Available Placeholders</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Click to copy a placeholder to your clipboard.</p>
            <div className="space-y-2">
                {placeholders.map(p => (
                    <div key={p} className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/50 p-2 rounded-md">
                        <code className="text-xs text-sky-600 dark:text-brand-accent font-mono">{p}</code>
                        <button onClick={() => handleCopy(p)} className="text-slate-500 dark:text-slate-400 hover:text-brand-accent">
                            <Icon name={copiedPlaceholder === p ? 'check' : 'copy'} className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SettingsPanel: React.FC<SettingsPanelProps> = ({ selectedNode, updateNodeSettings, onDelete, onClose, objections, playbooks, negotiationModels }) => {
    if (!selectedNode) {
        return (
            <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-full flex flex-col items-center justify-center">
                <Icon name="settings" className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Node Settings</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Select a node on the canvas to view and edit its properties.</p>
            </div>
        );
    }

    const handleSettingChange = (key: string, value: string | number) => {
        updateNodeSettings(selectedNode.id, { [key]: value });
    };

    const renderSettings = () => {
        switch (selectedNode.type) {
            case 'start-call':
                 return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Initial Greeting Message (Text-to-Speech)</label>
                            <textarea
                                rows={4}
                                value={selectedNode.settings?.openingMessage || ''}
                                onChange={e => handleSettingChange('openingMessage', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                placeholder="Hello, may I please speak with {debtor.fullname}? This is a message from a debt collector."
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This is the first thing the AI will say when the call is connected.</p>
                        </div>
                        <PlaceholderList />
                    </>
                );
            case 'missed-payment':
                const actions = selectedNode.settings?.actions || [];

                const handleActionChange = (index: number, field: string, value: any) => {
                    const newActions = [...actions];
                    newActions[index] = { ...newActions[index], [field]: value };
                    updateNodeSettings(selectedNode.id, { actions: newActions });
                };

                const handleAddAction = () => {
                    const lastDelay = actions.length > 0 ? actions[actions.length - 1].delayDays : 0;
                    const newActions = [...actions, { delayDays: lastDelay + 2, actionType: 'sms', message: '' }];
                    updateNodeSettings(selectedNode.id, { actions: newActions });
                };

                const handleRemoveAction = (index: number) => {
                    const newActions = actions.filter((_: any, i: number) => i !== index);
                    updateNodeSettings(selectedNode.id, { actions: newActions });
                };

                return (
                    <>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Configure a sequence of automated follow-ups for when a debtor misses a scheduled payment.
                        </p>
                        <div className="space-y-4">
                            {actions.map((action: any, index: number) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 relative">
                                    <button
                                        onClick={() => handleRemoveAction(index)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                        title="Remove Action"
                                    >
                                        <Icon name="x" className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Delay (Days)</label>
                                            <input
                                                type="number"
                                                value={action.delayDays}
                                                onChange={e => handleActionChange(index, 'delayDays', Number(e.target.value))}
                                                className="w-full p-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Action</label>
                                            <select
                                                value={action.actionType}
                                                onChange={e => handleActionChange(index, 'actionType', e.target.value)}
                                                className="w-full p-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                                            >
                                                <option value="sms">Send SMS</option>
                                                <option value="call">Make AI Call</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                            {action.actionType === 'sms' ? 'Message Content' : 'Opening Call Script'}
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={action.message}
                                            onChange={e => handleActionChange(index, 'message', e.target.value)}
                                            className="w-full p-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                                            placeholder={action.actionType === 'sms' ? 'e.g., Hi {debtor.fullname}, you missed a payment...' : 'e.g., Hello, I am calling about a missed payment...'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleAddAction}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 dark:bg-slate-700/80 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <Icon name="plus-square" className="h-5 w-5" />
                            Add Follow-up Action
                        </button>
                        <PlaceholderList />
                    </>
                );
            case 'delay':
            case 'wait':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Wait Duration</label>
                            <input
                                type="number"
                                value={selectedNode.settings?.duration || '1'}
                                onChange={e => handleSettingChange('duration', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Time Unit</label>
                            <select
                                value={selectedNode.settings?.unit || 'days'}
                                onChange={e => handleSettingChange('unit', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                    </>
                );
            case 'start-text':
            case 'sms':
                 return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">SMS Message</label>
                            <textarea
                                rows={4}
                                value={selectedNode.settings?.message || ''}
                                onChange={e => handleSettingChange('message', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                placeholder="Enter SMS message. Use {debtor.fullname} for variables."
                            />
                        </div>
                        <PlaceholderList />
                    </>
                );
            case 'mini-miranda':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Disclosure Message (Text-to-Speech)</label>
                            <textarea
                                rows={4}
                                value={selectedNode.settings?.message || ''}
                                onChange={e => handleSettingChange('message', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                placeholder="This is an attempt to collect a debt and any information obtained will be used for that purpose."
                            />
                        </div>
                        <PlaceholderList />
                    </>
                );
            case 'voicemail-drop':
                return (
                   <>
                       <div>
                           <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Voicemail Drop Message (Text-to-Speech)</label>
                           <textarea
                               rows={5}
                               value={selectedNode.settings?.message || ''}
                               onChange={e => handleSettingChange('message', e.target.value)}
                               className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                               placeholder="Hello, this is a message for {debtor.fullname} regarding account #{debtor.accountnumber}. Please return our call at your earliest convenience."
                           />
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This text will be converted to audio and played if a voicemail is detected.</p>
                       </div>
                       <PlaceholderList />
                   </>
               );
             case 'email':
                 return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Subject</label>
                            <input
                                type="text"
                                value={selectedNode.settings?.subject || ''}
                                onChange={e => handleSettingChange('subject', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Body</label>
                            <textarea
                                rows={6}
                                value={selectedNode.settings?.body || ''}
                                onChange={e => handleSettingChange('body', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            />
                        </div>
                    </>
                );
            case 'handle-objection':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Objection</label>
                            <select
                                value={selectedNode.settings?.objectionId || ''}
                                onChange={e => handleSettingChange('objectionId', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            >
                                <option value="">Select an objection</option>
                                {objections.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Counter Playbook</label>
                            <select
                                value={selectedNode.settings?.playbookId || ''}
                                onChange={e => handleSettingChange('playbookId', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            >
                                <option value="">Select a playbook</option>
                                {playbooks.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                );
            case 'payment-negotiation':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Negotiation Model</label>
                            <select
                                value={selectedNode.settings?.negotiationModelId || ''}
                                onChange={e => handleSettingChange('negotiationModelId', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            >
                                <option value="">Select a model</option>
                                {negotiationModels.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                );
            case 'end':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Disposition Code</label>
                            <input
                                type="text"
                                value={selectedNode.settings?.dispositionCode || ''}
                                onChange={e => handleSettingChange('dispositionCode', e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                                placeholder="e.g., PTP, DNC, Deceased"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Set a disposition code for reporting and analytics.</p>
                        </div>
                    </>
                );
            default:
        }
    }

    return (
        <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Icon name={selectedNode.icon} className="h-6 w-6 text-sky-600 dark:text-brand-accent" />
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedNode.label}</h4>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                    <Icon name="x" className="h-5 w-5" />
                </button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {renderSettings()}
            </div>
             <button
                onClick={onDelete}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 font-semibold py-2 px-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/40 transition-colors"
             >
                 <Icon name="trash" className="h-5 w-5"/>
                Delete Node
            </button>
        </div>
    );
};

export default SettingsPanel;