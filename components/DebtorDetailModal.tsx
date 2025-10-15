import React from 'react';
// FIX: Corrected import path for types.ts
import { Debtor } from '../types';
import { Icon } from './Icon';
import ContactOutlook from './ContactOutlook';

interface DebtorDetailModalProps {
    debtor: Debtor;
    onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | number | undefined; icon: any }> = ({ label, value, icon }) => (
    <div className="flex items-start gap-3">
        <Icon name={icon} className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="font-medium text-slate-800 dark:text-white">{value || 'N/A'}</p>
        </div>
    </div>
);


const DebtorDetailModal: React.FC<DebtorDetailModalProps> = ({ debtor, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{debtor.fullname}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Account: {debtor.accountnumber}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Financial Details */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Financials</h3>
                        <DetailRow label="Current Balance" value={`$${debtor.currentbalance.toLocaleString()}`} icon="dollar" />
                        <DetailRow label="Original Creditor" value={debtor.originalcreditor} icon="building" />
                        <DetailRow label="Propensity Score" value={debtor.propensityScore} icon="trending-up" />
                        <DetailRow label="Status" value={debtor.status} icon="check" />
                    </div>
                    
                    {/* Contact Details */}
                    <div className="space-y-4">
                         <h3 className="text-md font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Contact Information</h3>
                        {Array.from({ length: 10 }, (_, i) => {
                            const phoneKey = `phone${i + 1}` as keyof Debtor;
                            const phoneValue = debtor[phoneKey];
                            return phoneValue ? <DetailRow key={phoneKey} label={`Phone ${i + 1}`} value={phoneValue as string} icon="phone" /> : null;
                        })}
                        <DetailRow label="Email" value={debtor.email} icon="email" />
                        <DetailRow label="Address" value={`${debtor.address || ''}, ${debtor.city || ''}, ${debtor.state || ''} ${debtor.zip || ''}`} icon="map-pin" />
                    </div>

                    {/* Contact Outlook */}
                    {debtor.contactOutlook && (
                        <div className="md:col-span-2">
                            <ContactOutlook outlook={debtor.contactOutlook} />
                        </div>
                    )}

                     {/* Call History */}
                    <div className="md:col-span-2">
                         <h3 className="text-md font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Call History</h3>
                        <div className="mt-2 text-center text-slate-500 dark:text-slate-400 text-sm py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <p>Call history not available in this view.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Close
                    </button>
                    <button className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Initiate Manual Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebtorDetailModal;