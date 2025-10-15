

import React from 'react';
// FIX: Corrected import path for types.ts
import { FunnelStage, LoginEvent } from '../../types';
import { Icon } from '../Icon';
import LiveLoginNotifications from '../notifications/LiveLoginNotifications';

interface CampaignFunnelProps {
    data: FunnelStage[];
    loginEvents: LoginEvent[];
}

const CampaignFunnel: React.FC<CampaignFunnelProps> = ({ data, loginEvents }) => {
    
    const calculateConversion = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current / previous) * 100).toFixed(1);
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <Icon name="funnel" className="h-6 w-6 text-sky-600 dark:text-brand-accent"/>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Real-time Campaign Funnel</h3>
                </div>
                <LiveLoginNotifications loginEvents={loginEvents} />
            </div>
            <div className="space-y-4">
                {data.map((stage, index) => {
                    const parentStage = stage.parentStageIndex !== undefined 
                        ? data[stage.parentStageIndex] 
                        : (index > 0 ? data[index - 1] : null);
                    
                    const parentValue = parentStage ? parentStage.value : stage.value;
                    const conversionRate = parentStage ? calculateConversion(stage.value, parentValue) : 100;
                    const widthPercentage = (stage.value / data[0].value) * 100;

                    return (
                        <div key={stage.name}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-medium text-slate-600 dark:text-slate-300">{stage.name}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{stage.value.toLocaleString()}</span>
                            </div>
                            <div className="relative h-6 bg-slate-200 dark:bg-slate-700/50 rounded">
                                <div 
                                    className="h-6 rounded absolute" 
                                    style={{ width: `${widthPercentage}%`, backgroundColor: stage.color }}
                                ></div>
                                {parentStage && (
                                    <div className="absolute -top-5 -right-1 flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shadow">
                                        <span className="text-slate-800 dark:text-slate-200">{conversionRate}%</span>
                                        <span className="text-slate-500 dark:text-slate-400">of {parentStage.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CampaignFunnel;