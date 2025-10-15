import React, { useState } from 'react';
// FIX: Corrected import path for Icon component
import { Icon } from '../Icon';

interface PhoneNumberPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    // FIX: Changed onPurchase prop from `any` to `string[]` for type safety.
    onPurchase: (numbers: string[]) => void;
}

const mockAvailableNumbers = [
    { number: '+1 (415) 555-0101', type: 'Local', cost: 1.00 },
    { number: '+1 (415) 555-0102', type: 'Local', cost: 1.00 },
    { number: '+1 (888) 555-0103', type: 'Toll-Free', cost: 2.00 },
    { number: '+1 (415) 555-0104', type: 'Local', cost: 1.00 },
];

const PhoneNumberPurchaseModal: React.FC<PhoneNumberPurchaseModalProps> = ({ isOpen, onClose, onPurchase }) => {
    const [areaCode, setAreaCode] = useState('');
    // FIX: Explicitly type useState to ensure selectedNumbers is Set<string>, not Set<unknown>.
    const [selectedNumbers, setSelectedNumbers] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const toggleSelection = (number: string) => {
        setSelectedNumbers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(number)) {
                newSet.delete(number);
            } else {
                newSet.add(number);
            }
            return newSet;
        });
    };

    const handleSearch = () => {
        if (!areaCode) return;
        setIsLoading(true);
        setTimeout(() => {
            // Simulate API call to find numbers
            setIsLoading(false);
        }, 1000);
    };

    const handlePurchase = () => {
        // FIX: Use spread syntax to safely convert Set<string> to string[], resolving 'unknown[]' type error.
        onPurchase([...selectedNumbers]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Purchase New Phone Numbers</h2>
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={areaCode}
                            onChange={(e) => setAreaCode(e.target.value)}
                            placeholder="Search by Area Code (e.g., 415)"
                            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                        />
                        <button onClick={handleSearch} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">
                            Search
                        </button>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <Icon name="spinner" className="h-8 w-8 text-sky-600 dark:text-brand-accent animate-spin" />
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <tbody>
                                    {mockAvailableNumbers.map(num => (
                                        <tr key={num.number} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNumbers.has(num.number)}
                                                    onChange={() => toggleSelection(num.number)}
                                                    className="w-4 h-4 text-brand-accent bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-500 rounded focus:ring-brand-accent"
                                                />
                                            </td>
                                            <td className="p-3 font-mono text-slate-900 dark:text-white">{num.number}</td>
                                            <td className="p-3 text-slate-500 dark:text-slate-300">{num.type}</td>
                                            <td className="p-3 text-right font-semibold text-green-600 dark:text-green-400">${num.cost.toFixed(2)}/mo</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <span className="text-slate-600 dark:text-slate-300">{selectedNumbers.size} number(s) selected</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handlePurchase} disabled={selectedNumbers.size === 0} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600">
                            Purchase ({selectedNumbers.size})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneNumberPurchaseModal;