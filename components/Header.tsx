import React from 'react';
import { Activity, Menu, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAdminOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onAdminOpen }) => {
  const navItems = [
    { id: 'overview', label: 'Situation' },
    { id: 'donations', label: 'Assistance' },
    { id: 'breakdowns', label: 'Individual Breakdowns' },
    { id: 'distribution', label: 'Parish Needs' },
    { id: 'accountability', label: 'Recovery Commitments' },
    { id: 'reports', label: 'Evidence Records' },
    { id: 'verification', label: 'Evidence Gaps' },
    { id: 'methods', label: 'Methods' },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setActiveTab('overview')}>
            <Activity className="h-8 w-8 text-red-500 mr-2" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">MRI</h1>
              <p className="text-[10px] text-gray-400 -mt-1 uppercase tracking-wider">Melissa Relief Index</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-slate-800 text-white border-b-2 border-red-500'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAdminOpen}
              className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
              title="Admin"
            >
              <User className="h-6 w-6" />
            </button>
            <button className="md:hidden p-1 rounded-md text-gray-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav (Simple implementation for brevity) */}
      <div className="md:hidden border-t border-slate-800 flex overflow-x-auto">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium ${
                activeTab === item.id ? 'text-red-500 bg-slate-800' : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
      </div>
    </header>
  );
};

export default Header;
