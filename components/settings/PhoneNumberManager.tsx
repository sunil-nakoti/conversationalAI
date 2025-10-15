

import React, { useState } from 'react';
// FIX: Corrected import path for types
import { AvailablePhoneNumber, PhoneNumberStatus } from '../../types';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
// FIX: Import PhoneNumberPurchaseModal
import PhoneNumberPurchaseModal from '../compliance/PhoneNumberPurchaseModal';

interface PhoneNumberManagerProps {
    phonePool: AvailablePhoneNumber[];
    setPhonePool?: React.Dispatch<React.SetStateAction<AvailablePhoneNumber[]>>;
    callThrottle: number;
    setCallThrottle: (value: number) => void;
    healthThreshold: number;
    setHealthThreshold: (value: number) => void;
    onRunHealthCheck: () => void;
    isCheckingHealth: boolean;
}

const getStatusClass = (status: PhoneNumberStatus) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300';
        case 'cooldown':
            return 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300';
        case 'retired':
            return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
        default:
            return 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300';
    }
};

const HealthScoreBar: React.FC<{ score: number }> = ({ score }) => {
    let colorClass = 'bg-green-500';
    if (score < 30) colorClass = 'bg-red-500';
    else if (score < 60) colorClass = 'bg-yellow-500';

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2.5">
            <div 
                className={`${colorClass} h-2.5 rounded-full`} 
                style={{ width: `${score}%` }}
            ></div>
        </div>
    );
};

const PhoneNumberManager: React.FC<PhoneNumberManagerProps> = ({
    phonePool,
    setPhonePool,
    callThrottle,
    setCallThrottle,
    healthThreshold,
    setHealthThreshold,
    onRunHealthCheck,
    isCheckingHealth,
}) => {
    // FIX: Add state to manage the purchase modal
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };
    
    // FIX: Changed 'any[]' to 'string[]' to match the expected prop type for onPurchase.
    const handlePurchaseNumbers = (numbers: string[]) => {
        console.log("Purchased numbers:", numbers);
        // In a real app, you'd update the phonePool state here
    };

    const handleEdit = (phone: AvailablePhoneNumber) => {
        setEditingId(phone.id);
        setEditingValue(phone.forwardingNumber || '');
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditingValue('');
    };

    const handleSave = () => {
        if (!editingId || !setPhonePool) return;
        setPhonePool(prevPool =>
            prevPool.map(p =>
                p.id === editingId ? { ...p, forwardingNumber: editingValue.trim() || undefined } : p
            )
        );
        setEditingId(null);
        setEditingValue('');
    };
    
    const handleToggleVoicemailDetection = (phoneId: string) => {
        if (!setPhonePool) return;
        setPhonePool(prevPool =>
            prevPool.map(p =>
                p.id === phoneId ? { ...p, voicemailDetection: !p.voicemailDetection } : p
            )
        );
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-start gap-4">
                    <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                        <Icon name="server-cog" className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart Pool & Reputation Management</h3>
                            <Tooltip content="Configure the autonomous system that manages your outbound phone number pool to maximize deliverability and minimize spam flags.">
                                <Icon name="info" className="h-5 w-5 text-slate-400" />
                            </Tooltip>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage number rotation, throttling, and automated health checks.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsPurchaseModalOpen(true)}
                        className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-500 transition-colors"
                    >
                        <Icon name="shopping-cart" className="h-5 w-5" />
                        Purchase Numbers
                    </button>
                    <button 
                        onClick={onRunHealthCheck}
                        disabled={isCheckingHealth}
                        className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        <Icon name={isCheckingHealth ? 'spinner' : 'activity'} className={`h-5 w-5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                        {isCheckingHealth ? 'Checking...' : 'Run Health Check'}
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="call-throttle" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Max Calls per Hour (per #)</label>
                    <input
                        type="number"
                        id="call-throttle"
                        value={callThrottle}
                        onChange={(e) => setCallThrottle(parseInt(e.target.value, 10))}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                    />
                </div>
                 <div>
                    <label htmlFor="health-threshold" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Health Score Retirement Threshold</label>
                    <input
                        type="number"
                        id="health-threshold"
                        value={healthThreshold}
                        onChange={(e) => setHealthThreshold(parseInt(e.target.value, 10))}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                     <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Call Forward</th>
                            {setPhonePool && <th scope="col" className="px-6 py-3">Voicemail Drop</th>}
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Health Score</th>
                            <th scope="col" className="px-6 py-3 text-center">Calls (Last Hr)</th>
                            <th scope="col" className="px-6 py-3">Last Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phonePool.map(phone => (
                             <tr key={phone.id} className="group border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white">{phone.number}</td>
                                <td className="px-6 py-4 font-mono text-slate-800 dark:text-white">
                                    {editingId === phone.id && setPhonePool ? (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                className="w-full p-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white"
                                                placeholder="Enter number..."
                                            />
                                            <button onClick={handleSave} className="p-1 text-green-500 hover:text-green-700" title="Save">
                                                <Icon name="check" className="h-5 w-5" />
                                            </button>
                                            <button onClick={handleCancel} className="p-1 text-red-500 hover:text-red-700" title="Cancel">
                                                <Icon name="x" className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span>{phone.forwardingNumber || 'N/A'}</span>
                                            {setPhonePool && (
                                                <button onClick={() => handleEdit(phone)} className="p-1 text-slate-400 hover:text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Edit">
                                                    <Icon name="settings" className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                                {setPhonePool && (
                                    <td className="px-6 py-4">
                                        <Tooltip content={phone.voicemailDetection ? 'Voicemail drop is ON' : 'Voicemail drop is OFF'}>
                                            <button
                                                onClick={() => handleToggleVoicemailDetection(phone.id)}
                                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 ${phone.voicemailDetection ? 'bg-brand-success' : 'bg-slate-300 dark:bg-slate-600'}`}
                                            >
                                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${phone.voicemailDetection ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </Tooltip>
                                    </td>
                                )}
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(phone.status)}`}>
                                        {phone.status.charAt(0).toUpperCase() + phone.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold w-8 text-slate-900 dark:text-white">{phone.healthScore}</span>
                                        <HealthScoreBar score={phone.healthScore} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-mono">{phone.callsLastHour}</td>
                                <td className="px-6 py-4">{timeAgo(phone.lastUsedTimestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* FIX: Render the purchase modal */}
            <PhoneNumberPurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                onPurchase={handlePurchaseNumbers}
            />
        </div>
    );
};

export default PhoneNumberManager;