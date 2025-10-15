import React, { useState, useMemo, useEffect } from 'react';
import { AvailablePhoneNumber, PhoneNumberStatus, NumberPool, BrandingProfile, AttestationStatus } from '../../types';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import AssignPoolModal from './AssignPoolModal';

interface PhoneNumberManagerProps {
    phonePool: AvailablePhoneNumber[];
    setPhonePool: React.Dispatch<React.SetStateAction<AvailablePhoneNumber[]>>;
    numberPools: NumberPool[];
    setNumberPools: React.Dispatch<React.SetStateAction<NumberPool[]>>;
    brandingProfiles: BrandingProfile[];
    incubationHours: number;
}

const getStatusClass = (status: PhoneNumberStatus) => ({
    'active': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    'cooldown': 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
    'retired': 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300',
    'incubating': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
}[status]);

const getAttestationStatusConfig = (status?: AttestationStatus) => {
    switch (status) {
        case 'verified': return { icon: 'verified' as const, color: 'text-green-500 dark:text-green-400', label: 'Verified' };
        case 'pending': return { icon: 'spinner' as const, color: 'text-yellow-500 dark:text-yellow-400', label: 'Pending' };
        case 'failed': return { icon: 'warning' as const, color: 'text-red-500 dark:text-red-400', label: 'Failed' };
        default: return { icon: 'x' as const, color: 'text-slate-500 dark:text-slate-400', label: 'Unverified' };
    }
};

const HealthScoreBar: React.FC<{ score: number }> = ({ score }) => {
    const colorClass = score < 30 ? 'bg-red-500' : score < 60 ? 'bg-yellow-500' : 'bg-green-500';
    return <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2.5"><div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${score}%` }} /></div>;
};

const PhoneNumberManager: React.FC<PhoneNumberManagerProps> = (props) => {
    const { phonePool, setPhonePool, numberPools, setNumberPools, brandingProfiles, incubationHours } = props;
    
    const [activePoolTab, setActivePoolTab] = useState('all');
    const [selectedPhoneIds, setSelectedPhoneIds] = useState<string[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');

    const filteredNumbers = useMemo(() => {
        if (activePoolTab === 'all') return phonePool;
        if (activePoolTab === 'unassigned') return phonePool.filter(p => !p.poolId);
        return phonePool.filter(p => p.poolId === activePoolTab);
    }, [phonePool, activePoolTab]);

    const handleSelectOne = (id: string) => {
        setSelectedPhoneIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPhoneIds(e.target.checked ? filteredNumbers.map(n => n.id) : []);
    };
    
    const handleVerifyNumbers = () => {
        setPhonePool(prev => prev.map(p => selectedPhoneIds.includes(p.id) ? { ...p, attestationStatus: 'pending' } : p));
        setTimeout(() => {
            setPhonePool(prev => prev.map(p => {
                if (selectedPhoneIds.includes(p.id)) {
                    return { ...p, attestationStatus: Math.random() > 0.2 ? 'verified' : 'failed' };
                }
                return p;
            }));
            setSelectedPhoneIds([]);
        }, 2000);
    };

    const handleSavePoolAssignment = (poolId: string, phoneIds: string[]) => {
        setPhonePool(prev => prev.map(p => phoneIds.includes(p.id) ? { ...p, poolId } : p));
        setSelectedPhoneIds([]);
    };
    
    const handleCreateAndSavePool = (poolName: string, brandingProfileId: string | undefined, phoneIds: string[]) => {
        const newPool: NumberPool = { id: `pool_${Date.now()}`, name: poolName, brandingProfileId };
        setNumberPools(prev => [...prev, newPool]);
        handleSavePoolAssignment(newPool.id, phoneIds);
    };

    const handleEditForwarding = (phone: AvailablePhoneNumber) => {
        setEditingId(phone.id);
        setEditingValue(phone.forwardingNumber || 'not-forwarded');
    };

    const handleSaveForwarding = (phoneId: string) => {
        setPhonePool(prev => prev.map(p => {
            if (p.id === phoneId) {
                const isCustom = !['not-forwarded', ...brandingProfiles.map(b => b.phoneNumber)].includes(editingValue);
                return { ...p, forwardingNumber: editingValue === 'not-forwarded' ? undefined : (isCustom ? editingValue : editingValue) };
            }
            return p;
        }));
        setEditingId(null);
        setEditingValue('');
    };

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };
    
    const allPools = [{ id: 'all', name: 'All' }, ...numberPools, { id: 'unassigned', name: 'Unassigned' }];

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    {allPools.map(pool => (
                        <button key={pool.id} onClick={() => setActivePoolTab(pool.id)} className={`px-4 py-2 text-sm font-semibold border-b-2 ${activePoolTab === pool.id ? 'border-brand-accent text-brand-accent' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                            {pool.name}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleVerifyNumbers} disabled={selectedPhoneIds.length === 0} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold enabled:hover:bg-slate-200 dark:enabled:hover:bg-slate-600 disabled:opacity-50">
                        <Icon name="verified" className="h-5 w-5"/> Verify Numbers
                    </button>
                    <button onClick={() => setIsAssignModalOpen(true)} disabled={selectedPhoneIds.length === 0} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold enabled:hover:bg-slate-200 dark:enabled:hover:bg-slate-600 disabled:opacity-50">
                        <Icon name="server-cog" className="h-5 w-5"/> Manage Pool
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedPhoneIds.length === filteredNumbers.length && filteredNumbers.length > 0} className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent" /></th>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Call Forward</th>
                            <th scope="col" className="px-6 py-3">Verification</th>
                            <th scope="col" className="px-6 py-3">Pool</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Health Score</th>
                            <th scope="col" className="px-6 py-3">Last Used</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredNumbers.map(phone => {
                             const pool = numberPools.find(p => p.id === phone.poolId);
                             const brand = brandingProfiles.find(b => b.id === pool?.brandingProfileId);
                             const attestation = getAttestationStatusConfig(phone.attestationStatus);
                             const incubationProgress = phone.status === 'incubating' && phone.incubationStart ? Math.min(100, ((Date.now() - phone.incubationStart) / (incubationHours * 3600 * 1000)) * 100) : 0;
                            return (
                                <tr key={phone.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="p-4"><input type="checkbox" onChange={() => handleSelectOne(phone.id)} checked={selectedPhoneIds.includes(phone.id)} className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent" /></td>
                                    <td className="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white">{phone.number}</td>
                                    <td className="px-6 py-4">
                                        {editingId === phone.id ? (
                                            <div className="flex items-center gap-1">
                                                <select value={editingValue} onChange={e => setEditingValue(e.target.value)} className="w-full p-1 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                                    <option value="not-forwarded">Not Forwarded</option>
                                                    {brandingProfiles.map(b => <option key={b.id} value={b.phoneNumber}>{b.companyName} ({b.phoneNumber})</option>)}
                                                    <option value="custom">Custom Number</option>
                                                </select>
                                                {editingValue === 'custom' && <input type="text" onChange={e => setEditingValue(e.target.value)} className="w-full p-1 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" autoFocus />}
                                                <button onClick={() => handleSaveForwarding(phone.id)} className="p-1 text-green-500"><Icon name="check" className="h-5 w-5"/></button>
                                                <button onClick={() => setEditingId(null)} className="p-1 text-red-500"><Icon name="x" className="h-5 w-5"/></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <span>{phone.forwardingNumber || 'N/A'}</span>
                                                <button onClick={() => handleEditForwarding(phone)} className="p-1 text-slate-400 hover:text-sky-500 opacity-0 group-hover:opacity-100"><Icon name="settings" className="h-4 w-4"/></button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><Tooltip content={attestation.label}><Icon name={attestation.icon} className={`h-5 w-5 ${attestation.color} ${attestation.icon === 'spinner' ? 'animate-spin' : ''}`} /></Tooltip></td>
                                    <td className="px-6 py-4">{pool ? `${pool.name} ${brand ? `(${brand.companyName})` : ''}` : 'Unassigned'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(phone.status)}`}>{phone.status}</span>
                                        {phone.status === 'incubating' && <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1"><div className="bg-yellow-500 h-1 rounded-full" style={{width: `${incubationProgress}%`}}></div></div>}
                                    </td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-2"><span className="font-semibold w-8">{phone.healthScore}</span><HealthScoreBar score={phone.healthScore} /></div></td>
                                    <td className="px-6 py-4">{timeAgo(phone.lastUsedTimestamp)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <AssignPoolModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSave={handleSavePoolAssignment} onCreateAndSave={handleCreateAndSavePool} numberPools={numberPools} selectedPhoneIds={selectedPhoneIds} brandingProfiles={brandingProfiles} />
        </div>
    );
};

export default PhoneNumberManager;