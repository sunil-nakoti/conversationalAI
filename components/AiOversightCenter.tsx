

import React, { useState } from 'react';
// FIX: Corrected import paths for child components and types.
import CircuitBreaker from './oversight/CircuitBreaker';
import AiSandbox from './oversight/AiSandbox';
import AiqaInsights from './oversight/AiqaInsights';
import { Icon } from './Icon';
// FIX: Corrected import path for types
import { IconName, OversightTab } from '../types';

const AiOversightCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OversightTab>('breaker');

    const renderContent = () => {
        switch (activeTab) {
            case 'breaker':
                return <CircuitBreaker />;
            case 'sandbox':
                return <AiSandbox />;
            case 'qa':
                return <AiqaInsights />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tabName: OversightTab; label: string; icon: IconName }> = ({ tabName, label, icon }) => (
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
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Oversight Center</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor, test, and ensure the quality of your autonomous AI agents.</p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <TabButton tabName="breaker" label="Anomaly Detection" icon="zap" />
                    <TabButton tabName="sandbox" label="AI Sandbox" icon="beaker" />
                    <TabButton tabName="qa" label="AI QA Insights" icon="check" />
                </nav>
            </div>
            
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AiOversightCenter;