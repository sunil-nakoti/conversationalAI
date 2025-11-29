import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, AlertCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';

const chartData = [
  { name: 'Jan', clients: 400, revenue: 2400 },
  { name: 'Feb', clients: 300, revenue: 2210 },
  { name: 'Mar', clients: 200, revenue: 2290 },
  { name: 'Apr', clients: 278, revenue: 2000 },
  { name: 'May', clients: 189, revenue: 2181 },
  { name: 'Jun', clients: 239, revenue: 2500 },
  { name: 'Jul', clients: 349, revenue: 2100 },
];

const users = [
  { id: 1, name: 'Innovate Inc.', status: 'Active', revenue: 500 },
  { id: 2, name: 'Solutions Corp.', status: 'Active', revenue: 750 },
  { id: 3, name: 'Future Systems', status: 'Churned', revenue: 0 },
  { id: 4, name: 'Quantum Leap', status: 'Active', revenue: 1200 },
];

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; trend: string }> = ({ icon, title, value, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center">
      <div className="bg-slate-100 p-3 rounded-full">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
    <p className="text-sm text-green-500 mt-2">{trend}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="h-6 w-6 text-high-tech-blue" />} title="Total Active Clients" value="1,257" trend="⬆ 12% from last month" />
        <StatCard icon={<DollarSign className="h-6 w-6 text-high-tech-blue" />} title="Monthly Revenue" value="$45,890" trend="⬆ 8% from last month" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Platform Growth</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="clients" stackId="1" stroke="#0f172a" fill="#0f172a" />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#38BDF8" fill="#38BDF8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">User Management</h2>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">MRR</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${user.revenue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-high-tech-blue hover:text-opacity-80"><Edit className="h-5 w-5" /></button>
                  <button className="text-red-600 hover:text-red-800 ml-4"><Trash2 className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Live System Feed</h2>
        <div className="h-48 overflow-y-auto border rounded-md p-4 space-y-3">
          <div className="flex items-start text-sm">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
            <p><span className="font-semibold">[ERROR]</span> Payment gateway API timeout for user_id: 1234</p>
          </div>
          <div className="flex items-start text-sm">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <p><span className="font-semibold">[SUCCESS]</span> New client registered: Quantum Leap</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
