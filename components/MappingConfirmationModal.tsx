

// FIX: Recreated the component from scratch to resolve file content issues.
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types
import { CsvHeaderMapping } from '../types';

interface MappingConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (mapping: CsvHeaderMapping) => void;
    initialMapping: CsvHeaderMapping;
    csvHeaders: string[];
    dbFields: string[];
}

const MappingConfirmationModal: React.FC<MappingConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialMapping,
    csvHeaders,
    dbFields,
}) => {
    const [mapping, setMapping] = useState<CsvHeaderMapping>(initialMapping);

    useEffect(() => {
        setMapping(initialMapping);
    }, [initialMapping]);

    if (!isOpen) {
        return null;
    }
    
    const handleMappingChange = (csvHeader: string, dbField: string) => {
        setMapping(prev => ({ ...prev, [csvHeader]: dbField }));
    };

    const dbFieldOptions = ['null', ...dbFields];

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Confirm CSV Header Mapping</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Our AI has suggested a mapping from your CSV headers to our database fields. Please review and adjust if necessary.
                    </p>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                        <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">CSV Header</th>
                                <th scope="col" className="px-6 py-3">Database Field</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvHeaders.map(header => (
                                <tr key={header} className="border-b border-slate-200 dark:border-slate-700/50 last:border-b-0">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{header}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={mapping[header] || 'null'}
                                            onChange={(e) => handleMappingChange(header, e.target.value)}
                                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block w-full p-2.5"
                                        >
                                            {dbFieldOptions.map(field => (
                                                <option key={field} value={field}>
                                                    {field === 'null' ? 'Do not import' : field}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => onConfirm(mapping)} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        Confirm & Import
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MappingConfirmationModal;