import React, { useMemo } from 'react';
import { getParishSummaries } from '../data/store';
import type { ParishSummary } from '../data/store';

const SEVERITY_STYLE: Record<ParishSummary['topSeverity'], { bar: string; badge: string; label: string }> = {
  Critical: { bar: 'bg-red-500',    badge: 'bg-red-100 text-red-700',    label: 'Critical' },
  High:     { bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700', label: 'High Priority' },
  Medium:   { bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
  Low:      { bar: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700',   label: 'Low' },
  None:     { bar: 'bg-green-400',  badge: 'bg-green-100 text-green-700', label: 'No Reports' },
};

const formatCurrency = (val: number) => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return val > 0 ? `$${val.toLocaleString()}` : '—';
};

const CommunityMap: React.FC = () => {
  const summaries = useMemo(() => getParishSummaries(), []);
  const maxReceived = Math.max(...summaries.map(s => s.directCashReceived), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parish Needs</h2>
          <p className="text-sm text-gray-500">Directly targeted cash records and source-backed needs reports; national assistance is not assigned to every parish.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 text-xs">
          {(['Critical','High','Medium','None'] as const).map(s => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-sm ${SEVERITY_STYLE[s].bar}`} />
              <span className="text-gray-600">{SEVERITY_STYLE[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        National assistance records are retained in Funds &amp; Assistance but are not repeated here as parish allocations.
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {summaries.map(s => {
            const style = SEVERITY_STYLE[s.topSeverity];
            const pct = Math.round((s.directCashReceived / maxReceived) * 100);
            return (
              <div key={s.parish} className="relative p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className={`absolute top-0 left-0 w-full h-1 rounded-t-lg ${style.bar}`} />
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{s.parish}</h3>
                <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}>
                  {style.label}
                </span>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Direct cash</span>
                    <span className="font-medium text-gray-900">{formatCurrency(s.directCashReceived)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{s.directAssistanceRecordCount} direct record{s.directAssistanceRecordCount !== 1 ? 's' : ''}</span>
                    {s.hasReport && <span className="text-orange-500">has reports</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Parish evidence summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parish</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direct cash (JMD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direct records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evidence records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summaries.map(s => {
                const style = SEVERITY_STYLE[s.topSeverity];
                return (
                  <tr key={s.parish} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{s.parish}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-gray-900">{formatCurrency(s.directCashReceived)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{s.directAssistanceRecordCount}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{s.evidenceRecordCount}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${style.badge}`}>
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;
