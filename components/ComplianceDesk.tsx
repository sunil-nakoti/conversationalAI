import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { JurisdictionRule, LoginEvent, PreDialScrubLogEntry, EmergingRiskTrend, IconName, AvailablePhoneNumber, NumberPool, CallingCadence, BrandingProfile, BrandedCallingSettings } from '../types';
import JurisdictionManager from './intelligence/JurisdictionManager';
import StateManagement from './compliance/StateManagement';
import EmergingRisks from './compliance/EmergingRisks';
import NumberReputation from './compliance/NumberReputation';
import BrandingManager from './intelligence/BrandingManager';
import ConversationalAudit from './compliance/ConversationalAudit';
import { apiService } from '../services/apiService';

type ComplianceTab = 'jurisdiction' | 'smart-pool' | 'states' | 'risks' | 'branding' | 'audit';

// Mocks that would come from a real-time source or different endpoint
const mockScrubLog: PreDialScrubLogEntry[] = [
    { id: 'sl1', checkTimestamp: new Date(Date.now() - 3600000).toISOString(), phoneNumber: '(555) 123-4567', accountNumber: 'ACC-1001', reassignedStatus: 'Clear', litigatorStatus: 'Clear', wasBlocked: false, blockReason: null },
    { id: 'sl2', checkTimestamp: new Date(Date.now() - 7200000).toISOString(), phoneNumber: '(555) 987-6543', accountNumber: 'ACC-2034', reassignedStatus: 'Possible Reassign', litigatorStatus: 'Clear', wasBlocked: true, blockReason: 'Possible reassigned number detected.' },
];
const mockEmergingRisks: EmergingRiskTrend[] = [
    { id: 'er1', title: "Mentions of 'Credit Repair' Services", detectedDate: new Date(Date.now() - 86400000 * 3).toISOString(), summary: "A 15% increase in debtors mentioning third-party credit repair services during calls.", keywords: ['credit repair', 'fix my credit'] },
];

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

    // All state previously passed as props is now managed here
    const [jurisdictionRules, setJurisdictionRules] = useState<JurisdictionRule[]>([]);
    const [phonePool, setPhonePool] = useState<AvailablePhoneNumber[]>([]);
    const [numberPools, setNumberPools] = useState<NumberPool[]>([]);
    const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>([]);
    
    // Settings previously in App.tsx
    const [callingCadence, setCallingCadence] = useState<CallingCadence>('human-simulated');
    const [isBehaviorSimulationEnabled, setIsBehaviorSimulationEnabled] = useState(true);
    const [incubationHours, setIncubationHours] = useState(48);
    const [brandedCallingSettings, setBrandedCallingSettings] = useState<BrandedCallingSettings>({ isEnabled: true, defaultBrandingProfileId: null });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await apiService.getComplianceData();
                setJurisdictionRules(data.jurisdictionRules);
                setPhonePool(data.phonePool);
                setNumberPools(data.numberPools);
                setBrandingProfiles(data.brandingProfiles);
                if (data.brandingProfiles.length > 0) {
                    setBrandedCallingSettings(prev => ({ ...prev, defaultBrandingProfileId: data.brandingProfiles[0].id }));
                }
            } catch (err: any) {
                setError(err.message || "Failed to load compliance data.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);


    const renderContent = () => {
        if (loading) return <ComplianceDeskSkeleton />;
        if (error) return <div className="text-red-500 text-center">{error}</div>;

        switch (activeTab) {
            case 'audit': return <ConversationalAudit />;
            case 'jurisdiction': return <JurisdictionManager rules={jurisdictionRules} setRules={setJurisdictionRules} />;
            case 'smart-pool': return <NumberReputation 
                phonePool={phonePool}
                setPhonePool={setPhonePool}
                numberPools={numberPools}
                setNumberPools={setNumberPools}
                callingCadence={callingCadence}
                setCallingCadence={setCallingCadence}
                isBehaviorSimulationEnabled={isBehaviorSimulationEnabled}
                setIsBehaviorSimulationEnabled={setIsBehaviorSimulationEnabled}
                incubationHours={incubationHours}
                setIncubationHours={setIncubationHours}
                brandingProfiles={brandingProfiles}
                logEntries={mockScrubLog} 
            />;
            case 'states': return <StateManagement />;
            case 'risks': return <EmergingRisks trends={mockEmergingRisks} />;
            case 'branding': return <BrandingManager 
                                        profiles={brandingProfiles} 
                                        setProfiles={setBrandingProfiles} 
                                        brandedCallingSettings={brandedCallingSettings}
                                        setBrandedCallingSettings={setBrandedCallingSettings}
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
                <nav className="flex flex-wrap space-x-2" aria-label="Tabs">
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
