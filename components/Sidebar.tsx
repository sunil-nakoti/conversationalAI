import React, { useState } from 'react';
import { Icon } from './Icon';
import { IconName, View, Theme, User } from '../types';
import Tooltip from './Tooltip';

interface NavItemProps {
    icon: IconName;
    label: string;
    active?: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, isCollapsed, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center p-3 rounded-lg transition-colors duration-200 w-full text-left ${
            active 
                ? 'bg-brand-accent/20 text-brand-accent dark:text-white' 
                : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        } ${isCollapsed ? 'justify-center' : ''}`}
    >
        <Icon name={icon} className="h-6 w-6 flex-shrink-0" />
        <span className={`font-medium ml-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{label}</span>
    </button>
);

interface SidebarProps {
    currentView: View;
    onViewChange: (view: View) => void;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    theme: Theme;
    toggleTheme: () => void;
    onPreviewDefaultPaymentPage: () => void;
    user: User | null;
}

const mainNavItems: { view: View; label: string; icon: IconName; tooltip: string, adminOnly?: boolean }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: 'dashboard', tooltip: 'Get a real-time overview of campaign performance and key metrics.' },
    { view: 'notifications', label: 'Notifications', icon: 'bell', tooltip: 'View and manage all system notifications and debtor messages.' },
    { view: 'intelligence', label: 'Intelligence', icon: 'brain', tooltip: 'Design, train, and analyze your AI agents and strategies.' },
    { view: 'agentCommand', label: 'AI Agents', icon: 'robot', tooltip: 'Monitor and manage your autonomous AI workforce with gamified metrics.' },
    { view: 'compliance', label: 'Compliance Desk', icon: 'clipboard-list', tooltip: 'Review flagged interactions and manage compliance rules.', adminOnly: true },
    { view: 'profile', label: 'Profile', icon: 'user', tooltip: 'Manage your user profile.' },
    { view: 'settings', label: 'Settings', icon: 'settings', tooltip: 'Configure platform integrations and settings.', adminOnly: true },
];

const campaignParentItem: { view: View; label: string; icon: IconName; tooltip: string } = { view: 'fileUpload', label: 'Campaign', icon: 'rocket', tooltip: 'Manage debtor portfolios and launch AI-driven campaigns.' };

const campaignSubItems: { view: View; label: string; icon: IconName; tooltip: string }[] = [
    { view: 'fileUpload', label: 'Manager', icon: 'upload', tooltip: 'Manage debtor portfolios and launch AI-driven campaigns.' },
    { view: 'campaignLive', label: 'Live Monitor', icon: 'zap', tooltip: 'Monitor active campaigns in real-time.' },
    { view: 'paymentReporting', label: 'Payment Reporting', icon: 'reports', tooltip: 'Track and analyze all payment performance and history.' },
];


const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isCollapsed, toggleSidebar, theme, toggleTheme, onPreviewDefaultPaymentPage, user }) => {
    const campaignRelatedViews: View[] = ['fileUpload', 'campaignLive', 'paymentReporting'];
    const [isCampaignExpanded, setIsCampaignExpanded] = useState(campaignRelatedViews.includes(currentView));

    const visibleNavItems = mainNavItems.filter(item => 
        !item.adminOnly || (user?.role === 'admin')
    );
    
    const IconButton: React.FC<{ tooltip: string, onClick: () => void, icon: IconName }> = ({ tooltip, onClick, icon }) => (
        <Tooltip content={tooltip} position="top" disabled={!isCollapsed}>
             <button onClick={onClick} className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                <Icon name={icon} className="h-5 w-5" />
            </button>
        </Tooltip>
    );

    return (
        <aside className={`bg-white dark:bg-brand-secondary p-4 flex-col border-r border-slate-200 dark:border-slate-700/50 hidden md:flex fixed h-full transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`h-16 flex items-center mb-4 border-b border-slate-200 dark:border-slate-700/50 ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
                {isCollapsed ? (
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">A</span>
                ) : (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Arc AI</h2>
                )}
            </div>
            <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
                {visibleNavItems.slice(0,1).map((item) => (
                    <Tooltip key={item.view} content={item.tooltip} position="right" disabled={!isCollapsed}>
                         <NavItem
                            icon={item.icon}
                            label={item.label}
                            active={currentView === item.view}
                            onClick={() => onViewChange(item.view)}
                            isCollapsed={isCollapsed}
                        />
                    </Tooltip>
                ))}
                
                {/* Campaign Dropdown */}
                <div className="flex flex-col">
                    <Tooltip content={campaignParentItem.tooltip} position="right" disabled={!isCollapsed}>
                        <button
                            onClick={() => setIsCampaignExpanded(!isCampaignExpanded)}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 w-full text-left ${
                                campaignRelatedViews.includes(currentView) ? 'bg-brand-accent/20 text-brand-accent dark:text-white' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <div className="flex items-center">
                                <Icon name={campaignParentItem.icon} className="h-6 w-6 flex-shrink-0" />
                                <span className={`font-medium ml-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{campaignParentItem.label}</span>
                            </div>
                            {!isCollapsed && <Icon name="chevron-down" className={`h-5 w-5 transition-transform ${isCampaignExpanded ? 'rotate-180' : ''}`} />}
                        </button>
                    </Tooltip>
                    {isCampaignExpanded && !isCollapsed && (
                        <div className="pl-6 mt-2 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 ml-4">
                            {campaignSubItems.map(item => (
                                <Tooltip key={item.view} content={item.tooltip} position="right" disabled={!isCollapsed}>
                                    <NavItem
                                        icon={item.icon}
                                        label={item.label}
                                        active={currentView === item.view}
                                        onClick={() => onViewChange(item.view)}
                                        isCollapsed={isCollapsed}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    )}
                </div>

                {visibleNavItems.slice(1).map((item) => (
                    <Tooltip key={item.view} content={item.tooltip} position="right" disabled={!isCollapsed}>
                         <NavItem
                            icon={item.icon}
                            label={item.label}
                            active={currentView === item.view}
                            onClick={() => onViewChange(item.view)}
                            isCollapsed={isCollapsed}
                        />
                    </Tooltip>
                ))}
            </nav>
            <div className={`mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex ${isCollapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
                 <Tooltip content="Access Payment Portal" position="top" disabled={!isCollapsed}>
                    <button onClick={onPreviewDefaultPaymentPage} className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <Icon name="credit-card" className="h-5 w-5" />
                    </button>
                </Tooltip>
                <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-1'}`}>
                     <IconButton 
                        tooltip={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        onClick={toggleTheme}
                        icon={theme === 'dark' ? 'sun' : 'moon'}
                    />
                    <IconButton 
                        tooltip={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        onClick={toggleSidebar}
                        icon={isCollapsed ? 'panel-right-close' : 'panel-left-close'}
                    />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
