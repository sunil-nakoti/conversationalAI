// FIX: Added LiveCall and LiveSms to the import list.
import { User, Kpi, FunnelStage, ComplianceAlert, PtpEntry, CampaignKpiSet, CampaignInfo, LoginEvent, Portfolio, SavedPlaybook, AvailablePhoneNumber, SelectableAIAgent, BrandingProfile, AIAgentProfile, Mission, GoldenScript, NegotiationModel, JurisdictionRule, ProposedRuleUpdate, ResilienceStatus, BillingMeterEntry, CsvHeaderMapping, ReputationCheckResult, Payment, ScheduledPayment, Notification, PaymentPortalSettings, CallingCadence, BrandedCallingSettings, SmsTemplate, CallReport, Objection, LiveCall, LiveSms } from '../types';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login or handle appropriately
        // For now, we'll throw an error, which will be caught by the calling function.
        throw new Error('No authentication token found. Please log in.');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response: Response) => {
    // Handle cases with no content
    if (response.status === 204) {
        return null;
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
    }
    return data.data || data;
};

// A generic fetch wrapper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
        const headers = getAuthHeaders();
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers },
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        // Here you might want to handle token expiration, e.g., by logging out the user
        if (error.message.includes('Not authorized')) {
            // authService.logout(); // or some other global way to handle this
            // window.location.reload();
        }
        throw error; // Re-throw the error to be handled by the component
    }
};

// --- API Service Methods ---

// Dashboard
const getDashboardData = () => apiFetch('/dashboard');

// Portfolios & Campaigns
const getPortfolios = (): Promise<Portfolio[]> => apiFetch('/portfolios');
const updatePortfolio = (id: string, data: Partial<Portfolio>): Promise<Portfolio> => apiFetch(`/portfolios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
const getLaunchConfig = () => apiFetch('/portfolios/launch-config');

// AI Agents & Missions
const getAgents = (): Promise<AIAgentProfile[]> => apiFetch('/agents');
const updateAgent = (id: string, data: Partial<AIAgentProfile>): Promise<AIAgentProfile> => apiFetch(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) });
const getMissions = (): Promise<Mission[]> => apiFetch('/agents/missions');
const saveMission = (mission: Partial<Mission>): Promise<Mission> => {
    const method = mission.id ? 'PUT' : 'POST';
    const endpoint = mission.id ? `/agents/missions/${mission.id}` : '/agents/missions';
    return apiFetch(endpoint, { method, body: JSON.stringify(mission) });
};
const deleteMission = (id: string): Promise<void> => apiFetch(`/agents/missions/${id}`, { method: 'DELETE' });

// Intelligence Center
const getIntelligenceData = (): Promise<{
    goldenScripts: GoldenScript[];
    negotiationModels: NegotiationModel[];
    objections: Objection[];
    smsTemplates: SmsTemplate[];
    callReports: CallReport[];
}> => apiFetch('/intelligence');
const updateNegotiationModels = (models: NegotiationModel[]): Promise<NegotiationModel[]> => apiFetch('/intelligence/negotiation-models', { method: 'PUT', body: JSON.stringify(models) });
const updateObjections = (objections: Objection[]): Promise<Objection[]> => apiFetch('/intelligence/objections', { method: 'PUT', body: JSON.stringify(objections) });


// Compliance Desk
const getComplianceData = (): Promise<{
    jurisdictionRules: JurisdictionRule[];
    phonePool: AvailablePhoneNumber[];
    numberPools: any[];
    brandingProfiles: BrandingProfile[];
    emergingRisks: any[];
    scrubLog: any[];
    conversationalAudit: any[];
}> => apiFetch('/compliance');
const saveJurisdictionRules = (rules: JurisdictionRule[]): Promise<JurisdictionRule[]> => apiFetch('/compliance/jurisdiction-rules', { method: 'PUT', body: JSON.stringify(rules) });
const updateBrandingProfiles = (profiles: BrandingProfile[]): Promise<BrandingProfile[]> => apiFetch('/compliance/branding-profiles', { method: 'PUT', body: JSON.stringify(profiles) });
const updatePhonePool = (pool: AvailablePhoneNumber[]): Promise<AvailablePhoneNumber[]> => apiFetch('/compliance/phone-pool', { method: 'PUT', body: JSON.stringify(pool) });


// Settings
const getSettings = (): Promise<any> => apiFetch('/settings');
const updateSettings = (settings: any): Promise<any> => apiFetch('/settings', { method: 'PUT', body: JSON.stringify(settings) });
const getBillingData = (): Promise<{ billingLog: BillingMeterEntry[], resilienceStatus: ResilienceStatus }> => apiFetch('/settings/billing');

// Reporting
const getReportingData = (): Promise<{
    summary: any;
    paymentHistory: Payment[];
    missedPayments: ScheduledPayment[];
}> => apiFetch('/reporting');

// Live Data
const getLiveUpdates = (): Promise<{ calls: LiveCall[], sms: LiveSms[], paymentsMade: number, logins: number }> => apiFetch('/live/updates');

// Notifications
const getNotifications = (): Promise<Notification[]> => apiFetch('/notifications');
const markNotificationRead = (id: string): Promise<Notification> => apiFetch(`/notifications/${id}/read`, { method: 'POST' });

// Gemini Proxied Calls
const checkPhoneNumberReputation = (phoneNumber: string): Promise<ReputationCheckResult> => apiFetch('/compliance/check-reputation', { method: 'POST', body: JSON.stringify({ phoneNumber }) });
const mapCsvHeaders = (headers: string[], requiredFields: string[]): Promise<CsvHeaderMapping> => apiFetch('/portfolios/map-headers', { method: 'POST', body: JSON.stringify({ headers, requiredFields }) });
const suggestMission = (agents: AIAgentProfile[], missions: Mission[]): Promise<Partial<Mission>> => apiFetch('/agents/suggest-mission', { method: 'POST', body: JSON.stringify({ agents, missions }) });
const researchComplianceUpdate = (jurisdiction: JurisdictionRule): Promise<ProposedRuleUpdate | null> => apiFetch('/compliance/research-updates', { method: 'POST', body: JSON.stringify({ jurisdiction }) });
const getChatbotResponse = (conversationHistory: any[], debtorData: any): Promise<{ text: string }> => apiFetch('/chatbot/message', { method: 'POST', body: JSON.stringify({ conversationHistory, debtorData }) });

export const apiService = {
    getDashboardData,
    getPortfolios,
    updatePortfolio,
    getLaunchConfig,
    getAgents,
    updateAgent,
    getMissions,
    saveMission,
    deleteMission,
    getIntelligenceData,
    updateNegotiationModels,
    updateObjections,
    getComplianceData,
    saveJurisdictionRules,
    updateBrandingProfiles,
    updatePhonePool,
    getSettings,
    updateSettings,
    getBillingData,
    getReportingData,
    getLiveUpdates,
    getNotifications,
    markNotificationRead,
    checkPhoneNumberReputation,
    mapCsvHeaders,
    suggestMission,
    researchComplianceUpdate,
    getChatbotResponse,
    getBrandingProfiles: () => apiFetch('/compliance/branding-profiles') // Keep for specific use cases
};
