
// FIX: Created CampaignImport component.
import React, { useState, useCallback, useRef } from 'react';
// FIX: Import DebtorStatus to resolve type incompatibility error.
import { Debtor, CsvHeaderMapping, DebtorStatus, Portfolio } from '../types';
import { mapCsvHeaders } from '../services/geminiService';
import MappingConfirmationModal from './MappingConfirmationModal';
import { Icon } from './Icon';
import Tooltip from './Tooltip';

// Simple unique ID generator
const generateUniqueId = () => `debtor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const REQUIRED_DB_FIELDS = [
    'fullname',
    'accountnumber',
    'originalcreditor',
    'currentbalance',
    'phone1',
    'phone2',
    'phone3',
    'email',
    'address',
    'city',
    'state',
    'zip',
];

interface CampaignImportProps {
    setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[]>>;
}

const CampaignImport: React.FC<CampaignImportProps> = ({ setPortfolios }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [suggestedMapping, setSuggestedMapping] = useState<CsvHeaderMapping>({});
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const parseCsv = (fileContent: string): { headers: string[], data: string[][] } => {
        const rows = fileContent.split('\n').filter(row => row.trim() !== '');
        if (rows.length < 1) return { headers: [], data: [] };
        const headers = rows[0].replace(/\r$/, '').split(',').map(h => h.trim());
        const data = rows.slice(1).map(row => row.replace(/\r$/, '').split(',').map(cell => cell.trim()));
        return { headers, data };
    };

    const processFile = useCallback(async (file: File) => {
        if (!file) return;

        if (!file.type.includes('csv')) {
            setError('Invalid file type. Please upload a CSV file.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const { headers, data } = parseCsv(text);

                if (headers.length === 0 || data.length === 0) {
                    throw new Error("CSV file is empty or improperly formatted.");
                }

                setCsvHeaders(headers);
                setCsvData(data);
                
                const mapping = await mapCsvHeaders(headers, REQUIRED_DB_FIELDS);
                setSuggestedMapping(mapping);
                setIsModalOpen(true);
            } catch (err: any) {
                setError(err.message || 'Failed to process CSV file.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setError('Failed to read the file.');
            setIsLoading(false);
        };

        reader.readAsText(file);
    }, []);
    
    const handleDownloadSample = () => {
        const headers = REQUIRED_DB_FIELDS.join(',');
        const sampleRow1 = "John Doe,ACC-SAMPLE-01,Sample Creditor,1500.50,555-111-2222,,,,123 Main St,Anytown,CA,12345";
        const sampleRow2 = "Jane Smith,ACC-SAMPLE-02,Another Bank,750.00,555-333-4444,,,,456 Oak Ave,Someville,NY,54321";
        const csvContent = `${headers}\n${sampleRow1}\n${sampleRow2}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) { 
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "sample_campaign.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };
    
    const onButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleConfirmMapping = (finalMapping: CsvHeaderMapping) => {
        const newDebtors: Debtor[] = csvData.map(row => {
            const debtorData: Partial<Debtor & { originalcreditor: string }> = {};
            csvHeaders.forEach((header, index) => {
                const dbField = finalMapping[header];
                if (dbField && dbField !== 'null') {
                    (debtorData as any)[dbField] = row[index];
                }
            });
            
            const channels: ('SMS' | 'Call' | 'Email')[] = ['SMS', 'Call', 'Email'];

            return {
                id: generateUniqueId(),
                fullname: debtorData.fullname || 'N/A',
                accountnumber: debtorData.accountnumber || 'N/A',
                originalcreditor: debtorData.originalcreditor || 'N/A',
                currentbalance: parseFloat(String(debtorData.currentbalance || '0').replace(/[^0-9.-]+/g,"")) || 0,
                status: 'Not Verified' as DebtorStatus,
                phone1: debtorData.phone1,
                phone2: debtorData.phone2,
                phone3: debtorData.phone3,
                email: debtorData.email,
                address: debtorData.address,
                city: debtorData.city,
                state: debtorData.state,
                zip: debtorData.zip,
                callHistory: [],
                propensityScore: Math.floor(Math.random() * 100) + 1,
                contactOutlook: {
                    heatmap: Array.from({ length: 7 }, () => Array.from({ length: 3 }, () => Math.random())),
                    optimalChannel: channels[Math.floor(Math.random() * channels.length)],
                },
            };
        }).filter(d => d.fullname !== 'N/A' && d.accountnumber !== 'N/A');

        setPortfolios(prevPortfolios => {
            if (prevPortfolios.length === 0) {
                const totalScore = newDebtors.reduce((acc, d) => acc + (d.propensityScore || 0), 0);
                const averagePropensityScore = newDebtors.length > 0 ? totalScore / newDebtors.length : 0;
                return [{
                    id: `portfolio_${Date.now()}`,
                    name: "Imported Portfolio",
                    debtors: newDebtors,
                    numberOfAccounts: newDebtors.length,
                    averageBalance: newDebtors.reduce((acc, d) => acc + d.currentbalance, 0) / (newDebtors.length || 1),
                    contactAttempts: 0,
                    settlementFee: newDebtors.reduce((acc, d) => acc + d.currentbalance, 0),
                    status: 'Idle',
                    averagePropensityScore,
                }];
            } else {
                return prevPortfolios.map((portfolio, index) => {
                    if (index === 0) {
                        const combinedDebtors = [...portfolio.debtors, ...newDebtors];
                        const totalBalance = combinedDebtors.reduce((acc, d) => acc + d.currentbalance, 0);
                        const totalScore = combinedDebtors.reduce((acc, d) => acc + (d.propensityScore || 0), 0);
                        const averagePropensityScore = combinedDebtors.length > 0 ? totalScore / combinedDebtors.length : 0;
                        return {
                            ...portfolio,
                            debtors: combinedDebtors,
                            numberOfAccounts: combinedDebtors.length,
                            averageBalance: totalBalance / (combinedDebtors.length || 1),
                            settlementFee: totalBalance,
                            averagePropensityScore,
                        };
                    }
                    return portfolio;
                });
            }
        });

        setIsModalOpen(false);
        setCsvData([]);
        setCsvHeaders([]);
        setSuggestedMapping({});
    };

    return (
        <section className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
             <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Import Campaign</h2>
                <Tooltip content="Upload a CSV file containing debtor accounts. Our AI will automatically map the headers to the required database fields.">
                    <Icon name="info" className="h-5 w-5 text-slate-400" />
                </Tooltip>
            </div>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${isDragActive ? 'border-brand-accent bg-sky-50 dark:bg-brand-accent/10' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}
                    ${isLoading ? 'animate-pulse' : ''}`}
            >
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
                <div className="text-center">
                    <Icon name={isLoading ? 'spinner' : 'upload'} className={`h-12 w-12 mx-auto text-slate-400 mb-3 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? (
                         <p className="text-slate-500 dark:text-slate-300">Processing file...</p>
                    ) : isDragActive ? (
                        <p className="text-brand-accent font-semibold">Drop the files here ...</p>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-brand-accent">Click to upload</span> or drag and drop a CSV file
                        </p>
                    )}
                </div>
            </div>
            {error && <p className="mt-3 text-sm text-brand-danger">{error}</p>}
            
            <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Required CSV Headers</h4>
                     <button onClick={handleDownloadSample} className="flex items-center gap-2 text-xs font-semibold text-brand-accent hover:text-sky-400">
                        <Icon name="download" className="h-4 w-4" />
                        Download Sample CSV
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {REQUIRED_DB_FIELDS.map(field => (
                        <span key={field} className="bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{field}</span>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <MappingConfirmationModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmMapping}
                    initialMapping={suggestedMapping}
                    csvHeaders={csvHeaders}
                    dbFields={REQUIRED_DB_FIELDS}
                />
            )}
        </section>
    );
};

export default CampaignImport;