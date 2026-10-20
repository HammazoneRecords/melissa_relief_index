import React, { useMemo } from 'react';
import { ExternalLink, AlertTriangle, CheckCircle2, Inbox } from 'lucide-react';
import { getDonations, getSourceById } from '../data/store';
import { getAttribution, DistributionEvidence, RecipientKind } from '../data/recipientData';
import { DonationType } from '../types';

// ─── Individual Breakdowns ────────────────────────────────────────────────────
// One row per contribution: contributor, amount/quantity, stated recipient,
// disbursement status, and the source link. Only entries whose source EXPLICITLY
// documents distribution to communities may appear as having reached people.

const EVIDENCE_META: Record<DistributionEvidence, { label: string; cls: string; icon: React.FC<{ className?: string }> }> = {
  ['recipient-confirmed-distributed']:
    { label: 'Recipient-confirmed distributed', cls: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  ['received-by-recipient']:
    { label: 'Received by recipient — community delivery not documented', cls: 'bg-blue-100 text-blue-800', icon: Inbox },
  ['no-public-evidence']:
    { label: 'No public evidence of community-level distribution', cls: 'bg-amber-100 text-amber-800', icon: AlertTriangle },
};

const KIND_LABEL: Record<RecipientKind, string> = {
  ['government-agency']: 'Government agency',
  ['private-charity']: 'Private charity',
  ['multilateral-organisation']: 'Multilateral organisation',
  ['not-publicly-identified']: 'Recipient not publicly identified',
};

function describeAmount(d: ReturnType<typeof getDonations>[number]): string {
  if (d.type === DonationType.CASH) return `J$${d.amount.toLocaleString()}`;
  return d.notes?.match(/^\d[\d,.+]*\s*\+?\s*[\w\s-]*/)?.[0]?.trim()
    || d.notes?.split('. ')[0]
    || 'Quantities as stated in source';
}

const IndividualBreakdowns: React.FC = () => {
  const donations = useMemo(() => getDonations(), []);
  const rows = useMemo(
    () => donations.map(d => ({ donation: d, attribution: getAttribution(d) })),
    [donations]
  );
  const evidencedCount = rows.filter(r => r.attribution.distributionEvidence === 'recipient-confirmed-distributed').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Individual Breakdowns — contribution by contribution</h2>
        <p className="text-xs text-gray-500 mt-1">
          Each of the {rows.length} verified contributions with its stated recipient and disbursement status, exactly as documented in the linked source.
          Only {evidencedCount} entr{evidencedCount === 1 ? 'y' : 'ies'} have sources that explicitly document distribution to communities. All others are shown as
          received, in transit to an agency, or lacking public evidence — never as having reached people unless the source says so.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Read the status column carefully:</strong> “Received by recipient” means the source documents handover to a named agency — it does
        <em> not</em> mean the goods or funds reached affected households. “Recipient not publicly identified” means no verified source names who took custody.
      </div>

      <div className="grid gap-4">
        {rows.map(({ donation: d, attribution: a }) => {
          const meta = EVIDENCE_META[a.distributionEvidence];
          const Icon = meta.icon;
          const src = d.provenance?.sourceId ? getSourceById(d.provenance.sourceId) : undefined;
          return (
            <div key={d.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-gray-900">{d.donorName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{d.donorType}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {d.date} · {d.type} · {d.targetParish === 'All' ? 'Island-wide' : d.targetParish}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.cls}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {meta.label}
                </span>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Amount / Quantity</dt>
                  <dd className="text-gray-900 font-mono mt-0.5">{describeAmount(d)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Stated recipient</dt>
                  <dd className="text-gray-900 mt-0.5">
                    {a.recipientName}
                    <span className="ml-1 text-xs text-gray-400">({KIND_LABEL[a.recipientKind]})</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">Source</dt>
                  <dd className="mt-0.5">
                    <a
                      href={d.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      {src ? `${src.publisher} — ${src.title}` : 'View source document'}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    {src && <p className="text-[11px] text-gray-400 mt-0.5">{src.grade} · published {src.datePublished}</p>}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Evidence basis:</span> {a.evidenceBasis}
                </p>
                {d.notes && <p className="text-xs text-gray-500 mt-1">{d.notes}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndividualBreakdowns;
