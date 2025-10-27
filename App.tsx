import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CampaignManager from './components/CampaignManager';
import IntelligenceCenter from "./components/Analytics";
import AgentCommand from './components/AgentCommand';
import ComplianceDesk from './components/ComplianceDesk';
import Settings from './components/Settings';
import Notifications from './components/Notifications';
import CampaignLive from './components/CampaignLive';
import PaymentReporting from './components/PaymentReporting';
import PaymentPage from './components/PaymentPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import AiChatbotWidget from './components/settings/AiChatbotWidget';
import { 
    View, Theme, BrandingProfile, User, LoginEvent, BillingEventType
} from './types';
import * as authService from './services/authService';
import { apiService } from './services/apiService';
import { Icon } from './components/Icon';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('login');
    const [theme, setTheme] = useState<Theme>('light');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);
    
    // Branding profiles are needed for payment page preview, so we fetch them here.
    const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>([]);
    const [defaultBrandingProfile, setDefaultBrandingProfile] = useState<BrandingProfile | null>(null);
    const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);

    // Define admin-only views
    const adminViews: View[] = ['compliance', 'settings'];
    
    const mockDebtorForChatbot = {
        fullname: 'Jane Doe',
        accountnumber: 'ACCT-78910',
        currentbalance: 850.75,
        originalcreditor: 'Global Bank Inc.',
        settlementOfferPercentage: 40,
        paymentPlanOptions: "3 monthly payments of $283.58",
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.getProfile();
                if (user) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                    setCurrentView('dashboard');
                }
            } catch (error) {
                authService.logout();
            } finally {
                setIsAppLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Fetch branding profiles once authenticated
    useEffect(() => {
        if (isAuthenticated) {
            apiService.getBrandingProfiles().then(profiles => {
                setBrandingProfiles(profiles);
                if (profiles.length > 0) {
                    setDefaultBrandingProfile(profiles[0]);
                }
            }).catch(console.error);
        }
    }, [isAuthenticated]);

    const handleLogin = async (credentials: {email, password}) => {
        const { user } = await authService.login(credentials);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
    };

    const handleRegister = async (userData: {name, email, password}) => {
        const { user } = await authService.register(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentView('login');
    };

    const handleViewChange = useCallback((view: View) => {
        // If the view is admin-only and the user is not an admin, block it.
        // Redirect to dashboard as a safe default.
        if (adminViews.includes(view) && currentUser?.role !== 'admin') {
            console.warn(`Access denied: User with role '${currentUser?.role}' tried to access admin view '${view}'.`);
            setCurrentView('dashboard');
            return;
        }
        setCurrentView(view);
    }, [currentUser, adminViews]);

    const logBillingEvent = (eventType: BillingEventType, usageCount: number) => {
        // In a real-world scenario, this would likely dispatch an action to a global state manager
        // or make an API call to a billing service. For now, we'll just log it.
        console.log(`Billing Event Logged: ${eventType}, Usage: ${usageCount}`);
    };


    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
    
    const renderView = () => {
        // Failsafe to prevent non-admins from rendering admin views
        if (adminViews.includes(currentView) && currentUser?.role !== 'admin') {
            return <Dashboard />;
        }
        switch (currentView) {
            case 'dashboard': return <Dashboard />;
            case 'fileUpload': return <CampaignManager />;
            case 'campaignLive': return <CampaignLive loginEvents={loginEvents} />;
            case 'notifications': return <Notifications logBillingEvent={logBillingEvent} />;
            case 'intelligence': return <IntelligenceCenter />;
            case 'agentCommand': return <AgentCommand onViewChange={setCurrentView} />;
            case 'compliance': return <ComplianceDesk 
                onPreviewPaymentPage={(profileId) => {
                    const profile = brandingProfiles.find(p => p.id === profileId) || brandingProfiles[0];
                    if (profile) {
                        setDefaultBrandingProfile(profile);
                        setCurrentView('paymentPage');
                    }
                }}
            />;
            case 'settings': return <Settings />;
            case 'paymentReporting': return <PaymentReporting />;
            case 'paymentPage': return <PaymentPage onLogin={() => {}} brandingProfile={defaultBrandingProfile!} />;
            case 'profile': return <ProfilePage user={currentUser!} onLogout={handleLogout} />;
            default: return <Dashboard />;
        }
    };

    if (isAppLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-brand-primary">
                <Icon name="spinner" className="h-12 w-12 text-brand-accent animate-spin" />
            </div>
        );
    }
    
    if (!isAuthenticated) {
        if (currentView === 'register') {
            return <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />
        }
        return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />
    }
    
    if (currentView === 'paymentPage') {
        return (
            <main className="min-h-screen flex flex-col">
                <PaymentPage onLogin={() => {}} brandingProfile={defaultBrandingProfile!} />
            </main>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-brand-primary">
            <Sidebar 
                currentView={currentView}
                onViewChange={handleViewChange}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                theme={theme}
                toggleTheme={toggleTheme}
                user={currentUser}
                onPreviewDefaultPaymentPage={() => {
                     const profile = brandingProfiles[0];
                     if (profile) {
                        setDefaultBrandingProfile(profile);
                        setCurrentView('paymentPage');
                     }
                }}
            />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <Header 
                    user={currentUser} 
                    onLogout={handleLogout}
                    onViewChange={handleViewChange}
                />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
            <AiChatbotWidget debtorData={mockDebtorForChatbot} />
        </div>
    );
};

export default App;