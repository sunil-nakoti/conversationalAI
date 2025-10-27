import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { JurisdictionRule, LoginEvent, PreDialScrubLogEntry, EmergingRiskTrend, IconName, AvailablePhoneNumber, NumberPool, CallingCadence, BrandingProfile, BrandedCallingSettings, ConversationalAuditEntry } from '../types';
import JurisdictionManager from './intelligence/JurisdictionManager';
import StateManagement from './compliance/StateManagement';
import EmergingRisks from './compliance/EmergingRisks';
import NumberReputation from './compliance/NumberReputation';
import BrandingManager from './intelligence/BrandingManager';
import ConversationalAudit from './compliance/ConversationalAudit';
import { apiService } from '../services/apiService';

type ComplianceTab = 'jurisdiction' | 'smart-pool' | 'states' | 'risks' | 'branding' | 'audit';

const ComplianceDeskSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-10 w-1/2 bg-slate-200 dark:bg-brand-secondary rounded-md"></div>
        <div className="h-12 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
        <div className="h-96 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
    </div>
);


interface ComplianceDeskProps {
    onPreviewPaymentPage: (profileId: string) => void;
}

const ComplianceDesk: React.FC<ComplianceDeskProps> = ({ onPreviewPaymentPage }) => {
    const [activeTab, setActiveTab] = useState<ComplianceTab>('audit');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [jurisdictionRules, setJurisdictionRules] = useState<JurisdictionRule[]>([]);
    const [phonePool, setPhonePool] = useState<AvailablePhoneNumber[]>([]);
    const [numberPools, setNumberPools] = useState<NumberPool[]>([]);
    const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>([]);
    const [emergingRisks, setEmergingRisks] = useState<EmergingRiskTrend[]>([]);
    const [scrubLog, setScrubLog] = useState<PreDialScrubLogEntry[]>([]);
    const [conversationalAudit, setConversationalAudit] = useState<ConversationalAuditEntry[]>([]);
    
    // Settings are now fetched from their own dedicated endpoint
    const [settings, setSettings] = useState({
        callingCadence: 'human-simulated' as CallingCadence,
        isBehaviorSimulationEnabled: true,
        incubationHours: 48,
        brandedCallingSettings: { isEnabled: true, defaultBrandingProfileId: null } as BrandedCallingSettings
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [complianceData, settingsData] = await Promise.all([
                    apiService.getComplianceData(),
                    apiService.getSettings()
                ]);

                setJurisdictionRules(complianceData.jurisdictionRules);
                setPhonePool(complianceData.phonePool);
                setNumberPools(complianceData.numberPools);
                setBrandingProfiles(complianceData.brandingProfiles);
                setEmergingRisks(complianceData.emergingRisks);
                setScrubLog(complianceData.scrubLog);
                setConversationalAudit(complianceData.conversationalAudit);
                
                if (settingsData) {
                    setSettings({
                        callingCadence: settingsData.callingCadence,
                        isBehaviorSimulationEnabled: settingsData.isBehaviorSimulationEnabled,
                        incubationHours: settingsData.incubationHours,
                        brandedCallingSettings: settingsData.brandedCallingSettings
                    });
                }
                
                if (complianceData.brandingProfiles.length > 0 && !settingsData.brandedCallingSettings.defaultBrandingProfileId) {
                    setSettings(prev => ({ ...prev, brandedCallingSettings: {...prev.brandedCallingSettings, defaultBrandingProfileId: complianceData.brandingProfiles[0].id }}));
                }
            } catch (err: any) {
                setError(err.message || "Failed to load compliance data.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSettingsChange = async (newSettings: Partial<typeof settings>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        try {
            await apiService.updateSettings(updatedSettings);
        } catch (err) {
            alert('Failed to save settings.');
            // Optionally revert state
        }
    };


    const renderContent = () => {
        if (loading) return <ComplianceDeskSkeleton />;
        if (error) return <div className="text-red-500 text-center">{error}</div>;

        switch (activeTab) {
            case 'audit': return <ConversationalAudit auditData={conversationalAudit} />;
            case 'jurisdiction': return <JurisdictionManager rules={jurisdictionRules} setRules={setJurisdictionRules} />;
            case 'smart-pool': return <NumberReputation 
                phonePool={phonePool}
                setPhonePool={setPhonePool}
                numberPools={numberPools}
                setNumberPools={setNumberPools}
                callingCadence={settings.callingCadence}
                // FIX: Add type assertion to resolve SetStateAction mismatch.
                setCallingCadence={(val) => handleSettingsChange({ callingCadence: val as CallingCadence })}
                isBehaviorSimulationEnabled={settings.isBehaviorSimulationEnabled}
                // FIX: Add type assertion to resolve SetStateAction mismatch.
                setIsBehaviorSimulationEnabled={(val) => handleSettingsChange({ isBehaviorSimulationEnabled: val as boolean })}
                incubationHours={settings.incubationHours}
                // FIX: Add type assertion to resolve SetStateAction mismatch.
                setIncubationHours={(val) => handleSettingsChange({ incubationHours: val as number })}
                brandingProfiles={brandingProfiles}
                logEntries={scrubLog} 
            />;
            case 'states': return <StateManagement />;
            case 'risks': return <EmergingRisks trends={emergingRisks} setTrends={setEmergingRisks} />;
            case 'branding': return <BrandingManager 
                                        profiles={brandingProfiles} 
                                        setProfiles={setBrandingProfiles} 
                                        brandedCallingSettings={settings.brandedCallingSettings}
                                        // FIX: Add type assertion to resolve SetStateAction mismatch.
                                        setBrandedCallingSettings={(val) => handleSettingsChange({ brandedCallingSettings: val as BrandedCallingSettings })}
                                        onPreviewPaymentPage={onPreviewPaymentPage}
                                    />;
            default: return null;
        }
    };
    
    const TabButton: React.FC<{ tabName: ComplianceTab; label: string; icon: IconName }> = ({ tabName, label, icon }) => (
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

    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Compliance Desk</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and manage all compliance-related activities and rules.</p>
            </div>
             <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <nav className="flex flex-wrap gap-2" aria-label="Tabs">
                    <TabButton tabName="audit" label="Conversational Audit" icon="user-round-search" />
                    <TabButton tabName="jurisdiction" label="Jurisdiction Rules" icon="gavel" />
                    <TabButton tabName="smart-pool" label="Smart Pool" icon="server-cog" />
                    <TabButton tabName="branding" label="Branding" icon="building" />
                    <TabButton tabName="states" label="State Management" icon="map-pin" />
                    <TabButton tabName="risks" label="Emerging Risks" icon="trending-up" />
                </nav>
            </div>
            <div>
                {renderContent()}
            </div>
        </section>
    );
};

export default ComplianceDesk;