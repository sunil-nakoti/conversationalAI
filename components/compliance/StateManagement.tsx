import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '../Icon';
import { StateData, Region } from '../../types';
import { apiService } from '../../services/apiService';

const allStatesData: Omit<StateData, 'accountCount' | 'status'>[] = [
    { code: 'AL', name: 'Alabama', region: 'South' },
    { code: 'AK', name: 'Alaska', region: 'West' },
    { code: 'AZ', name: 'Arizona', region: 'West' },
    { code: 'AR', name: 'Arkansas', region: 'South' },
    { code: 'CA', name: 'California', region: 'West' },
    { code: 'CO', name: 'Colorado', region: 'West' },
    { code: 'CT', name: 'Connecticut', region: 'Northeast' },
    { code: 'DE', name: 'Delaware', region: 'South' },
    { code: 'FL', name: 'Florida', region: 'South' },
    { code: 'GA', name: 'Georgia', region: 'South' },
    { code: 'HI', name: 'Hawaii', region: 'West' },
    { code: 'ID', name: 'Idaho', region: 'West' },
    { code: 'IL', name: 'Illinois', region: 'Midwest' },
    { code: 'IN', name: 'Indiana', region: 'Midwest' },
    { code: 'IA', name: 'Iowa', region: 'Midwest' },
    { code: 'KS', name: 'Kansas', region: 'Midwest' },
    { code: 'KY', name: 'Kentucky', region: 'South' },
    { code: 'LA', name: 'Louisiana', region: 'South' },
    { code: 'ME', name: 'Maine', region: 'Northeast' },
    { code: 'MD', name: 'Maryland', region: 'South' },
    { code: 'MA', name: 'Massachusetts', region: 'Northeast' },
    { code: 'MI', name: 'Michigan', region: 'Midwest' },
    { code: 'MN', name: 'Minnesota', region: 'Midwest' },
    { code: 'MS', name: 'Mississippi', region: 'South' },
    { code: 'MO', name: 'Missouri', region: 'Midwest' },
    { code: 'MT', name: 'Montana', region: 'West' },
    { code: 'NE', name: 'Nebraska', region: 'Midwest' },
    { code: 'NV', name: 'Nevada', region: 'West' },
    { code: 'NH', name: 'New Hampshire', region: 'Northeast' },
    { code: 'NJ', name: 'New Jersey', region: 'Northeast' },
    { code: 'NM', name: 'New Mexico', region: 'West' },
    { code: 'NY', name: 'New York', region: 'Northeast' },
    { code: 'NC', name: 'North Carolina', region: 'South' },
    { code: 'ND', name: 'North Dakota', region: 'Midwest' },
    { code: 'OH', name: 'Ohio', region: 'Midwest' },
    { code: 'OK', name: 'Oklahoma', region: 'South' },
    { code: 'OR', name: 'Oregon', region: 'West' },
    { code: 'PA', name: 'Pennsylvania', region: 'Northeast' },
    { code: 'RI', name: 'Rhode Island', region: 'Northeast' },
    { code: 'SC', name: 'South Carolina', region: 'South' },
    { code: 'SD', name: 'South Dakota', region: 'Midwest' },
    { code: 'TN', name: 'Tennessee', region: 'South' },
    { code: 'TX', name: 'Texas', region: 'South' },
    { code: 'UT', name: 'Utah', region: 'West' },
    { code: 'VT', name: 'Vermont', region: 'Northeast' },
    { code: 'VA', name: 'Virginia', region: 'South' },
    { code: 'WA', name: 'Washington', region: 'West' },
    { code: 'WV', name: 'West Virginia', region: 'South' },
    { code: 'WI', name: 'Wisconsin', region: 'Midwest' },
    { code: 'WY', name: 'Wyoming', region: 'West' },
    { code: 'DC', name: 'District of Columbia', region: 'South' },
  ];
  
const regions: Region[] = ['Northeast', 'Midwest', 'South', 'West'];

const StateManagement: React.FC = () => {
    const [states, setStates] = useState<StateData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStateData = async () => {
            try {
                setIsLoading(true);
                const settings = await apiService.getStateManagement();
                const mergedStates = allStatesData.map(staticState => {
                    const savedState = settings.states.find(s => s.code === staticState.code);
                    return {
                        ...staticState,
                        status: savedState ? savedState.status : 'Included',
                        accountCount: savedState ? (savedState as any).accountCount : 0,
                    };
                });
                setStates(mergedStates as StateData[]);
            } catch (err) {
                setError('Failed to load state management settings.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStateData();
    }, []);

    const handleToggleStatus = async (stateCode: string) => {
        const updatedStates = states.map(s =>
            s.code === stateCode
                ? { ...s, status: s.status === 'Included' ? 'Excluded' : 'Included' }
                : s
        );
        setStates(updatedStates);

        try {
            const statesToSave = updatedStates.map(({ code, status }) => ({ code, status }));
            await apiService.updateStateManagement(statesToSave);
        } catch (err) {
            setError('Failed to save changes. Please try again.');
            // Optionally, revert the state change
            setStates(states);
            console.error(err);
        }
    };

    const filteredStates = useMemo(() => {
        return states.filter(state => {
            const matchesRegion = selectedRegion === 'All' || state.region === selectedRegion;
            const matchesSearch = searchTerm === '' || 
                state.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                state.code.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRegion && matchesSearch;
        });
    }, [states, searchTerm, selectedRegion]);

    const includedCount = useMemo(() => states.filter(s => s.status === 'Included').length, [states]);

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-lg bg-gradient-to-r from-sky-500/20 to-indigo-500/20 dark:from-sky-900/50 dark:to-indigo-900/50 text-slate-800 dark:text-white">
                <h2 className="text-xl font-bold">State Management</h2>
                <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">Select which states you want to work accounts in. Deselecting a state will mark all accounts in that state as "Do Not Call".</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filter Panel */}
                <div className="lg:col-span-1 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50 h-fit">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Filter Options</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Search States</label>
                            <div className="relative mt-1">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by state name or code..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-2 pl-10 pr-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter by Region</label>
                            <div className="space-y-2 mt-1">
                                <button onClick={() => setSelectedRegion('All')} className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${selectedRegion === 'All' ? 'bg-sky-100 dark:bg-brand-accent/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                    <div className="flex items-center gap-2 font-semibold ${selectedRegion === 'All' ? 'text-sky-700 dark:text-brand-accent' : 'text-slate-700 dark:text-white'}">
                                        <Icon name="globe" className="h-5 w-5" />
                                        <span>All Regions</span>
                                    </div>
                                </button>
                                {regions.map(region => (
                                    <button key={region} onClick={() => setSelectedRegion(region)} className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${selectedRegion === region ? 'bg-sky-100 dark:bg-brand-accent/20' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                                        <div className="flex items-center gap-2 font-semibold ${selectedRegion === region ? 'text-sky-700 dark:text-brand-accent' : 'text-slate-700 dark:text-white'}">
                                            <Icon name="map-pin" className="h-5 w-5" />
                                            <span>{region}</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${selectedRegion === region ? 'bg-brand-accent' : 'border-2 border-slate-300 dark:border-slate-500'}`}>
                                            {selectedRegion === region && <Icon name="check" className="h-4 w-4 text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* States Table */}
                <div className="lg:col-span-2 bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">States</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{includedCount}/{states.length} States Selected</p>
                    </div>
                    <div className="overflow-auto max-h-[600px]">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                            <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">State</th>
                                    <th scope="col" className="px-6 py-3">Account Count</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredStates.map(state => (
                                    <tr key={state.code}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">{state.code}</div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">{state.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{state.region} Region</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{state.accountCount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleToggleStatus(state.code)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                                                    state.status === 'Included' 
                                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/30 hover:bg-green-100 dark:hover:bg-green-500/20'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                }`}
                                            >
                                                <Icon name="check" className={`h-4 w-4 ${state.status === 'Included' ? '' : 'opacity-0'}`} />
                                                {state.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StateManagement;
