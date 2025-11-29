import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, MessageSquare, Clock } from 'lucide-react';

const chartData = [
  { name: 'Jan', visits: 400 },
  { name: 'Feb', visits: 300 },
  { name: 'Mar', visits: 200 },
  { name: 'Apr', visits: 278 },
  { name: 'May', visits: 189 },
  { name: 'Jun', visits: 239 },
  { name: 'Jul', visits: 349 },
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

const Overview: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<Calendar className="h-6 w-6 text-high-tech-blue" />} title="Appointments Booked" value="152" trend="⬆ 20% from last week" />
        <StatCard icon={<MessageSquare className="h-6 w-6 text-high-tech-blue" />} title="Messages Handled" value="1,289" trend="⬆ 15% from last week" />
        <StatCard icon={<Clock className="h-6 w-6 text-high-tech-blue" />} title="Time Saved" value="48 hours" trend="approx. this month" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Customer Visits</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="visits" stroke="#0f172a" fill="#0f172a" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
