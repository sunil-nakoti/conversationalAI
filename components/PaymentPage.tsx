
import React, { useState, useMemo } from 'react';
import { IconName, BrandingProfile } from '../types';
import { Icon } from './Icon';
import AiChatbotWidget from './settings/AiChatbotWidget';
import PaymentLogin from './PaymentLogin';

interface PaymentPageProps {
    onLogin: (debtorName: string, ipAddress: string) => void;
    brandingProfile: BrandingProfile;
}

const mockDebtorData = {
    fullname: 'Jane Doe',
    accountnumber: 'ACCT-78910',
    currentbalance: 850.75,
    originalcreditor: 'Global Bank Inc.',
    settlementOfferPercentage: 40,
    // FIX: Added missing paymentPlanOptions property required by AiChatbotWidget.
    paymentPlanOptions: "3 monthly payments of $283.58",
};

const mockPaymentHistory = [
    { date: '2024-07-15', amount: 150.00, method: 'Credit Card', confirmation: 'CNF78910-1' },
    { date: '2024-06-15', amount: 150.00, method: 'ACH', confirmation: 'CNF78910-2' },
    { date: '2024-05-15', amount: 150.00, method: 'Credit Card', confirmation: 'CNF78910-3' },
];

type PaymentOption = 'full' | 'settlement' | 'plan';
type PaymentMethod = 'credit' | 'ach';
type PaymentPlanTerm = 'weekly' | 'bi-weekly' | 'monthly';

interface Achievement {
    name: string;
    description: string;
    icon: IconName;
    paymentsRequired: number;
}

const achievements: Record<PaymentPlanTerm, Achievement[]> = {
    weekly: [
        { name: 'On Your Way!', description: 'You made your first payment!', paymentsRequired: 1, icon: 'rocket' },
        { name: 'Quarter Mark', description: 'You\'ve paid off 25% of your plan!', paymentsRequired: 7, icon: 'star' },
        { name: 'Halfway There!', description: 'You\'re 50% done!', paymentsRequired: 13, icon: 'trending-up' },
        { name: 'Debt Free!', description: 'You successfully paid off the balance!', paymentsRequired: 26, icon: 'trophy' },
    ],
    'bi-weekly': [
        { name: 'On Your Way!', description: 'You made your first payment!', paymentsRequired: 1, icon: 'rocket' },
        { name: 'Quarter Mark', description: 'You\'ve paid off 25% of your plan!', paymentsRequired: 4, icon: 'star' },
        { name: 'Halfway There!', description: 'You\'re 50% done!', paymentsRequired: 7, icon: 'trending-up' },
        { name: 'Debt Free!', description: 'You successfully paid off the balance!', paymentsRequired: 13, icon: 'trophy' },
    ],
    monthly: [
        { name: 'On Your Way!', description: 'You made your first payment!', paymentsRequired: 1, icon: 'rocket' },
        { name: 'Quarter Mark', description: 'You\'ve paid off 25% of your plan!', paymentsRequired: 2, icon: 'star' },
        { name: 'Halfway There!', description: 'You\'re 50% done!', paymentsRequired: 3, icon: 'trending-up' },
        { name: 'Debt Free!', description: 'You successfully paid off the balance!', paymentsRequired: 6, icon: 'trophy' },
    ],
};


const PaymentPage: React.FC<PaymentPageProps> = ({ onLogin, brandingProfile }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedOption, setSelectedOption] = useState<PaymentOption>('settlement');
    const [selectedPlanTerm, setSelectedPlanTerm] = useState<PaymentPlanTerm | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [paymentsMade, setPaymentsMade] = useState(0);

    const { settlementAmount, savingsAmount, savingsPercentage } = useMemo(() => {
        const settlement = mockDebtorData.currentbalance * (mockDebtorData.settlementOfferPercentage / 100);
        const savings = mockDebtorData.currentbalance - settlement;
        return {
            settlementAmount: settlement,
            savingsAmount: savings,
            savingsPercentage: mockDebtorData.settlementOfferPercentage,
        };
    }, []);
    
    const paymentPlans = useMemo(() => {
        const balance = mockDebtorData.currentbalance;
        const now = new Date();
        const resetDate = () => new Date(now.getTime()); // Create a fresh Date object for each calculation
    
        const monthlyDate = resetDate();
        const biWeeklyDate = resetDate();
        const weeklyDate = resetDate();
    
        return {
            monthly: { amount: balance / 6, term: 'monthly' as PaymentPlanTerm, totalPayments: 6, payoffDate: new Date(monthlyDate.setMonth(monthlyDate.getMonth() + 6)) },
            'bi-weekly': { amount: balance / 13, term: 'bi-weekly' as PaymentPlanTerm, totalPayments: 13, payoffDate: new Date(biWeeklyDate.setDate(biWeeklyDate.getDate() + 13 * 14)) },
            weekly: { amount: balance / 26, term: 'weekly' as PaymentPlanTerm, totalPayments: 26, payoffDate: new Date(weeklyDate.setDate(weeklyDate.getDate() + 26 * 7)) },
        };
    }, []);

    const { paymentAmount, buttonText, totalPaymentsInPlan } = useMemo(() => {
        let amount = 0;
        let text = 'Submit Payment';
        let totalPayments = 1;

        if (selectedOption === 'full') {
            amount = mockDebtorData.currentbalance;
        } else if (selectedOption === 'settlement') {
            amount = settlementAmount;
        } else if (selectedOption === 'plan' && selectedPlanTerm) {
            const plan = paymentPlans[selectedPlanTerm];
            amount = plan.amount;
            totalPayments = plan.totalPayments;
        }
        
        if (paymentStatus === 'processing') {
            text = 'Processing...';
        } else if (selectedOption === 'plan') {
            text = `Submit Payment ${paymentsMade + 1} of ${totalPayments} ($${amount.toFixed(2)})`;
        } else {
            text = `Submit Payment of $${amount.toFixed(2)}`;
        }
        
        return { paymentAmount: amount, buttonText: text, totalPaymentsInPlan: totalPayments };
    }, [selectedOption, selectedPlanTerm, settlementAmount, paymentPlans, paymentStatus, paymentsMade]);

    const financialFreedomScore = useMemo(() => {
        if (selectedOption !== 'plan' || !selectedPlanTerm) return 0;
        return (paymentsMade / totalPaymentsInPlan) * 100;
    }, [paymentsMade, selectedOption, selectedPlanTerm, totalPaymentsInPlan]);
    
    const { unlockedAchievements, nextAchievement } = useMemo(() => {
        if (!selectedPlanTerm) return { unlockedAchievements: [], nextAchievement: null };
        const planAchievements = achievements[selectedPlanTerm];
        const unlocked = planAchievements.filter(a => paymentsMade >= a.paymentsRequired);
        const next = planAchievements.find(a => paymentsMade < a.paymentsRequired) || null;
        return { unlockedAchievements: unlocked, nextAchievement };
    }, [paymentsMade, selectedPlanTerm]);


    const handlePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            if (selectedOption === 'plan') {
                setPaymentsMade(prev => prev + 1);
            }
            setPaymentStatus('success');
        }, 2500);
    };
    
    const resetToIdle = () => {
        if(selectedOption !== 'plan' || financialFreedomScore >= 100) {
            setPaymentsMade(0);
        }
        setPaymentStatus('idle');
    }

    const handleLoginSuccess = () => {
        // Simulate getting IP, in a real app this might come from a server-side request
        const mockIp = `75.1${Math.floor(Math.random() * 90 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        onLogin(mockDebtorData.fullname, mockIp);
        setIsAuthenticated(true);
    };


    if (!isAuthenticated) {
        return <PaymentLogin onLoginSuccess={handleLoginSuccess} />;
    }

    if (paymentStatus === 'success') {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-brand-primary p-4">
                 <div className="w-full max-w-lg text-center bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700">
                    <Icon name="check" className="h-16 w-16 mx-auto bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 rounded-full p-3 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Successful!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">Thank you, {mockDebtorData.fullname}. Your payment of <span className="font-semibold">${paymentAmount.toFixed(2)}</span> has been processed.</p>
                    {selectedOption === 'plan' && (
                        <div className="mt-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Your Financial Freedom Score has increased!</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mt-2">
                                <div 
                                    className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-center text-xs font-bold text-white" 
                                    style={{ width: `${financialFreedomScore}%` }}
                                >
                                   {financialFreedomScore.toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={resetToIdle} className="mt-6 bg-brand-accent text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-500 transition-colors">
                        Done
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex-1 bg-slate-50 dark:bg-brand-primary p-4 md:p-8">
            <style>{`:root { --brand-color: ${brandingProfile.brandColor || '#38BDF8'}; }`}</style>
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    {brandingProfile.logoUrl ? (
                         <img src={brandingProfile.logoUrl} alt={`${brandingProfile.companyName} logo`} className="h-10 w-auto" />
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{brandingProfile.companyName}</h1>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Icon name="shield-check" className="h-5 w-5 text-green-500" />
                        <span>Secure Payment Portal</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <FinancialProgressTracker 
                            debtor={mockDebtorData}
                            score={financialFreedomScore}
                            unlockedAchievements={unlockedAchievements}
                            nextAchievement={nextAchievement}
                            selectedPlanTerm={selectedPlanTerm}
                        />

                        <CreditorInfo debtor={mockDebtorData} />
                        <PaymentHistory />

                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Choose a one-time payment option:</h2>
                            <PaymentOptionCard 
                                title="Pay in Full"
                                amount={mockDebtorData.currentbalance}
                                description="Resolve your account by paying the full balance today."
                                isSelected={selectedOption === 'full'}
                                onClick={() => { setSelectedOption('full'); setSelectedPlanTerm(null); }}
                            />
                            <PaymentOptionCard 
                                title="Settle for Less"
                                amount={settlementAmount}
                                description={`Save ${savingsPercentage}%! Resolve your account with a one-time payment.`}
                                isSelected={selectedOption === 'settlement'}
                                savings={savingsAmount}
                                onClick={() => { setSelectedOption('settlement'); setSelectedPlanTerm(null); }}
                            />
                        </div>
                         <div className="bg-white dark:bg-brand-secondary p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 space-y-3">
                             <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Or, set up a payment plan:</h3>
                            <PaymentPlanCard
                                title="Weekly Payments"
                                amount={paymentPlans.weekly.amount}
                                totalPayments={paymentPlans.weekly.totalPayments}
                                payoffDate={paymentPlans.weekly.payoffDate}
                                isSelected={selectedPlanTerm === 'weekly'}
                                onClick={() => { setSelectedOption('plan'); setSelectedPlanTerm('weekly'); }}
                            />
                            <PaymentPlanCard
                                title="Bi-Weekly Payments"
                                amount={paymentPlans['bi-weekly'].amount}
                                totalPayments={paymentPlans['bi-weekly'].totalPayments}
                                payoffDate={paymentPlans['bi-weekly'].payoffDate}
                                isSelected={selectedPlanTerm === 'bi-weekly'}
                                onClick={() => { setSelectedOption('plan'); setSelectedPlanTerm('bi-weekly'); }}
                            />
                             <PaymentPlanCard
                                title="Monthly Payments"
                                amount={paymentPlans.monthly.amount}
                                totalPayments={paymentPlans.monthly.totalPayments}
                                payoffDate={paymentPlans.monthly.payoffDate}
                                isSelected={selectedPlanTerm === 'monthly'}
                                onClick={() => { setSelectedOption('plan'); setSelectedPlanTerm('monthly'); }}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="mb-4">
                            <div className="flex border-b border-slate-200 dark:border-slate-700">
                                {brandingProfile.acceptCreditCard && <PaymentMethodTab label="Credit Card" icon="credit-card" active={selectedMethod === 'credit'} onClick={() => setSelectedMethod('credit')} />}
                                {brandingProfile.acceptAch && <PaymentMethodTab label="Bank Account" icon="building" active={selectedMethod === 'ach'} onClick={() => setSelectedMethod('ach')} />}
                            </div>
                        </div>
                        {selectedMethod === 'credit' && <CreditCardForm />}
                        {selectedMethod === 'ach' && <AchForm />}
                        
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                                <span>Payment Amount:</span>
                                <span>${paymentAmount.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={handlePayment} 
                                disabled={paymentStatus === 'processing'}
                                className="w-full mt-4 bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-sky-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{ backgroundColor: brandingProfile.brandColor }}
                            >
                                {paymentStatus === 'processing' ? <Icon name="spinner" className="h-6 w-6 animate-spin"/> : <Icon name="shield-check" className="h-6 w-6"/>}
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AiChatbotWidget debtorData={mockDebtorData} />
        </div>
    );
};

const FinancialProgressTracker: React.FC<{
    debtor: typeof mockDebtorData;
    score: number;
    unlockedAchievements: Achievement[];
    nextAchievement: Achievement | null;
    selectedPlanTerm: PaymentPlanTerm | null;
}> = ({ debtor, score, unlockedAchievements, nextAchievement, selectedPlanTerm }) => (
    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Path to Financial Freedom</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome, {debtor.fullname}. Let's resolve this together.</p>
        
        <div className="mt-4">
            <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Financial Freedom Score</p>
                <p className="text-2xl font-bold text-green-500">{score.toFixed(0)}<span className="text-lg">%</span></p>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mt-1">
                <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>

        {selectedPlanTerm && (
            <div className="mt-4 space-y-3">
                {nextAchievement && (
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg flex items-center gap-3">
                        <Icon name={nextAchievement.icon} className="h-8 w-8 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Next Milestone</p>
                            <p className="font-semibold text-slate-800 dark:text-white">{nextAchievement.name}</p>
                        </div>
                    </div>
                )}
                 <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Unlocked Achievements</p>
                     {unlockedAchievements.length > 0 ? (
                        <div className="flex items-center gap-4">
                            {unlockedAchievements.map(ach => (
                                <div key={ach.name} className="flex items-center gap-2 text-yellow-500" title={ach.description}>
                                    <Icon name={ach.icon} className="h-6 w-6"/>
                                    <span className="text-xs font-semibold">{ach.name}</span>
                                </div>
                            ))}
                        </div>
                     ) : <p className="text-sm text-slate-500 dark:text-slate-400">Make your first payment to start earning achievements!</p>}
                </div>
            </div>
        )}
    </div>
);

const CreditorInfo: React.FC<{ debtor: typeof mockDebtorData }> = ({ debtor }) => (
    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Icon name="building" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Account Information
        </h3>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Original Creditor:</span>
                <span className="font-semibold text-slate-800 dark:text-white">{debtor.originalcreditor}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Account Number:</span>
                <span className="font-mono text-slate-800 dark:text-white">{debtor.accountnumber}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Current Balance:</span>
                <span className="font-bold text-xl text-slate-800 dark:text-white">${debtor.currentbalance.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

const PaymentHistory: React.FC = () => (
    <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Icon name="clipboard-list" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            Payment History
        </h3>
        {mockPaymentHistory.length > 0 ? (
            <div className="overflow-x-auto max-h-48">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-2">Date</th>
                            <th scope="col" className="px-4 py-2">Amount</th>
                            <th scope="col" className="px-4 py-2">Method</th>
                            <th scope="col" className="px-4 py-2">Confirmation #</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {mockPaymentHistory.map((p, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3 whitespace-nowrap">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">${p.amount.toFixed(2)}</td>
                                <td className="px-4 py-3">{p.method}</td>
                                <td className="px-4 py-3 font-mono text-xs">{p.confirmation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
             <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No payment history found for this account.
            </div>
        )}
    </div>
);

const PaymentOptionCard: React.FC<{title: string, amount: number, description: string, savings?: number, isSelected: boolean, onClick: () => void}> = 
({title, amount, description, savings, isSelected, onClick}) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-[var(--brand-color)] bg-sky-50 dark:bg-sky-500/10' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-brand-secondary hover:border-slate-400 dark:hover:border-slate-500'}`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[var(--brand-color)]' : 'border-slate-400'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-color)]" />}
                 </div>
                 <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                 </div>
            </div>
            <div className="text-right">
                <p className="text-xl font-bold text-slate-900 dark:text-white">${amount.toFixed(2)}</p>
                {savings && <p className="text-xs font-semibold text-green-600 dark:text-green-400">Save ${savings.toFixed(2)}</p>}
            </div>
        </div>
    </div>
);

const PaymentPlanCard: React.FC<{ title: string; amount: number; totalPayments: number; payoffDate: Date; isSelected: boolean; onClick: () => void }> =
    ({ title, amount, totalPayments, payoffDate, isSelected, onClick }) => (
    <div onClick={onClick} className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-[var(--brand-color)] bg-sky-50 dark:bg-sky-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-secondary hover:border-slate-400 dark:hover:border-slate-500'}`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[var(--brand-color)]' : 'border-slate-400'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-color)]" />}
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span><Icon name="refresh" className="h-3 w-3 inline -mt-0.5"/> {totalPayments} payments</span>
                        <span><Icon name="calendar" className="h-3 w-3 inline -mt-0.5"/> Est. Payoff: {payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">${amount.toFixed(2)}</p>
        </div>
    </div>
);

const PaymentMethodTab: React.FC<{label: string, icon: any, active: boolean, onClick: () => void}> = ({label, icon, active, onClick}) => (
     <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${active ? 'border-[var(--brand-color)] text-[var(--brand-color)]' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>
        <Icon name={icon} className="h-5 w-5"/>
        {label}
    </button>
);

const FormInput: React.FC<{label: string, id: string, placeholder?: string, icon?: any}> = ({label, id, placeholder, icon}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            {icon && <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />}
            <input type="text" id={id} placeholder={placeholder} className={`w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ${icon ? 'pl-10' : ''}`} />
        </div>
    </div>
);

const CreditCardForm = () => (
    <div className="space-y-4">
        <FormInput label="Card Number" id="cc-number" placeholder="•••• •••• •••• ••••" icon="credit-card" />
        <FormInput label="Name on Card" id="cc-name" placeholder="Jane Doe" />
        <div className="grid grid-cols-2 gap-4">
            <FormInput label="Expiration (MM/YY)" id="cc-exp" placeholder="MM/YY" />
            <FormInput label="CVC" id="cc-cvc" placeholder="•••" />
        </div>
    </div>
);

const AchForm = () => (
     <div className="space-y-4">
        <FormInput label="Account Holder Name" id="ach-name" placeholder="Jane Doe" />
        <FormInput label="Routing Number" id="ach-routing" placeholder="•••••••••" />
        <FormInput label="Account Number" id="ach-account" placeholder="••••••••••••" />
    </div>
);

export default PaymentPage;
