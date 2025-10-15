import React, { useState, useMemo } from 'react';
import { Icon } from '../Icon';
import { StateData, Region } from '../../types';

const allStatesData: StateData[] = [
    { code: 'AL', name: 'Alabama', region: 'South', accountCount: 4704, status: 'Included' },
    { code: 'AK', name: 'Alaska', region: 'West', accountCount: 63, status: 'Included' },
    { code: 'AZ', name: 'Arizona', region: 'West', accountCount: 782, status: 'Included' },
    { code: 'AR', name: 'Arkansas', region: 'South', accountCount: 1960, status: 'Included' },
    { code: 'CA', name: 'California', region: 'West', accountCount: 6338, status: 'Included' },
    { code: 'CO', name: 'Colorado', region: 'West', accountCount: 266, status: 'Included' },
    { code: 'CT', name: 'Connecticut', region: 'Northeast', accountCount: 251, status: 'Included' },
    { code: 'DE', name: 'Delaware', region: 'South', accountCount: 88, status: 'Included' },
    { code: 'FL', name: 'Florida', region: 'South', accountCount: 3456, status: 'Included' },
    { code: 'GA', name: 'Georgia', region: 'South', accountCount: 2109, status: 'Included' },
    { code: 'HI', name: 'Hawaii', region: 'West', accountCount: 121, status: 'Included' },
    { code: 'ID', name: 'Idaho', region: 'West', accountCount: 301, status: 'Included' },
    { code: 'IL', name: 'Illinois', region: 'Midwest', accountCount: 2890, status: 'Included' },
    { code: 'IN', name: 'Indiana', region: 'Midwest', accountCount: 1543, status: 'Included' },
    { code: 'IA', name: 'Iowa', region: 'Midwest', accountCount: 876, status: 'Included' },
    { code: 'KS', name: 'Kansas', region: 'Midwest', accountCount: 765, status: 'Included' },
    { code: 'KY', name: 'Kentucky', region: 'South', accountCount: 1234, status: 'Included' },
    { code: 'LA', name: 'Louisiana', region: 'South', accountCount: 1100, status: 'Included' },
    { code: 'ME', name: 'Maine', region: 'Northeast', accountCount: 210, status: 'Included' },
    { code: 'MD', name: 'Maryland', region: 'South', accountCount: 980, status: 'Included' },
    { code: 'MA', name: 'Massachusetts', region: 'Northeast', accountCount: 1150, status: 'Included' },
    { code: 'MI', name: 'Michigan', region: 'Midwest', accountCount: 2200, status: 'Included' },
    { code: 'MN', name: 'Minnesota', region: 'Midwest', accountCount: 1300, status: 'Included' },
    { code: 'MS', name: 'Mississippi', region: 'South', accountCount: 990, status: 'Included' },
    { code: 'MO', name: 'Missouri', region: 'Midwest', accountCount: 1450, status: 'Included' },
    { code: 'MT', name: 'Montana', region: 'West', accountCount: 150, status: 'Included' },
    { code: 'NE', name: 'Nebraska', region: 'Midwest', accountCount: 450, status: 'Included' },
    { code: 'NV', name: 'Nevada', region: 'West', accountCount: 550, status: 'Included' },
    { code: 'NH', name: 'New Hampshire', region: 'Northeast', accountCount: 220, status: 'Included' },
    { code: 'NJ', name: 'New Jersey', region: 'Northeast', accountCount: 1800, status: 'Included' },
    { code: 'NM', name: 'New Mexico', region: 'West', accountCount: 350, status: 'Included' },
    { code: 'NY', name: 'New York', region: 'Northeast', accountCount: 3200, status: 'Included' },
    { code: 'NC', name: 'North Carolina', region: 'South', accountCount: 2500, status: 'Included' },
    { code: 'ND', name: 'North Dakota', region: 'Midwest', accountCount: 110, status: 'Included' },
    { code: 'OH', name: 'Ohio', region: 'Midwest', accountCount: 2600, status: 'Included' },
    { code: 'OK', name: 'Oklahoma', region: 'South', accountCount: 950, status: 'Included' },
    { code: 'OR', name: 'Oregon', region: 'West', accountCount: 750, status: 'Included' },
    { code: 'PA', name: 'Pennsylvania', region: 'Northeast', accountCount: 2900, status: 'Included' },
    { code: 'RI', name: 'Rhode Island', region: 'Northeast', accountCount: 180, status: 'Included' },
    { code: 'SC', name: 'South Carolina', region: 'South', accountCount: 1300, status: 'Included' },
    { code: 'SD', name: 'South Dakota', region: 'Midwest', accountCount: 130, status: 'Included' },
    { code: 'TN', name: 'Tennessee', region: 'South', accountCount: 1600, status: 'Included' },
    { code: 'TX', name: 'Texas', region: 'South', accountCount: 5500, status: 'Included' },
    { code: 'UT', name: 'Utah', region: 'West', accountCount: 600, status: 'Included' },
    { code: 'VT', name: 'Vermont', region: 'Northeast', accountCount: 90, status: 'Included' },
    { code: 'VA', name: 'Virginia', region: 'South', accountCount: 1700, status: 'Included' },
    { code: 'WA', name: 'Washington', region: 'West', accountCount: 1400, status: 'Included' },
    { code: 'WV', name: 'West Virginia', region: 'South', accountCount: 400, status: 'Included' },
    { code: 'WI', name: 'Wisconsin', region: 'Midwest', accountCount: 1200, status: 'Included' },
    { code: 'WY', name: 'Wyoming', region: 'West', accountCount: 70, status: 'Included' },
    { code: 'DC', name: 'District of Columbia', region: 'South', accountCount: 150, status: 'Included' },
  ];
  
const regions: Region[] = ['Northeast', 'Midwest', 'South', 'West'];

const StateManagement: React.FC = () => {
    const [states, setStates] = useState<StateData[]>(allStatesData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
    
    const handleToggleStatus = (stateCode: string) => {
        setStates(currentStates => 
            currentStates.map(s => 
                s.code === stateCode 
                    ? { ...s, status: s.status === 'Included' ? 'Excluded' : 'Included' }
                    : s
            )
        );
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
