import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Settings, BarChart, CreditCard, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';

const Sidebar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <div className={`bg-high-tech-blue text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
    <div className="flex items-center justify-center h-20 border-b border-slate-700">
      <h1 className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>Arc AI</h1>
    </div>
    <nav className="mt-4">
      <Link to="/dashboard/overview" className="flex items-center py-3 px-6 text-slate-300 hover:bg-slate-700 hover:text-white">
        <LayoutDashboard className="h-6 w-6" />
        <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>Overview</span>
      </Link>
      <Link to="/dashboard/config" className="flex items-center py-3 px-6 text-slate-300 hover:bg-slate-700 hover:text-white">
        <Settings className="h-6 w-6" />
        <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>Configuration</span>
      </Link>
      <Link to="/dashboard/billing" className="flex items-center py-3 px-6 text-slate-300 hover:bg-slate-700 hover:text-white">
        <CreditCard className="h-6 w-6" />
        <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>Billing</span>
      </Link>
      <Link to="/admin/dashboard" className="flex items-center py-3 px-6 text-slate-300 hover:bg-slate-700 hover:text-white mt-8 border-t border-slate-700 pt-4">
        <BarChart className="h-6 w-6" />
        <span className={`ml-4 ${isCollapsed ? 'hidden' : 'block'}`}>Admin</span>
      </Link>
    </nav>
  </div>
);

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b bg-white">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-slate-100">
            {isCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
          </button>
          <div className="flex items-center">
            <UserCircle className="h-8 w-8 text-slate-600" />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
