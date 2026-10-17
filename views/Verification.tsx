import React, { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Clock, XCircle, HelpCircle, TrendingDown, Flag } from 'lucide-react';
import { FulfillmentGrade } from '../types';
import {
  getDonations, getReports, getPromises,
  getFulfillmentGrade, getUnverifiedPromises, getOverduePromises,
  getUnreportedParishes, getUntrackedDonations, getBudgetOverruns,
  getOverlapGroups, getCategoryTotals, getFlaggedRecords,
  PARISHES,
} from '../data/store';

const GRADE_CONFIG: Record<FulfillmentGrade, { label: string; color: string; icon: React.ReactNode }> = {
  [FulfillmentGrade.FULFILLED]:   { label: 'Fulfilled',   color: 'bg-green-100 text-green-800',  icon: <CheckCircle className="w-3.5 h-3.5" /> },
  [FulfillmentGrade.PARTIAL]:     { label: 'Partial',     color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3.5 h-3.5" /> },
  [FulfillmentGrade.OVERDUE]:     { label: 'Overdue',     color: 'bg-red-100 text-red-800',      icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  [FulfillmentGrade.UNFULFILLED]: { label: 'Unfulfilled', color: 'bg-red-200 text-red-900',      icon: <XCircle className="w-3.5 h-3.5" /> },
  [FulfillmentGrade.UNVERIFIED]:  { label: 'Unverified',  color: 'bg-gray-100 text-gray-600',    icon: <HelpCircle className="w-3.5 h-3.5" /> },
};

const GradeBadge: React.FC<{ grade: FulfillmentGrade }> = ({ grade }) => {
  const cfg = GRADE_CONFIG[grade];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Verification: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const promises = useMemo(() => getPromises(), []);
  const reports  = useMemo(() => getReports(), []);
  const donations = useMemo(() => getDonations(), []);

  const gradedPromises = useMemo(() =>
    promises.map(p => ({ promise: p, grade: getFulfillmentGrade(p, today) })),
    [promises, today]
  );

  const unverified     = useMemo(() => getUnverifiedPromises(promises), [promises]);
  const overdue        = useMemo(() => getOverduePromises(promises, today), [promises, today]);
  const unreportedP    = useMemo(() => getUnreportedParishes(donations, reports), [donations, reports]);
  const untrackedDons  = useMemo(() => getUntrackedDonations(donations, reports), [donations, reports]);
  const overruns       = useMemo(() => getBudgetOverruns(promises), [promises]);
  const overlapGroups   = useMemo(() => getOverlapGroups(), []);
  const categoryTotals  = useMemo(() => getCategoryTotals(), []);
  const flaggedRecords  = useMemo(() => getFlaggedRecords(), []);

  const totalAllocated = promises.reduce((s, p) => s + p.budgetAllocated, 0);
  const totalSpent     = promises.reduce((s, p) => s + p.budgetSpent, 0);
  const withEvidence   = promises.filter(p => (p.reportIds?.length ?? 0) > 0).length;

  const DAMAGE_TOTAL = 12_200_000_000;
  const FINANCING_SECURED = 6_700_000_000;
  const FINANCING_GAP = DAMAGE_TOTAL - FINANCING_SECURED;

  const fmt = (n: number) =>
    n >= 1_000_000_000 ? `US$${(n / 1_000_000_000).toFixed(1)}B`
    : n >= 1_000_000   ? `US$${(n / 1_000_000).toFixed(1)}M`
    : `US$${n.toLocaleString()}`;

  // Parish coverage matrix
  const parishCoverage = PARISHES.map(parish => {
    const hasDonation = donations.some(d => d.targetParish === parish || d.targetParish === 'All');
    const hasReport   = reports.some(r => r.parish === parish);
    const hasPromise  = promises.some(p =>
      p.reportIds?.some(rid => reports.find(r => r.id === rid && r.parish === parish))
    );
    const drops = reports
      .filter(r => r.parish === parish)
      .reduce((s, r) => s + (r.verifiedCount ?? 0), 0);
    return { parish, hasDonation, hasReport, hasPromise, drops };
  });

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-slate-700" />
        <div>
          <h1 className="text-xl font-bold text-slate-900">Evidence Gaps & Coverage</h1>
          <p className="text-sm text-gray-500">What is linked, what is missing, and what the current evidence cannot yet establish.</p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Commitment record dates are not yet modelled as confirmed delivery deadlines. Any time-based grade below is provisional and must not be treated as a public conclusion without a source-backed target date.
      </div>

      {/* Section A — Fulfillment Scorecard */}
      <Section
        title="A — Recovery commitment evidence ledger"
        subtitle={`${withEvidence} of ${promises.length} commitments have linked evidence records`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="pb-2 pr-4 font-medium">Promise</th>
                <th className="pb-2 pr-4 font-medium">Ministry</th>
                <th className="pb-2 pr-4 font-medium">Record date</th>
                <th className="pb-2 pr-4 font-medium">Progress</th>
                <th className="pb-2 pr-4 font-medium">Grade</th>
                <th className="pb-2 font-medium">Linked evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gradedPromises.map(({ promise: p, grade }) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-slate-800 max-w-xs">
                    <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-red-600 hover:underline">
                      {p.title}
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs">{p.ministry ?? '—'}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{p.promisedDate}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-slate-700 h-1.5 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <GradeBadge grade={grade} />
                  </td>
                  <td className="py-3 text-xs text-gray-500">
                    {(p.reportIds?.length ?? 0) > 0
                      ? <span className="text-green-700">{p.reportIds!.length} report{p.reportIds!.length > 1 ? 's' : ''}</span>
                      : <span className="text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No evidence</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section B — Methodology Gaps */}
      <Section
        title="B — Methodology Gaps"
        subtitle="Computed checks against the dataset — items flagged here require attention"
      >
        <div className="space-y-3">
          {[
            {
              label: 'Promises with no field evidence',
              value: unverified.length,
              detail: unverified.length > 0 ? unverified.map(p => p.id).join(', ') : 'None',
              pass: unverified.length === 0,
            },
            {
              label: 'Time-based grade requires confirmed target dates',
              value: overdue.length,
              detail: 'Current record dates may be announcement or observation dates; time-based classifications remain provisional.',
              pass: false,
              future: true,
            },
            {
              label: 'Parishes with specific donations but no field reports',
              value: unreportedP.length,
              detail: unreportedP.length > 0 ? unreportedP.join(', ') : 'None',
              pass: unreportedP.length === 0,
            },
            {
              label: 'Donations with zero beneficiary reach in target parish',
              value: untrackedDons.length,
              detail: untrackedDons.length > 0 ? untrackedDons.map(d => d.id).join(', ') : 'None',
              pass: untrackedDons.length === 0,
            },
            {
              label: 'Budget overruns (budgetSpent > budgetAllocated)',
              value: overruns.length,
              detail: overruns.length > 0 ? overruns.map(p => p.id).join(', ') : 'None',
              pass: overruns.length === 0,
            },
            {
              label: 'Mixed-unit beneficiary total',
              value: '✅ Removed',
              detail: 'Reported people, packages, schools, and other units are no longer summed as a single family count.',
              pass: true,
            },
            {
              label: '`disputedCount` resolution workflow',
              value: '⚠ Not built',
              detail: 'Future work — voting/resolution reason field needed',
              pass: false,
              future: true,
            },
            {
              label: 'Source URL live validation',
              value: '⚠ Not built',
              detail: 'Future work — requires backend proxy (CORS limitation)',
              pass: false,
              future: true,
            },
          ].map((row, i) => (
            <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
              <span className={`mt-0.5 flex-shrink-0 ${row.pass ? 'text-green-500' : row.future ? 'text-amber-400' : 'text-red-500'}`}>
                {row.pass ? <CheckCircle className="w-4 h-4" /> : row.future ? <Clock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </span>
              <div className="flex-1">
                <span className="font-medium text-slate-800">{row.label}</span>
                {' — '}
                <span className="text-gray-500">{row.detail}</span>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                row.pass ? 'bg-green-50 text-green-700' : row.future ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              }`}>{String(row.value)}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section C — Parish Coverage Heatmap */}
      <Section
        title="C — Parish Coverage Matrix"
        subtitle="Which parishes have donations, field reports, and linked gov promises"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="pb-2 pr-4 font-medium">Parish</th>
                <th className="pb-2 pr-4 font-medium text-center">Donations</th>
                <th className="pb-2 pr-4 font-medium text-center">Field Report</th>
                <th className="pb-2 pr-4 font-medium text-center">Gov Promise</th>
                <th className="pb-2 font-medium text-right">Beneficiaries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parishCoverage.map(row => (
                <tr key={row.parish} className="hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium text-slate-800">{row.parish}</td>
                  <td className="py-2 pr-4 text-center">{row.hasDonation ? '✅' : '—'}</td>
                  <td className="py-2 pr-4 text-center">{row.hasReport  ? '✅' : <span className="text-red-500">⚠</span>}</td>
                  <td className="py-2 pr-4 text-center">{row.hasPromise ? '✅' : '—'}</td>
                  <td className="py-2 text-right text-gray-600">{row.drops > 0 ? row.drops.toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section D — Government Fulfillment Summary */}
      <Section title="D — Government Fulfillment Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Promises with field evidence', value: `${withEvidence} / ${promises.length}` },
            { label: 'Overdue promises', value: overdue.length, warn: overdue.length > 0 },
            { label: 'Total budget allocated', value: fmt(totalAllocated) },
            { label: 'Total budget spent', value: fmt(totalSpent) },
          ].map((stat, i) => (
            <div key={i} className={`rounded-lg p-4 border ${stat.warn ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.warn ? 'text-red-700' : 'text-slate-800'}`}>{String(stat.value)}</p>
            </div>
          ))}
        </div>

        {/* NaRRA Financing Gap */}
        <div className="bg-slate-900 text-white rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold">NaRRA Financing Gap — Critical Shortfall</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Total Damage Estimate</p>
              <p className="text-2xl font-bold text-white">{fmt(DAMAGE_TOTAL)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Multilateral Financing Secured</p>
              <p className="text-2xl font-bold text-green-400">{fmt(FINANCING_SECURED)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Financing Gap</p>
              <p className="text-2xl font-bold text-red-400">{fmt(FINANCING_GAP)}</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full"
              style={{ width: `${(FINANCING_SECURED / DAMAGE_TOTAL) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {((FINANCING_SECURED / DAMAGE_TOTAL) * 100).toFixed(0)}% of reconstruction costs covered — {fmt(FINANCING_GAP)} shortfall remains unfunded
          </p>
        </div>
      </Section>

      {/* Section E — Overlap Registry (Task 002) */}
      <Section
        title="E — Known Overlap Registry"
        subtitle="Parent-child claim relationships. Sub-claims are excluded from incompatible totals."
      >
        {overlapGroups.length === 0 ? (
          <p className="text-sm text-gray-500">No overlap relationships registered.</p>
        ) : (
          <div className="space-y-2">
            {overlapGroups.map(g => (
              <div key={g.parentId} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                <Flag className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-slate-800">{g.parentLabel}</span>
                  <span className="text-gray-400"> ({g.parentId})</span>
                  <span className="text-gray-500"> → contains: </span>
                  {g.childIds.map((cid, i) => (
                    <span key={cid}>
                      <code className="text-xs bg-gray-100 px-1 rounded">{cid}</code>
                      {i < g.childIds.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Section F — Category Totals (Task 002) */}
      <Section
        title="F — Totals by Claim Category"
        subtitle="Separated by unit type. Categories with different units are not summed together."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="pb-2 pr-4 font-medium">Category</th>
                <th className="pb-2 pr-4 font-medium">Unit</th>
                <th className="pb-2 pr-4 font-medium text-right">Total</th>
                <th className="pb-2 pr-4 font-medium text-center">Records</th>
                <th className="pb-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categoryTotals.map(ct => (
                <tr key={ct.category} className="hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium text-slate-800">{ct.category}</td>
                  <td className="py-2 pr-4 text-gray-500">{ct.unit}</td>
                  <td className="py-2 pr-4 text-right font-mono text-slate-800">
                    {ct.totalAmount > 0 ? ct.totalAmount.toLocaleString() : '—'}
                  </td>
                  <td className="py-2 pr-4 text-center text-gray-500">{ct.recordCount}</td>
                  <td className="py-2 text-xs text-gray-500">{ct.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section G — Flagged Claims (Task 002) */}
      <Section
        title="G — Flagged Claims for Review"
        subtitle="Records with data-quality flags, overlap annotations, or provenance concerns"
      >
        {flaggedRecords.length === 0 ? (
          <p className="text-sm text-gray-500">No flagged claims.</p>
        ) : (
          <div className="space-y-2">
            {flaggedRecords.map(fr => (
              <div key={fr.id} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                <span className={`mt-0.5 flex-shrink-0 ${fr.flags.some(f => f.includes('parent-claim') || f.includes('corroborated')) ? 'text-green-500' : 'text-amber-500'}`}>
                  {fr.flags.some(f => f.includes('parent-claim') || f.includes('corroborated')) ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-slate-800">{fr.label}</span>
                  <span className="text-gray-400 text-xs ml-2">({fr.type} · {fr.id})</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fr.flags.map((f, i) => (
                      <span key={i} className="inline-block text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default Verification;
