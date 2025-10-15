import React, { useState, useEffect, useMemo } from 'react';
import { Payment, ScheduledPayment, Portfolio } from '../types';
import { Icon } from './Icon';
import Tooltip from './Tooltip';
import KpiDashboard from './reporting/KpiDashboard';
import PaymentHistoryTable from './reporting/PaymentHistoryTable';
import { apiService } from '../services/apiService';

const PaymentReporting: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [history, setHistory] = useState<Payment[]>([]);
    const [missed, setMissed] = useState<ScheduledPayment[]>([]);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [reportingData, portfolioData] = await Promise.all([
                    apiService.getReportingData(),
                    apiService.getPortfolios()
                ]);

                setSummary(reportingData.summary);
                setHistory(reportingData.paymentHistory);
                setMissed(reportingData.missedPayments);
                setPortfolios(portfolioData);

            } catch (err: any) {
                setError(err.message || "Failed to load reporting data.");
            } finally {
                setLoading(false);
            }
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

            {loading ? <SkeletonLoader /> : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="space-y-6">
                    {summary && <KpiDashboard summary={summary} missedCount={missed.length} />}
                    <PaymentHistoryTable paymentHistory={history} missedPayments={missed} portfolios={portfolios} />
                </div>
            )}
        </section>
    );
};

export default PaymentReporting;
