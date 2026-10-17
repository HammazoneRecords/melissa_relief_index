import React from 'react';
import { BookOpen, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getSourceDocuments, getFlaggedRecords } from '../data/store';
import { SourceGrade } from '../types';

const Methods: React.FC = () => {
  const sources = getSourceDocuments();
  const flagged = getFlaggedRecords();

  const gradeCounts = {
    [SourceGrade.OFFICIAL]: sources.filter(s => s.grade === SourceGrade.OFFICIAL).length,
    [SourceGrade.PRIMARY]: sources.filter(s => s.grade === SourceGrade.PRIMARY).length,
    [SourceGrade.SECONDARY]: sources.filter(s => s.grade === SourceGrade.SECONDARY).length,
    [SourceGrade.UNVERIFIED]: sources.filter(s => s.grade === SourceGrade.UNVERIFIED).length,
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Methods &amp; Limitations</h2>
        <p className="text-slate-300">How this ledger is built, what it can and cannot tell you, and where the evidence is thin.</p>
      </div>

      {/* Scope */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-gray-900">What This Ledger Covers</h3>
        </div>
        <div className="prose prose-sm text-gray-600 space-y-3">
          <p>
            The Melissa Relief Index is a <strong>source-linked civic evidence ledger</strong>, not a live operational dashboard.
            Every claim in this ledger traces to a specific source document — a government press release,
            an NGO operational report, an official dashboard, or a news article.
          </p>
          <p>
            <strong>This ledger records claims as they appeared in sources published between October 2025 and April 2026.</strong> It does not:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Track real-time disbursements or delivery on the ground</li>
            <li>Verify that pledged funds reached recipients</li>
            <li>Confirm that infrastructure restoration claims match lived conditions</li>
            <li>Replace ODPEM operational data or government accounting</li>
          </ul>
        </div>
      </div>

      {/* Source Grades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-gray-900">Source Quality Tiers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            { grade: SourceGrade.OFFICIAL, desc: 'Government press release, JIS article, OPM statement, or parliament record. Highest reliability tier.', count: gradeCounts[SourceGrade.OFFICIAL], color: 'bg-green-100 text-green-800' },
            { grade: SourceGrade.PRIMARY, desc: 'NGO operational report, official dashboard with named data points, or organisation\'s own published figures.', count: gradeCounts[SourceGrade.PRIMARY], color: 'bg-blue-100 text-blue-800' },
            { grade: SourceGrade.SECONDARY, desc: 'News article citing an official, aggregated dashboard without per-record source data, or third-party summary.', count: gradeCounts[SourceGrade.SECONDARY], color: 'bg-yellow-100 text-yellow-800' },
            { grade: SourceGrade.UNVERIFIED, desc: 'Social media post, unattributed claim, or source of unknown origin. Held for review, not presented as evidence.', count: gradeCounts[SourceGrade.UNVERIFIED], color: 'bg-red-100 text-red-800' },
          ].map(tier => (
            <div key={tier.grade} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.color}`}>{tier.grade}</span>
                <span className="text-sm text-gray-500">{tier.count} source{tier.count !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-sm text-gray-600">{tier.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Total source documents in registry: <strong>{sources.length}</strong>. Each claim links to one source.
          A single source may anchor multiple claims — the source count is not the claim count.
        </p>
      </div>

      {/* Known Limitations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-900">Known Limitations</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          {[
            { title: 'Publication dates are not delivery dates', detail: 'A government announcement dated November 10 does not mean the action was completed on November 10. Record dates may be announcement, observation, or publication dates.' },
            { title: 'Per-parish drop counts are estimates', detail: 'ODPEM dashboard provides drop-type counts per parish. Beneficiary counts are estimated using ODPEM per-drop averages (police drop ≈200, medical ≈100, fire ≈50, water ≈300). Individual drop data is not publicly available.' },
            { title: 'Cash totals are JMD only where documented as JMD', detail: 'In-kind assistance (food, supplies, equipment, services) is not assigned a cash value. Only donations explicitly recorded as JMD cash are summed. This understates total economic value but avoids fabricated conversions.' },
            { title: 'Overlap relationships are manually annotated', detail: 'Known parent-child relationships (e.g., JPS loan funding restoration) are flagged in the overlap registry. Undiscovered overlaps may exist. Sub-claims are excluded from parent-category totals.' },
            { title: 'Unverified aggregates are held for review', detail: 'Claims sourced from aggregate dashboards without per-record breakdowns are graded as Reported (not Confirmed). Generic homepage links without specific excerpts are marked for review.' },
            { title: 'No real-time or live data feed', detail: 'This is a static evidence snapshot. It does not poll government APIs, scrape live dashboards, or update automatically. It records what was known at the time of collection.' },
          ].map((lim, i) => (
            <div key={i} className="border-l-2 border-amber-200 pl-4 py-1">
              <p className="font-medium text-slate-800">{lim.title}</p>
              <p className="text-gray-500">{lim.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unresolved Evidence Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-gray-900">Unresolved Evidence Queue</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Records with data-quality flags, unmapped sources, or provenance concerns. These claims are held for review and should not be cited as confirmed evidence.
        </p>
        {flagged.length === 0 ? (
          <p className="text-sm text-green-700">No flagged claims — all records pass basic provenance checks.</p>
        ) : (
          <div className="space-y-2">
            {flagged.map(fr => (
              <div key={fr.id} className="flex items-start gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-slate-800">{fr.label}</span>
                  <span className="text-gray-400 text-xs ml-2">({fr.type} · {fr.id})</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fr.flags.map((f, i) => (
                      <span key={i} className="inline-block text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Methods;
