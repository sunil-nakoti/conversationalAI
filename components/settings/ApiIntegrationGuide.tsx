import React from 'react';
import { Icon } from '../Icon';

const CodeBlock = ({ language, children }: { language: string, children: React.ReactNode }) => (
    <div className="bg-slate-800 rounded-lg my-4 not-prose">
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700">
            <span className="text-xs font-semibold text-slate-300">{language}</span>
            <button 
                onClick={() => navigator.clipboard.writeText(children as string)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
                <Icon name="copy" className="h-3 w-3" /> Copy
            </button>
        </div>
        <pre className="p-4 text-sm text-white overflow-x-auto">
            <code>
                {children}
            </code>
        </pre>
    </div>
);

const ApiIntegrationGuide: React.FC = () => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white not-prose">API Integration Guide: Accessing DQI & AI Priority Scores from Debt Catalyst</h3>
                
                <p>To pull key performance indicators like the Debtor Quality Index (DQI) and AI Priority Scores into your own system, you can use the following REST API endpoints.</p>

                <h4>Authentication</h4>
                <p>All API requests must be authenticated using a Bearer Token provided by Debt Catalyst. The token should be included in the <code>Authorization</code> header of your request.</p>
                {/* FIX: The CodeBlock component requires content to be passed as children. */}
                <CodeBlock language="Header">
                    {'Authorization: Bearer <YOUR_API_TOKEN>'}
                </CodeBlock>
                <p>You can generate and manage API tokens from your account settings within the Debt Catalyst application.</p>

                <h4>1. Fetching Portfolio-Level Averages</h4>
                <p>To get the average AI Priority Score and average DQI for an entire portfolio, use the portfolio stats endpoint. This is useful for high-level dashboarding.</p>
                <p><strong>Endpoint:</strong></p>
                {/* FIX: The CodeBlock component requires content to be passed as children. */}
                <CodeBlock language="Endpoint">
                    {'GET /api/portfolios/{portfolioId}/stats'}
                </CodeBlock>
                <p><strong>Example Response:</strong></p>
                {/* FIX: The CodeBlock component requires content to be passed as children. */}
                <CodeBlock language="JSON">
{`{
  "totalAccounts": 1000,
  "totalBalance": 5000000,
  "averageBalance": 5000,
  "averageDQI": 58.4,
  "averageEconomicStrengthIndex": 62.1,
  "averageRecoveryPriorityScore": 71.3,
  "...other portfolio statistics"
}`}
                </CodeBlock>
                <p>The <strong>Average AI Priority Score</strong> is the value in the <code>averageRecoveryPriorityScore</code> field.</p>
                <p>The <strong>Average DQI Score</strong> is the value in the <code>averageDQI</code> field.</p>

                <h4>2. Fetching Account-Level DQI Scores</h4>
                <p>To get the specific DQI score for each individual account, use the accounts endpoint. This endpoint is paginated, allowing you to retrieve account data in manageable chunks.</p>
                <p><strong>Endpoint:</strong></p>
                {/* FIX: The CodeBlock component requires content to be passed as children. */}
                <CodeBlock language="Endpoint">
                    {'GET /api/portfolios/{portfolioId}/accounts?page=1&limit=100'}
                </CodeBlock>
                <p><strong>Query Parameters:</strong></p>
                <ul>
                    <li><code>page</code> (optional, default: 1): The page number to retrieve.</li>
                    <li><code>limit</code> (optional, default: 100): The number of accounts per page.</li>
                    <li><code>sortField</code> (optional, default: collectibilityScore): The field to sort by.</li>
                    <li><code>sortDirection</code> (optional, default: desc): The sort direction (asc or desc).</li>
                </ul>
                <p><strong>Example Response:</strong></p>
                {/* FIX: The CodeBlock component requires content to be passed as children. */}
                <CodeBlock language="JSON">
{`{
  "accounts": [
    {
      "id": "60d...a1",
      "accountId": "ACC-12345",
      "balance": 7500.00,
      "collectibilityScore": 75.0,
      "aiRecoveryBlueprint": {
        "recoveryPriorityScore": 82.0,
        "...other blueprint details"
      },
      "...other account details"
    },
    {
      "id": "60d...a2",
      "accountId": "ACC-67890",
      "balance": 2500.00,
      "collectibilityScore": 42.0,
      "aiRecoveryBlueprint": {
        "recoveryPriorityScore": 55.0,
        "...other blueprint details"
      },
      "...other account details"
    }
  ],
  "totalPages": 10,
  "currentPage": 1,
  "totalCount": 1000
}`}
                </CodeBlock>
                <p>The <strong>DQI Score</strong> for each account is in the <code>collectibilityScore</code> field.</p>
                <p>The <strong>AI Priority Score</strong> for each account is in <code>aiRecoveryBlueprint.recoveryPriorityScore</code>.</p>
                
                <h4>Finding Your {'{portfolioId}'}</h4>
                <p>You can retrieve a list of all your portfolios and their corresponding IDs by making a request to the main portfolios endpoint:</p>
                {/* FIX: The CodeBlock component requires content to be passed as children. */}
                <CodeBlock language="Endpoint">
                    {'GET /api/portfolios'}
                </CodeBlock>
                <p>This will return an array of portfolio objects, each containing an <code>_id</code> field which you can use as the <code>{'{portfolioId}'}</code> in the requests above.</p>

                <p className="mt-6">This guide should provide everything your clients need to integrate their systems and programmatically pull this valuable data from Debt Catalyst. Let me know if you have any other questions!</p>
            </div>
        </div>
    );
};

export default ApiIntegrationGuide;