import React, { useState, useEffect } from 'react';
import { BillingMeterEntry, ResilienceStatus, ProposedRuleUpdate, JurisdictionRule, IconName } from '../types';
import UsageSummaryWidget from './settings/UsageSummaryWidget';
import WebhookTester from './settings/WebhookTester';
import ResilienceStatusWidget from './settings/ResilienceStatusWidget';
import ComplianceUpdates from './settings/ComplianceUpdates';
import ApiIntegrationGuide from './settings/ApiIntegrationGuide';
import { Icon } from './Icon';
import { apiService } from '../services/apiService';

type SettingsTab = 'general' | 'compliance' | 'api';

const SettingsSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-12 w-full bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
        <div className="h-64 w-full bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
    </div>
);

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('api');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for data fetched from backend
    const [billingLog, setBillingLog] = useState<BillingMeterEntry[]>([]);
    const [accountCredits, setAccountCredits] = useState(0);
    const [resilienceStatus, setResilienceStatus] = useState<ResilienceStatus | null>(null);
    const [proposedRuleUpdates, setProposedRuleUpdates] = useState<ProposedRuleUpdate[]>([]);
    const [jurisdictionRules, setJurisdictionRules] = useState<JurisdictionRule[]>([]);
    const [isAutoComplianceEnabled, setIsAutoComplianceEnabled] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [settingsData, complianceData] = await Promise.all([
                    apiService.getSettingsData(),
                    apiService.getComplianceData()
                ]);

                setBillingLog(settingsData.billingLog);
                setAccountCredits(settingsData.accountCredits);
                setResilienceStatus(settingsData.resilienceStatus);
                setProposedRuleUpdates(settingsData.proposedRuleUpdates);
                setJurisdictionRules(complianceData.jurisdictionRules);

            } catch (err: any) {
                setError(err.message || "Failed to load settings data.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const TabButton: React.FC<{ tabName: SettingsTab; label: string; icon: IconName }> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tabName
                    ? 'bg-sky-100 text-sky-600 dark:bg-brand-accent/20 dark:text-brand-accent'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
        >
            <Icon name={icon} className="h-5 w-5" />
            {label}
        </button>
    );

    const renderContent = () => {
        if (loading) return <SettingsSkeleton />;
        if (error) return <div className="text-red-500 text-center">{error}</div>;

        switch (activeTab) {
            case 'general':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2">
                            <UsageSummaryWidget billingLog={billingLog} accountCredits={accountCredits} />
                        </div>
                        <WebhookTester />
                        {resilienceStatus && (
                            <div className="lg:col-span-2">
                                <ResilienceStatusWidget status={resilienceStatus} />
                            </div>
                        )}
                    </div>
                );
            case 'compliance':
                return (
                    <ComplianceUpdates 
                        jurisdictionRules={jurisdictionRules}
                        setJurisdictionRules={setJurisdictionRules}
                        proposedRuleUpdates={proposedRuleUpdates}
                        setProposedRuleUpdates={setProposedRuleUpdates}
                        isAutoComplianceEnabled={isAutoComplianceEnabled}
                        setIsAutoComplianceEnabled={setIsAutoComplianceEnabled}
                    />
                );
            case 'api':
                return <ApiIntegrationGuide />;
            default:
                return null;
        }
    };

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Platform Settings &amp; Configuration</h2>
            
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <TabButton tabName="general" label="General" icon="settings" />
                    <TabButton tabName="compliance" label="Compliance" icon="shield-check" />
                    <TabButton tabName="api" label="API Guide" icon="zap" />
                </nav>
            </div>
            
            <div className="mt-6">
                {renderContent()}
            </div>
        </section>
    );
};

export default Settings;
