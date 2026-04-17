import React, { useMemo } from 'react';
import { DollarSign, Package, Truck, Home, Activity, Users } from 'lucide-react';
import KPICard from '../components/KPICard';
import { getKPIs, getDonations, getLastUpdated } from '../data/store';
import { DonationType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Overview: React.FC = () => {
  const kpis = useMemo(() => getKPIs(), []);
  const donations = useMemo(() => getDonations(), []);
  const lastUpdated = getLastUpdated();

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };
  const formatCompact = (val: number) =>
    new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(val);

  const distributionRate = kpis.totalCashReceived > 0
    ? Math.round((kpis.totalDisbursed / kpis.totalCashReceived) * 100)
    : 0;

  const chartData = [
    { name: 'Pledged', value: donations.filter(d => d.status === 'Pledged').reduce((s, d) => s + d.amount, 0) },
    { name: 'Received', value: kpis.totalCashReceived },
    { name: 'Disbursed', value: kpis.totalDisbursed },
  ];

  // Pie derived from real donation types
  const typeTotals = Object.values(DonationType).map(type => ({
    name: type,
    value: donations.filter(d => d.type === type).reduce((s, d) => s + d.amount, 0),
  })).filter(t => t.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-JM', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Not yet updated';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Jamaica Relief Tracker</h2>
          <p className="text-sm text-gray-500">Independent civic ledger — all data sourced and verified</p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Last updated: {lastUpdatedLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Cash Received"
          value={formatCurrency(kpis.totalCashReceived)}
          subValue={`${donations.filter(d => d.type === DonationType.CASH).length} cash donations`}
          icon={DollarSign}
          color="green"
          trend="up"
        />
        <KPICard
          title="Est. Value (In-Kind)"
          value={formatCurrency(kpis.totalValueKind)}
          subValue="Food, supplies, equipment"
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Relief Distributed"
          value={formatCurrency(kpis.totalDisbursed)}
          subValue={`${distributionRate}% distribution rate`}
          icon={Truck}
          color="purple"
        />
        <KPICard
          title="Families Assisted"
          value={kpis.familiesHelped > 0 ? formatCompact(kpis.familiesHelped) : '—'}
          subValue="Updated manually"
          icon={Home}
          color="yellow"
        />
        <KPICard
          title="Known Donors"
          value={kpis.activeAgencies}
          subValue="Individuals, NGOs, Govt"
          icon={Users}
          color="blue"
        />
        <KPICard
          title="High-Priority Parishes"
          value={kpis.criticalZones}
          subValue="From field reports"
          icon={Activity}
          color="red"
          trend={kpis.criticalZones > 0 ? 'down' : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Funds Flow</h3>
          {chartData.every(d => d.value === 0) ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No financial data yet — add donations to see flow
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={formatCompact} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Breakdown</h3>
          {typeTotals.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm text-center">
              No donations yet
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {typeTotals.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
