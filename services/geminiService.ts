import { CsvHeaderMapping, ReputationCheckResult, AIAgentProfile, Mission, JurisdictionRule, ProposedRuleUpdate } from '../types';
import { apiService } from './apiService';


export const checkPhoneNumberReputation = (phoneNumber: string): Promise<ReputationCheckResult> => {
    return apiService.checkPhoneNumberReputation(phoneNumber);
};


export const mapCsvHeaders = (headers: string[], requiredFields: string[]): Promise<CsvHeaderMapping> => {
    return apiService.mapCsvHeaders(headers, requiredFields);
};

export const suggestMission = (agents: AIAgentProfile[], missions: Mission[]): Promise<Partial<Mission>> => {
    return apiService.suggestMission(agents, missions);
};

export const researchComplianceUpdates = (jurisdiction: JurisdictionRule): Promise<ProposedRuleUpdate | null> => {
    return apiService.researchComplianceUpdate(jurisdiction);
};