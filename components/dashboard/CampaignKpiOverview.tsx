import React, { useState, useMemo } from 'react';
import { CampaignKpiSet, CampaignInfo, Kpi } from '../../types';
import KpiCard from '../KpiCard';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';


interface CampaignKpiOverviewProps {
    kpiData: CampaignKpiSet;
    campaigns: CampaignInfo[];
}

const CampaignKpiOverview: React.FC<CampaignKpiOverviewProps> = ({ kpiData, campaigns }) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');

    const campaignKpis: Kpi[] = useMemo(() => {
        const selectedData = kpiData[selectedCampaignId] || { rpcRate: 0, ptpRate: 0, paymentsMade: 0, totalCollected: 0 };

        return [
            {
                label: 'RPC Rate',
                value: `${selectedData.rpcRate.toFixed(1)}%`,
                description: "Right-Party Contact Rate for this campaign.",
                icon: 'phone',
                color: 'accent',
            },
            {
                label: 'PTP Rate',
                value: `${selectedData.ptpRate.toFixed(1)}%`,
                description: "Promise-to-Pay Rate from successful contacts.",
                icon: 'check',
                color: 'success',
            },
            {
                label: 'Payments Made',
                value: selectedData.paymentsMade.toLocaleString(),
                description: "Total number of payments received.",
                icon: 'shopping-cart',
                color: 'warning',
            },
            {
                label: 'Total Collected',
                value: `$${selectedData.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                description: "Total dollar amount collected for this campaign.",
                icon: 'dollar',
                color: 'success',
            },
        ];
    }, [selectedCampaignId, kpiData]);

    if (campaigns.length === 0) {
        return null;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Campaign Performance</h2>
                    <Tooltip content="Review real-time performance metrics for a selected campaign.">
                        <Icon name="info" className="h-5 w-5 text-slate-400" />
                    </Tooltip>
                </div>
                <div className="w-full max-w-xs">
                    <select
                        value={selectedCampaignId}
                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white font-semibold focus:ring-brand-accent focus:border-brand-accent"
                    >
                        {campaigns.map(campaign => (
                            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {campaignKpis.map((kpi) => (
                    <KpiCard key={kpi.label} {...kpi} />
                ))}
            </div>
        </>
    );
};

export default CampaignKpiOverview;