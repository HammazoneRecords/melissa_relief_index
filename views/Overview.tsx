import React, { useMemo } from 'react';
import { DollarSign, Package, Truck, FileText, Activity, Users } from 'lucide-react';
import KPICard from '../components/KPICard';
import { getKPIs, getDonations, getLastUpdated } from '../data/store';
import { VERIFIED_METRICS } from '../data/verifiedData';
import { DonationType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Overview: React.FC = () => {
  const kpis = useMemo(() => getKPIs(), []);
  const donations = useMemo(() => getDonations(), []);
  const lastUpdated = getLastUpdated();

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `J$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `J$${(val / 1_000).toFixed(0)}K`;
    return `J$${val.toLocaleString()}`;
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

  // Assistance is counted by record type. In-kind support is deliberately not given a cash value.
  const typeTotals = Object.values(DonationType).map(type => ({
    name: type,
    value: donations.filter(d => d.type === type).length,
  })).filter(t => t.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-JM', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Source data as of 2026-04-16 (latest source retrieval)';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Situation: source-backed recovery snapshot</h2>
          <p className="text-sm text-gray-500">A dated civic evidence ledger, not a live operational feed.</p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Last updated: {lastUpdatedLabel}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Amounts are only combined where they are documented as JMD cash. Assistance, reports, and reported people or units are kept separate because they measure different things.
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <strong>Scope:</strong> This ledger records claims as they appeared in source documents published between October 2025 and April 2026. It does not track real-time disbursements, verify delivery on the ground, or confirm that pledged funds reached recipients. Dates shown are publication or announcement dates — not delivery dates.
      </div>

      <div className="rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-800">
        <strong className="block text-base mb-1">One year after landfall — the verified picture</strong>
        Hurricane Melissa made landfall near New Hope, Westmoreland on 28 October 2025. Electricity is largely back: {VERIFIED_METRICS.jpsRestorationPercent}% of JPS customers, {VERIFIED_METRICS.nwcRestorationPercent}% of water services. But the relief money tells a different story: against {`US$${(VERIFIED_METRICS.damageEstimateFinalUSD / 1e9).toFixed(1)}B`} in total damage, roughly {`J$${(VERIFIED_METRICS.totalDonationsJMD / 1e9).toFixed(1)}B`} (≈US${(VERIFIED_METRICS.totalDonationsUSD / 1e6).toFixed(0)}M) has been raised through the official relief fund — and no public breakdown shows how much of that cash has actually reached affected households. {`US$${(VERIFIED_METRICS.multilateralFinancingUSD / 1e9).toFixed(1)}B`} in multilateral reconstruction financing is pledged, not disbursed, leaving a {`US$${(VERIFIED_METRICS.financingGapUSD / 1e9).toFixed(1)}B`} gap. Confirmed human cost: {VERIFIED_METRICS.deaths} deaths, {VERIFIED_METRICS.displacedPersons.toLocaleString()} displaced at peak, {VERIFIED_METRICS.schoolsAffected}+ schools damaged with only {VERIFIED_METRICS.schoolGeneratorsNET} generators provided as of April 2026. <em>Every figure links to its source in this ledger.</em>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Documented Cash Records"
          value={formatCurrency(kpis.totalCashReceived)}
          subValue={`${donations.filter(d => d.type === DonationType.CASH).length} cash records, JMD`}
          icon={DollarSign}
          color="green"
          trend="up"
        />
        <KPICard
          title="In-Kind Assistance Records"
          value={kpis.inKindRecordCount}
          subValue="Not converted to a cash value"
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Cash Tracked as Disbursed"
          value={formatCurrency(kpis.totalDisbursed)}
          subValue={kpis.totalDisbursed === 0
            ? 'No public per-household cash disbursement breakdown exists'
            : `${distributionRate}% of documented cash records`}
          icon={Truck}
          color="purple"
        />
        <KPICard
          title="Source-Backed Records"
          value={formatCompact(kpis.sourceBackedRecordCount)}
          subValue="Donations, reports, commitments"
          icon={FileText}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Cash record status (JMD)</h3>
          <p className="text-xs text-gray-500 mb-4">In-kind assistance is excluded because it has not been monetised.</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Assistance record types</h3>
          <p className="text-xs text-gray-500 mb-4">Number of records, not a value comparison.</p>
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
                  <Tooltip formatter={(value: number) => `${value} record${value === 1 ? '' : 's'}`} />
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
