import { User, Kpi, FunnelStage, ComplianceAlert, PtpEntry, CampaignKpiSet, CampaignInfo, LoginEvent, Portfolio, SavedPlaybook, AvailablePhoneNumber, SelectableAIAgent, BrandingProfile, AIAgentProfile, Mission, GoldenScript, NegotiationModel, JurisdictionRule, ProposedRuleUpdate, ResilienceStatus, BillingMeterEntry } from '../types';

const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || `HTTP error! status: ${response.status}`);
    }
    return data.data;
};

// --- API Service Methods ---

const getDashboardData = async (): Promise<{
    kpis: Kpi[];
    funnelData: FunnelStage[];
    alerts: ComplianceAlert[];
    ptps: PtpEntry[];
    campaignKpis: { kpiData: CampaignKpiSet; campaigns: CampaignInfo[] };
    loginEvents: LoginEvent[];
}> => {
    const response = await fetch(`${API_URL}/dashboard`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

const getPortfolios = async (): Promise<Portfolio[]> => {
    const response = await fetch(`${API_URL}/portfolios`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

const getAgents = async (): Promise<AIAgentProfile[]> => {
     const response = await fetch(`${API_URL}/agents`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

const getMissions = async (): Promise<Mission[]> => {
     const response = await fetch(`${API_URL}/agents/missions`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

const getIntelligenceData = async (): Promise<{
    goldenScripts: GoldenScript[];
    negotiationModels: NegotiationModel[];
}> => {
     const response = await fetch(`${API_URL}/agents/intelligence`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

const getComplianceData = async (): Promise<{
    jurisdictionRules: JurisdictionRule[];
    phonePool: AvailablePhoneNumber[];
    numberPools: any[]; // Define a proper type if needed
    brandingProfiles: BrandingProfile[];
}> => {
    const response = await fetch(`${API_URL}/compliance`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

const getSettingsData = async (): Promise<{
    billingLog: BillingMeterEntry[];
    accountCredits: number;
    resilienceStatus: ResilienceStatus;
    proposedRuleUpdates: ProposedRuleUpdate[];
}> => {
     const response = await fetch(`${API_URL}/compliance/settings`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

const getLaunchConfig = async (): Promise<{
    playbooks: SavedPlaybook[];
    phoneNumbers: AvailablePhoneNumber[];
    aiAgents: SelectableAIAgent[];
    brandingProfiles: BrandingProfile[];
}> => {
    const response = await fetch(`${API_URL}/portfolios/launch-config`, { headers: getAuthHeaders() });
    return handleResponse(response);
};

const getBrandingProfiles = async (): Promise<BrandingProfile[]> => {
    const response = await fetch(`${API_URL}/compliance/branding-profiles`, { headers: getAuthHeaders() });
    return handleResponse(response);
}

export const apiService = {
    getDashboardData,
    getPortfolios,
    getAgents,
    getMissions,
    getIntelligenceData,
    getComplianceData,
    getSettingsData,
    getLaunchConfig,
    getBrandingProfiles
};
