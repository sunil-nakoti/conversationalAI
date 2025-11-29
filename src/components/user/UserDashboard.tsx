import React from 'react';
import BotConfigForm from './BotConfigForm';
import Layout from '../layout/Layout';

const UserDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Bot Configuration</h2>
        <p className="text-gray-600 mb-6">This is where you can customize your AI receptionist's persona and behavior.</p>
        <BotConfigForm />
      </div>
    </Layout>
  );
};

export default UserDashboard;
