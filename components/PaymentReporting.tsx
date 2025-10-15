import React, { useState, useEffect, useMemo } from 'react';
import { Payment, ScheduledPayment } from '../types';
import { Icon } from './Icon';
import Tooltip from './Tooltip';
import KpiDashboard from './reporting/KpiDashboard';
import ReportingActions from './reporting/ReportingActions';
import PaymentHistoryTable from './reporting/PaymentHistoryTable';

const debtorNames = ["Olivia Chen", "Benjamin Carter", "Sophia Rodriguez", "Liam Goldberg", "Ava Nguyen", "Noah Patel", "Isabella Kim", "Mason Williams", "Mia Garcia", "Lucas Martinez"];
const portfolios = [{ id: 'portfolio_1', name: 'Q3 High-Priority Placement' }, { id: 'portfolio_2', name: 'Midland Credit - Active' }];

// --- MOCK DATA & API SIMULATION ---
const generateMockPayments = (count: number): Payment[] => {
    const payments: Payment[] = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const debtorIndex = i % debtorNames.length;
        const portfolioIndex = i % portfolios.length;
        const paymentDate = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // Last 30 days
        payments.push({
            id: `pay_${i}`,
            debtorId: `d_${debtorIndex}`,
            debtorName: debtorNames[debtorIndex],
            accountNumber: `ACC-${1000 + i}`,
            portfolioId: portfolios[portfolioIndex].id,
            portfolioName: portfolios[portfolioIndex].name,
            paymentAmount: parseFloat((Math.random() * 500 + 50).toFixed(2)),
            paymentDate: paymentDate.toISOString(),
            paymentMethod: Math.random() > 0.4 ? 'Online' : 'Telephonic',
            paymentType: ['Settlement', 'Payment Plan', 'Custom'][Math.floor(Math.random() * 3)] as Payment['paymentType'],
            status: 'Completed',
            confirmationNumber: `CNF${Date.now()}${i}`
        });
    }
    return payments;
};

const generateMockScheduledPayments = (count: number): ScheduledPayment[] => {
    const payments: ScheduledPayment[] = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const isMissed = Math.random() > 0.7;
        const scheduledDate = new Date(now.getTime() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000);
        if (isMissed && scheduledDate > now) continue; // Can't miss a future payment

        payments.push({
            id: `sch_${i}`,
            debtorId: `d_${i % debtorNames.length}`,
            debtorName: debtorNames[i % debtorNames.length],
            accountNumber: `ACC-${2000 + i}`,
            paymentPlanId: `plan_${i % 10}`,
            scheduledDate: scheduledDate.toISOString(),
            scheduledAmount: parseFloat((Math.random() * 200 + 25).toFixed(2)),
            status: isMissed ? 'Missed' : 'Paid',
        });
    }
    return payments;
};

const mockPayments = generateMockPayments(150);
const mockScheduledPayments = generateMockScheduledPayments(30);

const fetchPaymentSummary = async () => {
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentPayments = mockPayments.filter(p => new Date(p.paymentDate) >= last30Days);
    
    const totalCollected = recentPayments.reduce((sum, p) => sum + p.paymentAmount, 0);
    const totalPayments = recentPayments.length;
    const avgPayment = totalPayments > 0 ? totalCollected / totalPayments : 0;
    
    const methodBreakdown = recentPayments.reduce((acc, p) => {
        acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
        return acc;
    }, {} as Record<Payment['paymentMethod'], number>);

    const typeBreakdown = recentPayments.reduce((acc, p) => {
        acc[p.paymentType] = (acc[p.paymentType] || 0) + 1;
        return acc;
    }, {} as Record<Payment['paymentType'], number>);

    return { totalCollected, totalPayments, avgPayment, methodBreakdown, typeBreakdown };
};

const fetchPaymentHistory = async () => {
    await new Promise(res => setTimeout(res, 500));
    return mockPayments;
};

const fetchMissedPayments = async () => {
    await new Promise(res => setTimeout(res, 500));
    return mockScheduledPayments.filter(p => p.status === 'Missed');
};


const PaymentReporting: React.FC = () => {
    const [summary, setSummary] = useState<Awaited<ReturnType<typeof fetchPaymentSummary>> | null>(null);
    const [history, setHistory] = useState<Payment[]>([]);
    const [missed, setMissed] = useState<ScheduledPayment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [summaryData, historyData, missedData] = await Promise.all([
                fetchPaymentSummary(),
                fetchPaymentHistory(),
                fetchMissedPayments(),
            ]);
            setSummary(summaryData);
            setHistory(historyData);
            setMissed(missedData);
            setLoading(false);
        };
        loadData();
    }, []);
    
    const SkeletonLoader = () => (
        <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
                <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
                <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg"></div>
                <div className="bg-slate-200 dark:bg-brand-secondary h-28 rounded-lg lg:col-span-2"></div>
            </div>
             <div className="bg-slate-200 dark:bg-brand-secondary h-16 rounded-lg"></div>
             <div className="bg-slate-200 dark:bg-brand-secondary h-96 rounded-lg"></div>
        </div>
    );

    return (
        <section>
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Payment Reporting Dashboard</h2>
                <Tooltip content="Central hub for tracking all payment activities from AI agents and the online payment portal.">
                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                </Tooltip>
            </div>

            {loading ? <SkeletonLoader /> : (
                <div className="space-y-6">
                    {summary && <KpiDashboard summary={summary} missedCount={missed.length} />}
                    <PaymentHistoryTable paymentHistory={history} missedPayments={missed} portfolios={portfolios} />
                </div>
            )}
        </section>
    );
};

export default PaymentReporting;
