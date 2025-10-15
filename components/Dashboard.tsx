import React, { useState, useEffect } from 'react';
import { FunnelStage, ComplianceAlert, PtpEntry, Kpi, CampaignKpiSet, CampaignInfo, LoginEvent } from '../types';
import CampaignFunnel from './dashboard/CampaignFunnel';
import ComplianceAlerts from './dashboard/ComplianceAlerts';
import TodaysPtps from './dashboard/TodaysPtps';
import { Icon } from './Icon';
import KpiCard from './KpiCard';
import Tooltip from './Tooltip';
import CampaignKpiOverview from './dashboard/CampaignKpiOverview';
import { apiService } from '../services/apiService';

const DashboardSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
            <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
            <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
            <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
        </div>
        <div className="bg-slate-200 dark:bg-brand-secondary h-40 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-200 dark:bg-brand-secondary h-64 rounded-lg"></div>
            <div className="space-y-6">
                <div className="bg-slate-200 dark:bg-brand-secondary h-56 rounded-lg"></div>
                <div className="bg-slate-200 dark:bg-brand-secondary h-56 rounded-lg"></div>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [kpis, setKpis] = useState<Kpi[]>([]);
    const [funnelData, setFunnelData] = useState<FunnelStage[]>([]);
    const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
    const [ptps, setPtps] = useState<PtpEntry[]>([]);
    const [campaignKpis, setCampaignKpis] = useState<CampaignKpiSet>({});
    const [activeCampaigns, setActiveCampaigns] = useState<CampaignInfo[]>([]);
    const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await apiService.getDashboardData();
                setKpis(data.kpis);
                setFunnelData(data.funnelData);
                setAlerts(data.alerts);
                setPtps(data.ptps);
                setCampaignKpis(data.campaignKpis.kpiData);
                setActiveCampaigns(data.campaignKpis.campaigns);
                setLoginEvents(data.loginEvents);
            } catch (err: any) {
                setError(err.message || "Failed to load dashboard data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <section>
            {loading ? (
                <DashboardSkeleton />
            ) : error ? (
                <div className="flex items-center justify-center h-96 bg-white dark:bg-brand-secondary rounded-lg border-2 border-dashed border-red-400 dark:border-brand-danger/50">
                    <div className="text-center">
                        <Icon name="warning" className="h-12 w-12 mx-auto text-red-500 dark:text-brand-danger mb-3" />
                        <p className="text-red-600 dark:text-red-300">{error}</p>
                    </div>
                </div>
            ) : (
                <>
                    <CampaignKpiOverview kpiData={campaignKpis} campaigns={activeCampaigns} />
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Actionable Intelligence Command Center</h2>
                        <Tooltip content="This is your main dashboard. It provides a real-time, high-level overview of all campaign performance and compliance metrics.">
                            <Icon name="info" className="h-5 w-5 text-slate-400" />
                        </Tooltip>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {kpis.map((kpi) => (
                            <KpiCard key={kpi.label} {...kpi} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <CampaignFunnel data={funnelData} loginEvents={loginEvents} />
                        </div>
                        <div className="space-y-6">
                            <ComplianceAlerts alerts={alerts} />
                            <TodaysPtps ptps={ptps} />
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default Dashboard;
