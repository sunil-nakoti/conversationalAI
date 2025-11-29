import React, { useState, useEffect } from 'react';
import { getBusinessData, updateBotConfiguration } from '../../services/businessService';

const BotConfigForm: React.FC = () => {
  const [config, setConfig] = useState({
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="personaName" className="block text-sm font-medium text-gray-700">
            Persona Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="personaName"
              id="personaName"
              value={config.personaName}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-700">
            System Instruction
          </label>
          <div className="mt-1">
            <textarea
              id="systemInstruction"
              name="systemInstruction"
              rows={8}
              value={config.systemInstruction}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">Define the persona and instructions for your AI receptionist.</p>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">
            Welcome Message
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="welcomeMessage"
              id="welcomeMessage"
              value={config.welcomeMessage}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700">
            Gemini API Key
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="geminiApiKey"
              id="geminiApiKey"
              value={config.geminiApiKey}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </form>
  );
};

export default BotConfigForm;
