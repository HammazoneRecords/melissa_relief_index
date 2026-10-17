import React, { useState } from 'react';
import Header from './components/Header';
import Overview from './views/Overview';
import Donations from './views/Donations';
import Accountability from './views/Accountability';
import CommunityMap from './views/CommunityMap';
import Reports from './views/Reports';
import Verification from './views/Verification';
import Methods from './views/Methods';
import AdminPanel from './components/AdminPanel';

// ─── Public Information Architecture (Task 003) ────────────────────────────
// Situation → Assistance → Parish Needs → Recovery Commitments → Evidence Records → Evidence Gaps
// Each view declares its scope and limitations.

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminOpen, setAdminOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'donations': return <Donations />;
      case 'distribution': return <CommunityMap />;
      case 'accountability': return <Accountability />;
      case 'reports': return <Reports />;
      case 'verification': return <Verification />;
      case 'methods': return <Methods />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onAdminOpen={() => setAdminOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Melissa Relief Index. Source-linked civic evidence ledger.</p>
            <p className="mt-2">Record dates and source links are shown so claims can be checked in context.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
