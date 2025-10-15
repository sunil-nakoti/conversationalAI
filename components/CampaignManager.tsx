import React, { useState, useEffect } from 'react';
import { Portfolio, Debtor, DebtorStatus, SavedPlaybook, AvailablePhoneNumber, SelectableAIAgent, PortfolioStatus, BillingEventType, BrandingProfile, LoginEvent } from '../types';
import CampaignImport from './CampaignImport';
import PortfolioTable from './PortfolioTable';
import DebtorTable from './DebtorTable';
import LaunchCampaign from './LaunchCampaign';
import DiscordNotification from './DiscordNotification';
import DataEnrichmentImport from './DataEnrichmentImport';
import { apiService } from '../services/apiService';
import { Icon } from './Icon';

const CampaignManagerSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="bg-slate-200 dark:bg-brand-secondary h-48 rounded-lg"></div>
        <div className="bg-slate-200 dark:bg-brand-secondary h-80 rounded-lg"></div>
        <div className="bg-slate-200 dark:bg-brand-secondary h-64 rounded-lg"></div>
    </div>
);

const CampaignManager: React.FC = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<Set<string>>(new Set());
    const [view, setView] = useState<'portfolios' | 'debtors'>('portfolios');
    const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
    const [notification, setNotification] = useState<{ debtor: Debtor; message: string; icon: 'check' | 'warning' } | null>(null);

    // Data fetched from backend
    const [playbooks, setPlaybooks] = useState<SavedPlaybook[]>([]);
    const [phoneNumbers, setPhoneNumbers] = useState<AvailablePhoneNumber[]>([]);
    const [aiAgents, setAiAgents] = useState<SelectableAIAgent[]>([]);
    const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>([]);
    const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]); // Assuming this might come from a WebSocket or polling in the future

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [portfoliosData, launchConfigData] = await Promise.all([
                    apiService.getPortfolios(),
                    apiService.getLaunchConfig(),
                ]);
                setPortfolios(portfoliosData);
                setPlaybooks(launchConfigData.playbooks);
                setPhoneNumbers(launchConfigData.phoneNumbers);
                setAiAgents(launchConfigData.aiAgents);
                setBrandingProfiles(launchConfigData.brandingProfiles);
            } catch (err: any) {
                setError(err.message || 'Failed to load campaign data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleViewDebtors = (portfolio: Portfolio) => {
        setCurrentPortfolio(portfolio);
        setView('debtors');
    };

    const handleBackToPortfolios = () => {
        setCurrentPortfolio(null);
        setView('portfolios');
    };

    const handleUpdateDebtorStatus = (debtorId: string, status: DebtorStatus) => {
        // This would be an API call in a real app
        console.log(`Updating debtor ${debtorId} to status ${status}`);
    };
    
    const handleUpdatePortfolioStatus = (portfolioId: string, status: PortfolioStatus) => {
        // This would be an API call
        setPortfolios(prev => prev.map(p => p.id === portfolioId ? { ...p, status } : p));
    };

    const handleUpdateSettlementOffer = (portfolioId: string, percentage: number) => {
        // This would be an API call
        setPortfolios(prev => 
            prev.map(p => 
                p.id === portfolioId ? { ...p, settlementOfferPercentage: percentage } : p
            )
        );
    };

    const handleLaunchCampaign = (portfolioId: string, brandingProfileId: string) => {
        // This would be an API call
        setPortfolios(prev => prev.map(p => 
            p.id === portfolioId 
                ? { ...p, status: 'Active', brandingProfileId: brandingProfileId } 
                : p
        ));
    };

    const handleShowNotification = (debtor: Debtor, message: string, icon: 'check' | 'warning') => {
        setNotification({ debtor, message, icon });
        setTimeout(() => setNotification(null), 5000); // Auto-dismiss after 5 seconds
    };

    if (loading) return <CampaignManagerSkeleton />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="space-y-6">
            {view === 'portfolios' ? (
                <>
                    <LaunchCampaign
                        portfolios={portfolios}
                        playbooks={playbooks}
                        phoneNumbers={phoneNumbers}
                        aiAgents={aiAgents}
                        brandingProfiles={brandingProfiles}
                        onLaunch={handleLaunchCampaign}
                    />
                    <PortfolioTable
                        portfolios={portfolios}
                        onViewDebtors={handleViewDebtors}
                        selectedPortfolioIds={selectedPortfolioIds}
                        setSelectedPortfolioIds={setSelectedPortfolioIds}
                        onUpdateStatus={handleUpdatePortfolioStatus}
                        onUpdateSettlementOffer={handleUpdateSettlementOffer}
                        loginEvents={loginEvents}
                    />
                    <CampaignImport setPortfolios={setPortfolios} />
                    <DataEnrichmentImport portfolios={portfolios} setPortfolios={setPortfolios} />
                </>
            ) : currentPortfolio ? (
                <DebtorTable
                    portfolio={currentPortfolio}
                    onBack={handleBackToPortfolios}
                    onUpdateDebtorStatus={handleUpdateDebtorStatus}
                    onShowNotification={handleShowNotification}
                />
            ) : null}
            {notification && (
                <DiscordNotification 
                    debtor={notification.debtor}
                    message={notification.message}
                    icon={notification.icon}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default CampaignManager;
