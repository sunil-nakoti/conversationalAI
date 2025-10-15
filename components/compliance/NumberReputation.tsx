import React, { useState } from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { AvailablePhoneNumber, NumberPool, CallingCadence, BrandingProfile, PreDialScrubLogEntry } from '../../types';
import PhoneNumberManager from './PhoneNumberManager';
import ScrubLog from './ScrubLog';

interface NumberReputationProps {
    phonePool: AvailablePhoneNumber[];
    setPhonePool: React.Dispatch<React.SetStateAction<AvailablePhoneNumber[]>>;
    numberPools: NumberPool[];
    setNumberPools: React.Dispatch<React.SetStateAction<NumberPool[]>>;
    callingCadence: CallingCadence;
    setCallingCadence: React.Dispatch<React.SetStateAction<CallingCadence>>;
    isBehaviorSimulationEnabled: boolean;
    setIsBehaviorSimulationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    incubationHours: number;
    setIncubationHours: React.Dispatch<React.SetStateAction<number>>;
    brandingProfiles: BrandingProfile[];
    logEntries: PreDialScrubLogEntry[];
}

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


const NumberReputation: React.FC<NumberReputationProps> = (props) => {
    const { 
        phonePool, setPhonePool, numberPools, setNumberPools,
        callingCadence, setCallingCadence, isBehaviorSimulationEnabled, 
        setIsBehaviorSimulationEnabled, incubationHours, setIncubationHours,
        brandingProfiles, logEntries
    } = props;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
                 <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Autonomous Reputation Management</h3>
                    <Tooltip content="Configure the autonomous system that manages your outbound phone number pool to maximize deliverability and minimize spam flags.">
                        <Icon name="info" className="h-5 w-5 text-slate-400" />
                    </Tooltip>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label htmlFor="dialing-cadence" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Dialing Cadence</label>
                            <Tooltip content="Controls call speed. 'Human-Simulated' is best for reputation. 'Aggressive' maximizes volume. 'Standard' is balanced.">
                                <Icon name="info" className="h-4 w-4 text-slate-400" />
                            </Tooltip>
                        </div>
                        <select
                            id="dialing-cadence"
                            value={callingCadence}
                            onChange={(e) => setCallingCadence(e.target.value as CallingCadence)}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                        >
                            <option value="human-simulated">Human-Simulated</option>
                            <option value="aggressive">Aggressive</option>
                            <option value="standard">Standard</option>
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">"Human-Simulated" is recommended to improve reputation.</p>
                    </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                            <label htmlFor="incubation-hours" className="block text-sm font-medium text-slate-600 dark:text-slate-300">New Number Warm-up Period</label>
                            <Tooltip content="Duration a new number is 'warmed up' with low-volume activity before active dialing. This builds a positive reputation with carriers.">
                                <Icon name="info" className="h-4 w-4 text-slate-400" />
                            </Tooltip>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                id="incubation-hours"
                                value={incubationHours}
                                onChange={(e) => setIncubationHours(parseInt(e.target.value, 10) || 0)}
                                className="w-full p-2 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 dark:text-slate-400">hours</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Duration for low-volume warm-up before activation.</p>
                    </div>
                    <div className="pt-5">
                        <ToggleSwitch
                            label="Enable Call Behavior Simulation"
                            enabled={isBehaviorSimulationEnabled}
                            setEnabled={setIsBehaviorSimulationEnabled}
                            tooltip="When enabled, uses a small percentage of your number pool to generate realistic inbound/outbound 'chatter,' which can significantly improve number reputation."
                        />
                    </div>
                </div>
            </div>
            
            <PhoneNumberManager 
                phonePool={phonePool}
                setPhonePool={setPhonePool}
                numberPools={numberPools}
                setNumberPools={setNumberPools}
                brandingProfiles={brandingProfiles}
                incubationHours={incubationHours}
            />

            <ScrubLog logEntries={logEntries} />
        </div>
    );
};

export default NumberReputation;
