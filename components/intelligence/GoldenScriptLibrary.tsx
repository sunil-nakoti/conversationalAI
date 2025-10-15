import React from 'react';
import { GoldenScript } from '../../types';
import { Icon } from '../Icon';

interface GoldenScriptLibraryProps {
    scripts: GoldenScript[];
}

const GoldenScriptLibrary: React.FC<GoldenScriptLibraryProps> = ({ scripts }) => {
    return (
        <div className="bg-white dark:bg-brand-secondary p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-sky-100 dark:bg-brand-accent/20 text-sky-600 dark:text-brand-accent p-3 rounded-lg">
                    <Icon name="award" className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Golden Script Library</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">A repository of your highest-performing "champion" playbooks, automatically archived based on performance.</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-brand-text">
                    <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Playbook / Persona</th>
                            <th scope="col" className="px-6 py-3 text-center">PTP Rate</th>
                            <th scope="col" className="px-6 py-3 text-center">Avg. Sentiment</th>
                            <th scope="col" className="px-6 py-3 text-center">Compliance Score</th>
                            <th scope="col" className="px-6 py-3">Archived</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scripts.map(script => (
                            <tr key={script.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-900 dark:text-white">{script.playbookName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Persona: {script.persona}</p>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-green-600 dark:text-green-400">{script.ptpRate.toFixed(1)}%</td>
                                <td className="px-6 py-4 text-center font-bold text-sky-600 dark:text-sky-400">{script.avgSentiment.toFixed(1)}</td>
                                <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-white">{script.complianceScore.toFixed(1)}%</td>
                                <td className="px-6 py-4">{new Date(script.dateArchived).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="flex items-center gap-2 mx-auto bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-1.5 px-3 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
                                        <Icon name="copy" className="h-4 w-4" />
                                        Clone
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GoldenScriptLibrary;
