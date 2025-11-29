import React, { useState, useEffect } from 'react';
import { getBusinessData, updateBotConfiguration } from '../../services/businessService';

const BotConfig: React.FC = () => {
  const [config, setConfig] = useState({
    businessName: '',
    pricing: '',
    personaName: '',
    systemInstruction: '',
    welcomeMessage: '',
    geminiApiKey: '',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getBusinessData();
        if (response.success) {
          setConfig(response.data.botConfiguration);
        }
      } catch (error) {
        console.error('Failed to fetch bot configuration:', error);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({ ...prevConfig, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateBotConfiguration(config);
      if (response.success) {
        alert('Configuration saved!');
      }
    } catch (error) {
      console.error('Failed to save bot configuration:', error);
      alert('Failed to save configuration. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Configuration</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-slate-200">
          {/* Business Details Section */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-slate-900">Business Details</h3>
              <p className="mt-1 text-sm text-slate-500">Update your business name and pricing information.</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="businessName" className="block text-sm font-medium text-slate-700">Business Name</label>
                <input type="text" name="businessName" id="businessName" value={config.businessName} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-high-tech-blue focus:ring-high-tech-blue sm:text-sm" />
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="pricing" className="block text-sm font-medium text-slate-700">Pricing</label>
                <input type="text" name="pricing" id="pricing" value={config.pricing} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-high-tech-blue focus:ring-high-tech-blue sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Receptionist Personality Section */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-slate-900">Receptionist Personality</h3>
              <p className="mt-1 text-sm text-slate-500">Define the persona and instructions for your AI receptionist.</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="systemInstruction" className="block text-sm font-medium text-slate-700">System Instruction (Prompt)</label>
                <textarea id="systemInstruction" name="systemInstruction" rows={8} value={config.systemInstruction} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-high-tech-blue focus:ring-high-tech-blue sm:text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button type="submit" className="bg-high-tech-blue text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-all">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BotConfig;
