import React, { useState, useMemo } from 'react';
import { getDonations, getSourceById } from '../data/store';
import { getAttribution } from '../data/recipientData';
import { Status, DonationType, SourceGrade } from '../types';
import { Filter, Download, ExternalLink, AlertTriangle } from 'lucide-react';

const STATUS_COLORS: Record<Status, string> = {
  [Status.RECEIVED]:    'bg-green-100 text-green-800',
  [Status.VERIFIED]:    'bg-blue-100 text-blue-800',
  [Status.PLEDGED]:     'bg-yellow-100 text-yellow-800',
  [Status.DELAYED]:     'bg-red-100 text-red-800',
  [Status.DISTRIBUTED]: 'bg-purple-100 text-purple-800',
  [Status.FAILED]:      'bg-gray-100 text-gray-800',
};

const Donations: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('All');
  const donations = useMemo(() => getDonations(), []);

  const filtered = filterType === 'All'
    ? donations
    : donations.filter(d => d.type === filterType);

  const exportCSV = () => {
    const headers = ['Date', 'Donor', 'Donor Type', 'Type', 'Amount (JMD)', 'Target Parish', 'Status', 'Source'];
    const rows = filtered.map(d => [
      d.date, d.donorName, d.donorType, d.type,
      d.amount, d.targetParish, d.status, d.sourceUrl,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mri-donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Assistance</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} source-linked records. Only cash records carry a JMD amount; in-kind support is not monetised. In-kind entries marked "Distributed" reflect only the specific quantities named in their source document — no consolidated island-wide distribution total has been published. "Distributed" here does not imply household-level delivery unless the source explicitly documents it.</p>
          <p className="text-xs mt-2">
            <a href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('mri-navigate', { detail: 'breakdowns' })); }} className="text-blue-600 hover:text-blue-900 font-medium underline">
              Per-contribution recipients &amp; disbursement status → Individual Breakdowns
            </a>
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <div className="relative">
            <select
              className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              {Object.values(DonationType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-gray-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documented value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parish</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stated recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{d.donorName}</div>
                    <div className="text-xs text-gray-400">{d.donorType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.donorType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {d.type === DonationType.CASH
                      ? `J$${d.amount.toLocaleString()}`
                      : d.amount > 0 ? `Reported value: J$${d.amount.toLocaleString()}` : 'Not monetised'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.targetParish}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[16rem]">
                    {getAttribution(d).recipientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {d.provenance?.flags && d.provenance.flags.length > 0 && (
                        <span title={d.provenance.flags.join('; ')} className="text-amber-500">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {d.provenance?.sourceId && d.provenance.sourceId.startsWith('src-') && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          getSourceById(d.provenance.sourceId)?.grade === SourceGrade.OFFICIAL ? 'bg-green-100 text-green-700' :
                          getSourceById(d.provenance.sourceId)?.grade === SourceGrade.PRIMARY ? 'bg-blue-100 text-blue-700' :
                          getSourceById(d.provenance.sourceId)?.grade === SourceGrade.SECONDARY ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getSourceById(d.provenance.sourceId)?.grade ?? '—'}
                        </span>
                      )}
                      <a
                        href={d.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title={d.sourceUrl}
                      >
                        Proof <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-500">No donations found for this filter.</div>
        )}
      </div>
    </div>
  );
};

export default Donations;
