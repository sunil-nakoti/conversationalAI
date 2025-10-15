// This file aggregates all shared type definitions for the application.

// Main App Structure
export type View = 'dashboard' | 'fileUpload' | 'campaignLive' | 'notifications' | 'intelligence' | 'agentCommand' | 'compliance' | 'settings' | 'paymentReporting' | 'paymentPage' | 'login' | 'register' | 'profile';
export type Theme = 'light' | 'dark';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export type IconName =
    | 'dashboard' | 'rocket' | 'upload' | 'zap' | 'bell' | 'brain' | 'robot' | 'clipboard-list' | 'settings'
    | 'phone' | 'sms' | 'warning' | 'shield-check' | 'info' | 'funnel' | 'alert-triangle' | 'dollar'
    | 'chevron-down' | 'sun' | 'moon' | 'panel-right-close' | 'panel-left-close' | 'arrow-right'
    | 'check' | 'spinner' | 'download' | 'wait' | 'email' | 'call' | 'drip' | 'gavel' | 'beaker'
    | 'leaderboard' | 'trophy' | 'star' | 'medal' | 'copy' | 'server-cog' | 'shopping-cart' | 'activity'
    | 'search' | 'message-square' | 'filter' | 'refresh' | 'more-horizontal' | 'user-check' | 'globe'
    | 'map-pin' | 'trending-up' | 'brain-circuit' | 'zap-off' | 'verified' | 'microphone' | 'volume-2'
    | 'play' | 'pause' | 'award' | 'reports' | 'trash' | 'more-vertical' | 'user' | 'credit-card' | 'x'
    | 'building' | 'calendar' | 'plus-square' | 'link' | 'thumbs-up' | 'thumbs-down' | 'eye'
    // New Icons for World-Class Features
    | 'flask-conical' | 'flame' | 'message-circle-heart' | 'user-round-search';

// Dashboard & KPIs
export interface FunnelStage { name: string; value: number; color: string; parentStageIndex?: number; }
export interface ComplianceAlert { id: string; severity: 'High' | 'Medium' | 'Low'; message: string; timestamp: string; }
export interface PtpEntry { id: string; debtorName: string; amount: number; status: 'Paid' | 'Unpaid'; }
export type KpiColor = 'accent' | 'success' | 'warning' | 'danger';
export interface Kpi { label: string; value: string; description: string; icon: IconName; color?: KpiColor; }
export interface CampaignKpiSet { [campaignId: string]: { rpcRate: number; ptpRate: number; paymentsMade: number; totalCollected: number; }; }
export interface CampaignInfo { id: string; name: string; }
export interface LoginEvent { id: string; debtorName: string; ipAddress: string; timestamp: string; isFlagged: boolean; }

// Campaign & Debtor Management
export type DebtorStatus = 'Not Verified' | 'Verified' | 'PTP' | 'Paid' | 'Cease and Desist';
export interface Debtor {
    id: string;
    fullname: string;
    accountnumber: string;
    originalcreditor: string;
    currentbalance: number;
    status: DebtorStatus;
    phone1?: string; phone2?: string; phone3?: string; phone4?: string; phone5?: string; phone6?: string; phone7?: string; phone8?: string; phone9?: string; phone10?: string;
    email?: string;
    address?: string; city?: string; state?: string; zip?: string;
    callHistory: any[];
    propensityScore?: number;
    contactOutlook?: {
        heatmap: number[][];
        optimalChannel: 'SMS' | 'Call' | 'Email';
    };
}
export type PortfolioStatus = 'Idle' | 'Active' | 'Paused' | 'Completed';
export interface Portfolio {
    id: string;
    name: string;
    debtors: Debtor[];
    numberOfAccounts: number;
    averageBalance: number;
    contactAttempts: number;
    settlementFee: number;
    status: PortfolioStatus;
    averagePropensityScore?: number;
    settlementOfferPercentage?: number;
    brandingProfileId?: string;
}
export interface SavedPlaybook { id: string; name: string; }
export interface SelectableAIAgent { id: string; name: string; description: string; }
export type BillingEventType = 'call_minute' | 'sms_sent' | 'high_risk_scrub';

// Gemini Service & AI
export type CsvHeaderMapping = Record<string, string | null>;
export interface ReputationCheckResult { risk_level: 'High' | 'Medium' | 'Safe'; summary_insight: string; }
export interface Achievement { id: string; name: string; description: string; icon: IconName; color: string; }
export interface AIAgentProfile {
    id: string;
    name: string;
    role: 'Collector' | 'Supervisor' | 'ComplianceOfficer';
    level: number;
    rankTitle: string;
    currentXp: number;
    xpToNextLevel: number;
    totalXp: number;
    achievements: Achievement[];
    ptpRate?: number;
    rpcRate?: number;
    optInRate?: number;
    optOutRate?: number;
    paymentsMade?: number;
    logins?: number;
    complianceScore: number;
    coachingSessions?: number;
    teamPtpLift?: number;
    efficiencyGain?: number;
    escalationsHandled?: number;
    auditsCompleted?: number;
    violationsDetected?: number;
    disputesResolved?: number;
    policyUpdates?: number;
    configuration: AIAgentConfiguration;
    // Prometheus Mode
    isPrometheusEnabled?: boolean;
    prometheusStatus?: {
        challengerName: string;
        performanceLift: number;
    };
}
export type MissionGoalType = 'Attempts Made' | 'RPCs' | 'Opt-Ins' | 'PTPs' | 'Payments Made' | 'Opt-Outs';
export interface Mission {
    id: string;
    title: string;
    description: string;
    rewardXp: number;
    progress: number;
    goal: number;
    goalType: MissionGoalType;
    timeLimitDays: number;
}
export interface AgentLeaderboardEntry { rank: number; agentName: string; rpcRate: number; ptpRate: number; avgSentiment: number; }

// Intelligence & Analytics
export type IntelligenceTab = 'studio' | 'playbooks' | 'objections' | 'negotiation' | 'smsTraining' | 'reports' | 'training' | 'goldenScripts';
export interface GoldenScript { id: string; playbookName: string; persona: string; ptpRate: number; avgSentiment: number; complianceScore: number; dateArchived: string; }
export interface NegotiationModel {
    id: string;
    name: string;
    description: string;
    settlementAuthority: { maxPercentage: number; requiresApprovalSimulation: boolean; };
    offerPacing: 'immediate' | 'gradual' | 'last_resort';
    paymentPlanFlexibility: { allowCustomPlans: boolean; maxDurationMonths: number; minInstallmentPercentage: number; };
    hardshipProtocol: 'link_to_hardship_playbook' | 'offer_pause' | 'verify_income';
    allowedTactics: ('expiring_offer' | 'payment_in_full_discount' | 'broken_promise_fee_waiver')[];
}
export interface AIAgentConfiguration {
    basePersona: 'empathetic' | 'direct' | 'professional';
    systemPrompt: string;
    responseLatency: number; // in ms
    interruptionSensitivity: number; // 1-10
    negotiationModelId: string;
    defaultVoice: string;
    naturalPauses: boolean;
    varyPitch: boolean;
    accentMatchingEnabled: boolean;
    tacticUrgency?: number;
    tacticEmpathy?: number;
    tacticSocialProof?: number;
    tacticAuthority?: number;
}
export interface CallReport {
    id: string; debtorName: string; agentName: string; timestamp: string; outcome: string; duration: number; audioUrl: string;
    transcript: { speaker: 'AI' | 'Debtor'; text: string; timestamp: number }[];
    aiSupervisorScore?: number;
    aiSupervisorNotes?: string;
    humanFeedback: 'good' | 'bad' | null;
}
export interface Objection { id: string; name: string; category: string; keywords: string[]; linkedPlaybookId: string; linkedPlaybookName: string; successRate?: number; avgSentimentShift?: number; avgCallDuration?: number; challengerPlaybookId?: string; challengerPlaybookName?: string; }
export interface AiObjectionSuggestion { id: string; title: string; summary: string; keywords: string[]; detectionCount: number; firstDetected: string; detectionHistory?: { date: string; count: number }[]; }
export interface SmsTemplate { id: string; name: string; category: string; purpose: string; message: string; isAbTesting?: boolean; challengerMessage?: string; ctr?: number; replyRate?: number; conversionRate?: number; optOutRate?: number; avgSentiment?: number; complianceScore?: number; }
export interface AiSmsSuggestion { id: string; source: 'generation' | 'conversation'; suggestedMessage: string; reasoning: string; predictedConversionLift?: number; }

// Drip Campaigns / Playbook Builder
export interface NodeData { type: string; label: string; icon: IconName; settings?: any; }
export interface CanvasNodeData extends NodeData { id: string; position: { x: number; y: number }; }
export interface Edge { id: string; source: string; target: string; }
export interface Playbook { id: string; name: string; agentId: string; nodes: CanvasNodeData[]; edges: Edge[]; }

// Training
export interface TrainingExample { id: string; title: string; type: 'good' | 'bad'; hasAudio: boolean; hasTranscript: boolean; uploadedAt: string; }

// AI Oversight
export type OversightTab = 'breaker' | 'sandbox' | 'qa';
export interface Metric { value: number; baseline: number; status: 'normal' | 'warning' | 'critical'; }
export interface CircuitBreakerCampaign { id: string; name: string; status: 'ACTIVE' | 'ALERT' | 'PAUSED'; metrics: Record<string, Metric>; }
export interface SandboxResult { predictedRpcRate: number; predictedPtpRate: number; predictedNegativeSentiment: number; predictedComplianceFlags: number; insight: string; }

// Compliance
export interface JurisdictionRule {
    id: string; state: string; callFrequencyLimit: number; callFrequencyDays: number;
    timeOfDayStart: string; timeOfDayEnd: string; enforce_pre_dial_scrub: boolean; isActive: boolean;
}
export interface ProposedRuleUpdate {
    id: string; jurisdictionCode: string;
    currentRule: Omit<JurisdictionRule, 'id' | 'state' | 'isActive'>;
    proposedChanges: Partial<Omit<JurisdictionRule, 'id' | 'state' | 'isActive'>>;
    reasoning: string; sourceUrl: string; sourceTitle: string; confidence: number; status: 'pending' | 'applied' | 'dismissed';
}
export type PhoneNumberStatus = 'active' | 'cooldown' | 'retired' | 'incubating';
export type AttestationStatus = 'verified' | 'pending' | 'failed' | undefined;
export interface AvailablePhoneNumber {
    id: string; number: string; status: PhoneNumberStatus; healthScore: number; callsLastHour: number; lastUsedTimestamp: number;
    reputationStatus?: 'idle' | 'checking' | 'checked' | 'error';
    reputationResult?: ReputationCheckResult | null;
    forwardingNumber?: string;
    voicemailDetection?: boolean;
    poolId?: string;
    incubationStart?: number;
    attestationStatus?: AttestationStatus;
}
export interface NumberPool { id: string; name: string; brandingProfileId?: string; }
export type CallingCadence = 'human-simulated' | 'aggressive' | 'standard';
export type WebhookEventType = 'call_completed' | 'sms_received' | 'payment_successful' | 'ptp_created';

// New Types for Notification Integrations
export type NotificationPlatform = 'discord' | 'slack' | 'teams';
export type NotificationEventType = 'rpc' | 'opt_in' | 'ptp' | 'payment_made';
export interface NotificationIntegration {
    id: string;
    platform: NotificationPlatform;
    webhookUrl: string;
    events: NotificationEventType[];
}

export interface BrandingProfile {
    id: string;
    companyName: string;
    logoUrl: string;
    brandColor: string;
    phoneNumber: string;
    emailAddress: string;
    websiteUrl: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    // Payment Portal Settings
    paymentPortalIsEnabled: boolean;
    acceptCreditCard: boolean;
    acceptAch: boolean;
    convenienceFeeType: 'none' | 'percentage' | 'fixed';
    convenienceFeeValue: number;
    // Core API Integrations
    twilioSid?: string;
    twilioAuthToken?: string;
    paymentGatewayApiKey?: string;
    paymentGatewaySecretKey?: string;
    // External CRM API Access
    clientApiKey?: string;
    rateLimit?: number;
    webhookUrl?: string;
    webhookEvents?: WebhookEventType[];
    // Notification Integrations
    notificationIntegrations?: NotificationIntegration[];
}
export interface BrandedCallingSettings { isEnabled: boolean; defaultBrandingProfileId: string | null; }
export interface PreDialScrubLogEntry { id: string; checkTimestamp: string; phoneNumber: string; accountNumber: string; reassignedStatus: 'Clear' | 'Possible Reassign' | 'High Risk'; litigatorStatus: 'Clear' | 'Litigator Match'; wasBlocked: boolean; blockReason: string | null; }
export interface EmergingRiskTrend { id: string; title: string; detectedDate: string; summary: string; keywords: string[]; }
export type Region = 'Northeast' | 'Midwest' | 'South' | 'West';
export interface StateData { code: string; name: string; region: Region; accountCount: number; status: 'Included' | 'Excluded'; }

// Notifications
export type NotificationPriority = 'high' | 'normal' | 'low';
export type NotificationStatus = 'unread' | 'read' | 'responded';
export interface Notification { id: string; type: string; icon: IconName; title: string; message: string; debtorName: string; priority: NotificationPriority; status: NotificationStatus; createdAt: string; }
export interface SmsMessage { id: string; sender: 'AI' | 'Debtor' | 'Agent (Manual)' | 'System'; text: string; timestamp: string; }

// Settings
// FIX: Added missing PaymentPortalSettings interface.
export interface PaymentPortalSettings {
    isEnabled: boolean;
    defaultBrandingProfileId: string | null;
    acceptCreditCard: boolean;
    acceptAch: boolean;
    convenienceFeeType: 'none' | 'percentage' | 'fixed';
    convenienceFeeValue: number;
}
export interface WebhookTestResult { status: 'Success' | 'Failure'; httpCode: number; latency: number | null; message: string; }
export interface ResilienceStatus { lastBackup: string; drStatus: 'Active-Active' | 'Active-Passive' | 'Degraded'; replicationLag: number; estimatedRTO: string; }
export interface BillingMeterEntry { timestamp: string; eventType: BillingEventType; usageCount: number; }

// Live Campaign & Reporting
export interface LiveCall { id: string; debtorName: string; agent: string; status: 'Ringing' | 'Connected' | 'Completed' | 'Voicemail' | 'Failed'; sentiment: 'Positive' | 'Neutral' | 'Negative'; duration: number; timestamp: number; isCoached?: boolean; }
export interface LiveSms { id: string; debtorName: string; direction: 'inbound' | 'outbound'; message: string; timestamp: number; status?: 'Delivered' | 'Failed'; }
export interface CallLogEntry { id: string; callNumber: string; createdAt: string; scheduledTime: string; status: 'completed' | 'voicemail' | 'no answer' | 'invalid'; inbound: boolean; duration: number; hasRecording: boolean; }
export interface Payment { id: string; debtorId: string; debtorName: string; accountNumber: string; portfolioId: string; portfolioName: string; paymentAmount: number; paymentDate: string; paymentMethod: 'Online' | 'Telephonic'; paymentType: 'Settlement' | 'Payment Plan' | 'Custom'; status: 'Completed' | 'Failed' | 'Pending'; confirmationNumber: string; }
export interface ScheduledPayment { id: string; debtorId: string; debtorName: string; accountNumber: string; paymentPlanId: string; scheduledDate: string; scheduledAmount: number; status: 'Paid' | 'Missed' | 'Pending'; }

// Humanization
export type VoiceStatus = 'active' | 'inactive';
export interface VoiceLibraryEntry { id: string; voiceName: string; voiceProvider: 'Google TTS' | 'ElevenLabs' | 'Custom'; voiceId: string; languageTag: string; accent: string; status: VoiceStatus; }

// --- WORLD CLASS FEATURES ---

// 1. Campaign Simulation
export interface CampaignSimulationResult {
    predictedPtpRate: number;
    predictedTotalCollections: number;
    mostCommonObjection: {
        name: string;
        percentage: number;
    };
    predictedComplianceFlags: number;
    agentComparison?: {
        agentName: string;
        ptpRate: number;
    }[];
}

// 2. Smart Coach
export type SmartCoachDirectiveType = 'sentiment_warning' | 'objection_missed' | 'playbook_suggestion' | 'human_intervention';
export interface SmartCoachDirective {
    id: string;
    timestamp: number; // in call seconds
    type: SmartCoachDirectiveType;
    message: string;
    callId: string;
}

// 3. Gamified Payment Portal
export type PaymentPlanTerm = 'weekly' | 'bi-weekly' | 'monthly';
export interface DebtorAchievement {
    name: string;
    description: string;
    icon: IconName;
    paymentsRequired: number;
}

// 4. Conversational Compliance
export type ConversationalRiskType = 'Emotional Escalation' | 'Pressure Tactics' | 'Potential Confusion' | 'UDAAP Risk';
export interface ConversationalAuditEntry {
    id: string;
    callId: string;
    debtorName: string;
    agentName: string;
    timestamp: string;
    riskType: ConversationalRiskType;
    riskScore: number; // 0-100
    summary: string;
    flaggedTranscriptSnippet: string;
    sentimentTrend: number[]; // e.g., [0.5, 0.4, 0.2, 0.1]
}