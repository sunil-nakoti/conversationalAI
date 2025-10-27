import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { IconName, IntelligenceTab, GoldenScript, BrandingProfile, AIAgentProfile, NegotiationModel, Objection, SmsTemplate, CallReport, Playbook } from '../types';
import ObjectionLibrary from './intelligence/ObjectionLibrary';
import CallReports from './intelligence/CallReports';
import AiAgentStudio from './analytics/AiAgentStudio';
import TrainingCenter from './TrainingCenter';
import PlaybookBuilder from './intelligence/PlaybookBuilder';
import Tooltip from './Tooltip';
import SmsTrainingLibrary from './intelligence/SmsTrainingLibrary';
import GoldenScriptLibrary from './intelligence/GoldenScriptLibrary';
import NegotiationModelStudio from './intelligence/NegotiationModelStudio';
import { apiService } from '../services/apiService';

const IntelligenceCenterSkeleton: React.FC = () => (
     <div className="animate-pulse">
        <div className="h-10 w-1/2 bg-slate-200 dark:bg-brand-secondary rounded-md mb-6"></div>
        <div className="h-12 bg-slate-200 dark:bg-brand-secondary rounded-lg mb-6"></div>
        <div className="h-96 bg-slate-200 dark:bg-brand-secondary rounded-lg"></div>
    </div>
);


const IntelligenceCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<IntelligenceTab>('studio');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for fetched data
    const [agents, setAgents] = useState<AIAgentProfile[]>([]);
    const [goldenScripts, setGoldenScripts] = useState<GoldenScript[]>([]);
    const [negotiationModels, setNegotiationModels] = useState<NegotiationModel[]>([]);
    const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>([]);
    const [objections, setObjections] = useState<Objection[]>([]);
    const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
    const [callReports, setCallReports] = useState<CallReport[]>([]);
    const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch all data required for all intelligence tabs at once
                const [agentsData, intelligenceData, brandingData] = await Promise.all([
                    apiService.getAgents(),
                    apiService.getIntelligenceData(),
                    apiService.getBrandingProfiles()
                ]);
                setAgents(agentsData);
                setGoldenScripts(intelligenceData.goldenScripts);
                setNegotiationModels(intelligenceData.negotiationModels);
                setObjections(intelligenceData.objections);
                setSmsTemplates(intelligenceData.smsTemplates);
                setCallReports(intelligenceData.callReports);
                setPlaybooks(intelligenceData.playbooks);
                setBrandingProfiles(brandingData);
            } catch (err: any) {
                setError(err.message || 'Failed to load intelligence data.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);


    const renderContent = () => {
        if (loading) return <IntelligenceCenterSkeleton />;
        if (error) return <div className="text-red-500 text-center">{error}</div>;

        switch (activeTab) {
            case 'studio':
                return <AiAgentStudio 
                            agents={agents} 
                            setAgents={setAgents} 
                            onNavigate={setActiveTab} 
                            negotiationModels={negotiationModels}
                            brandingProfiles={brandingProfiles}
                        />;
            case 'playbooks':
                return <PlaybookBuilder playbooks={playbooks} setPlaybooks={setPlaybooks} />;
            case 'objections':
                return <ObjectionLibrary objections={objections} setObjections={setObjections} />;
            case 'negotiation':
                return <NegotiationModelStudio models={negotiationModels} setModels={setNegotiationModels} />;
            case 'smsTraining':
                return <SmsTrainingLibrary templates={smsTemplates} setTemplates={setSmsTemplates} />;
            case 'reports':
                return <CallReports reports={callReports} setReports={setCallReports} />;
            case 'training':
                return <TrainingCenter />;
            case 'goldenScripts':
                return <GoldenScriptLibrary scripts={goldenScripts} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tabName: IntelligenceTab; label: string; icon: IconName; tooltip: string }> = ({ tabName, label, icon, tooltip }) => (
        <Tooltip content={tooltip}>
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
        </Tooltip>
    );

    return (
        <div>
             <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Intelligence Center</h2>
                <Tooltip content="This is the command center for your AI's 'brain'. Configure agent personalities, build conversational playbooks, and analyze interaction data.">
                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                </Tooltip>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <nav className="flex flex-wrap gap-2" aria-label="Tabs">
                    <TabButton tabName="studio" label="AI Agent Studio" icon="robot" tooltip="Craft and configure the core personality and voice of your AI agents." />
                    <TabButton tabName="playbooks" label="Playbook Builder" icon="drip" tooltip="Visually design the conversational flows and logic your AI agents will follow." />
                    <TabButton tabName="negotiation" label="Negotiation Models" icon="gavel" tooltip="Define and customize agent negotiation strategies." />
                    <TabButton tabName="objections" label="Objection Library" icon="shield-check" tooltip="Define debtor objections and link them to counter-strategy playbooks." />
                    <TabButton tabName="smsTraining" label="SMS Training" icon="sms" tooltip="Provide example SMS messages and templates for the AI to learn from." />
                    <TabButton tabName="training" label="AI Training" icon="award" tooltip="Use reinforcement learning to train your agents with examples of good and bad calls." />
                    <TabButton tabName="reports" label="Call Reports" icon="reports" tooltip="Review and audit transcripts and audio recordings of AI agent interactions." />
                    <TabButton tabName="goldenScripts" label="Golden Scripts" icon="award" tooltip="Review and clone your highest-performing champion playbooks." />
                </nav>
            </div>
            
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default IntelligenceCenter;
