import React, { useState } from 'react';
import { Icon } from '../Icon';
import { EmergingRiskTrend } from '../../types';

interface CreateEmergingRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRisk: Omit<EmergingRiskTrend, 'id' | 'detectedDate' | 'user'>) => void;
}

const CreateEmergingRiskModal: React.FC<CreateEmergingRiskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSave = () => {
    onSave({
      title,
      summary,
      keywords: keywords.split(',').map(kw => kw.trim()),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-brand-secondary rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Emerging Risk</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <Icon name="x" className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Summary</label>
            <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={4} className="mt-1 block w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Keywords (comma-separated)</label>
            <input type="text" id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} className="mt-1 block w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-md hover:bg-brand-accent-dark">Save Risk</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmergingRiskModal;
