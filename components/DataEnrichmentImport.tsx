import React, { useState, useCallback, useRef } from 'react';
import { Debtor, CsvHeaderMapping, Portfolio } from '../types';
import { mapCsvHeaders } from '../services/geminiService';
import MappingConfirmationModal from './MappingConfirmationModal';
import { Icon } from './Icon';
import Tooltip from './Tooltip';

const ENRICHMENT_DB_FIELDS = [
    'accountnumber',
    'phone1', 'phone2', 'phone3', 'phone4', 'phone5', 'phone6', 'phone7', 'phone8', 'phone9', 'phone10',
    'email',
    'address', 'city', 'state', 'zip',
];

interface DataEnrichmentImportProps {
    portfolios: Portfolio[];
    setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[]>>;
}

const DataEnrichmentImport: React.FC<DataEnrichmentImportProps> = ({ portfolios, setPortfolios }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [suggestedMapping, setSuggestedMapping] = useState<CsvHeaderMapping>({});
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseCsv = (fileContent: string): { headers: string[], data: Record<string, string>[] } => {
        const rows = fileContent.split('\n').filter(row => row.trim() !== '');
        if (rows.length < 1) return { headers: [], data: [] };
        const headers = rows[0].replace(/\r$/, '').split(',').map(h => h.trim());
        const data = rows.slice(1).map(row => {
            const values = row.replace(/\r$/, '').split(',').map(cell => cell.trim());
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {} as Record<string, string>);
        });
        return { headers, data };
    };

    const processFile = useCallback(async (file: File) => {
        if (!file) return;
        setIsLoading(true);
        setError(null);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const { headers, data } = parseCsv(text);
                if (headers.length === 0 || data.length === 0) throw new Error("CSV is empty.");

                setCsvHeaders(headers);
                setCsvData(data);
                
                const mapping = await mapCsvHeaders(headers, ENRICHMENT_DB_FIELDS);
                setSuggestedMapping(mapping);
                setIsModalOpen(true);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    }, []);
    
    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(e.type === "dragenter" || e.type === "dragover"); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) processFile(e.target.files[0]); };
    const onButtonClick = () => fileInputRef.current?.click();

    const handleConfirmMapping = (finalMapping: CsvHeaderMapping) => {
        const updatesByAccountNumber = csvData.reduce<Record<string, Record<string, string>>>((acc, row) => {
            const mappedData: Record<string, string> = {};
            let accountNumber: string | null = null;
            
            Object.entries(row).forEach(([header, value]) => {
                const dbField = finalMapping[header];
                if (dbField && dbField !== 'null' && value) {
                    if (dbField === 'accountnumber') {
                        accountNumber = value;
                    } else {
                        mappedData[dbField] = value;
                    }
                }
            });

            if (accountNumber) {
                acc[accountNumber] = mappedData;
            }
            return acc;
        }, {});

        setPortfolios(prevPortfolios =>
            prevPortfolios.map(portfolio => ({
                ...portfolio,
                debtors: portfolio.debtors.map(debtor => {
                    if (updatesByAccountNumber[debtor.accountnumber]) {
                        const updates = updatesByAccountNumber[debtor.accountnumber];
                        const enrichedDebtor = { ...debtor };

                        const phoneUpdates = Object.keys(updates)
                            .filter(key => key.startsWith('phone'))
                            .map(key => updates[key]);
                        
                        if (phoneUpdates.length > 0) {
                            let phoneIndex = 1;
                            while(phoneIndex <= 10) {
                                const phoneKey = `phone${phoneIndex}` as keyof Debtor;
                                if (!enrichedDebtor[phoneKey]) {
                                    const nextPhone = phoneUpdates.shift();
                                    if (nextPhone) {
                                        (enrichedDebtor as any)[phoneKey] = nextPhone;
                                    } else {
                                        break; // No more phones to add
                                    }
                                }
                                phoneIndex++;
                            }
                        }

                        if (updates.email) {
                            enrichedDebtor.email = updates.email;
                        }

                        if (updates.address && typeof updates.address === 'string') {
                            enrichedDebtor.address = updates.address;
                        }

                        if (updates.city && typeof updates.city === 'string') {
                            enrichedDebtor.city = updates.city;
                        }
                        // FIX: Added a `typeof` check to ensure the value is a string before assignment.
                        if (updates.state && typeof updates.state === 'string') {
                            enrichedDebtor.state = updates.state;
                        }
                        // FIX: Added a `typeof` check to ensure the value is a string before assignment.
                        if (updates.zip && typeof updates.zip === 'string') {
                            enrichedDebtor.zip = updates.zip;
                        }

                        return enrichedDebtor;
                    }
                    return debtor;
                }),
            }))
        );

        setIsModalOpen(false);
    };

    return (
        <section className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-center gap-2 mb-4">
                <Icon name="plus-square" className="h-6 w-6 text-sky-500 dark:text-brand-accent"/>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Data Enrichment Import</h2>
                <Tooltip content="Update existing debtor records by uploading a CSV. Match records by 'accountnumber' to add new phone numbers, emails, or addresses.">
                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                </Tooltip>
            </div>
            <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={onButtonClick}
                className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-brand-accent bg-sky-50 dark:bg-brand-accent/10' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
            >
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
                <div className="text-center">
                    <Icon name={isLoading ? 'spinner' : 'upload'} className={`h-12 w-12 mx-auto text-slate-400 mb-3 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? (<p>Processing...</p>) : isDragActive ? (<p>Drop file...</p>) : (<p><span className="font-semibold text-brand-accent">Click to upload</span> or drag and drop a CSV</p>)}
                </div>
            </div>
            {error && <p className="mt-3 text-sm text-brand-danger">{error}</p>}
            <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">CSV must contain an 'accountnumber' column to match records.</p>
            
            {isModalOpen && (
                <MappingConfirmationModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmMapping}
                    initialMapping={suggestedMapping}
                    csvHeaders={csvHeaders}
                    dbFields={ENRICHMENT_DB_FIELDS}
                />
            )}
        </section>
    );
};

export default DataEnrichmentImport;