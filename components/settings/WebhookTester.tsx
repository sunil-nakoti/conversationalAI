import React, { useState } from 'react';
import { Icon } from '../Icon';
import Tooltip from '../Tooltip';
import { WebhookTestResult } from '../../types';

const WebhookTester: React.FC = () => {
    const [url, setUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<WebhookTestResult | null>(null);

    const handleTest = () => {
        if (!url) return;
        setIsLoading(true);
        setResult(null);
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            setResult({
                status: success ? 'Success' : 'Failure',
                httpCode: success ? 200 : 503,
                latency: success ? Math.floor(Math.random() * 300) + 150 : null,
                message: success ? 'Test payload received successfully.' : 'Server returned an error or timed out.'
            });
            setIsLoading(false);
        }, 1500);
    };

    const ResultDisplay: React.FC<{ result: WebhookTestResult }> = ({ result }) => {
        const isSuccess = result.status === 'Success';
        const color = isSuccess ? 'green' : 'red';
        return (
            <div className={`mt-4 p-3 rounded-md border-l-4 bg-${color}-50 dark:bg-${color}-500/10 border-${color}-400`}>
                <div className="flex items-center gap-3">
                    <Icon name={isSuccess ? 'check' : 'warning'} className={`h-6 w-6 text-${color}-500`} />
                    <div>
                        <p className={`font-semibold text-lg text-${color}-700 dark:text-${color}-300`}>
                            {result.status} (HTTP {result.httpCode})
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {result.message}
                            {isSuccess && ` - Latency: ${result.latency}ms`}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="rocket" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Webhook Integration Diagnostic</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Test a client's webhook endpoint to ensure successful integration before going live.</p>
                </div>
            </div>
            <div className="space-y-4">
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Client Webhook URL" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Client API Key (Optional)" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white" />
                <button
                    onClick={handleTest}
                    disabled={isLoading || !url}
                    className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    <Icon name={isLoading ? 'spinner' : 'zap'} className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                    Test Integration
                </button>
            </div>
            {result && <ResultDisplay result={result} />}
        </div>
    );
};

export default WebhookTester;
