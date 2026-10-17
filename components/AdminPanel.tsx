import React, { useState, useCallback } from 'react';
import { X, Lock, Plus, Search, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { saveDonation, saveReport, savePromise, getDonations, getReports, getPromises, resetToVerifiedData } from '../data/store';
import { DonorType, DonationType, Status } from '../types';
import { PARISHES } from '../data/store';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'mri2026';

interface Props {
  onClose: () => void;
}

type Panel = 'inbox' | 'donation' | 'report' | 'promise';

// ─── Source Inbox ─────────────────────────────────────────────────────────────
interface SourceMatch {
  type: 'donation' | 'report' | 'promise';
  label: string;
  date: string;
  url: string;
}

const SourceInbox: React.FC<{ onJumpTo: (panel: Panel, url: string) => void }> = ({ onJumpTo }) => {
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState<SourceMatch[] | null>(null);

  const normalise = (url: string) => url.trim().replace(/\/$/, '').toLowerCase();

  const check = useCallback(() => {
    const needle = normalise(input);
    if (!needle) return;

    const found: SourceMatch[] = [];

    getDonations().forEach(d => {
      if (normalise(d.sourceUrl) === needle)
        found.push({ type: 'donation', label: `${d.donorName} — ${d.type}`, date: d.date, url: d.sourceUrl });
    });
    getReports().forEach(r => {
      if (normalise(r.sourceUrl) === needle)
        found.push({ type: 'report', label: `${r.parish} / ${r.communityName}`, date: r.timestamp.split('T')[0], url: r.sourceUrl });
    });
    getPromises().forEach(p => {
      if (normalise(p.sourceUrl) === needle)
        found.push({ type: 'promise', label: p.title, date: p.promisedDate, url: p.sourceUrl });
    });

    setMatches(found);
  }, [input]);

  const typeLabel: Record<SourceMatch['type'], string> = {
    donation: 'Donation', report: 'Field Report', promise: 'Gov Promise',
  };
  const typeBadge: Record<SourceMatch['type'], string> = {
    donation: 'bg-green-100 text-green-700',
    report:   'bg-orange-100 text-orange-700',
    promise:  'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Paste any URL — instantly see if it's already logged. If not, jump straight to the right form with the URL pre-filled.
      </p>

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="https://jis.gov.jm/…  or  https://jamaica-gleaner.com/…"
          value={input}
          onChange={e => { setInput(e.target.value); setMatches(null); }}
          onKeyDown={e => e.key === 'Enter' && check()}
        />
        <button
          onClick={check}
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-40"
        >
          <Search className="w-4 h-4" /> Check
        </button>
      </div>

      {matches !== null && (
        matches.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              Already logged ({matches.length} {matches.length === 1 ? 'entry' : 'entries'})
            </div>
            {matches.map((m, i) => (
              <div key={i} className="flex items-start justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 gap-3">
                <div className="min-w-0">
                  <span className={`inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mr-2 ${typeBadge[m.type]}`}>
                    {typeLabel[m.type]}
                  </span>
                  <span className="text-sm text-gray-800 font-medium">{m.label}</span>
                  <div className="text-xs text-gray-400 mt-0.5">{m.date}</div>
                </div>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex-shrink-0 mt-0.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              Not logged yet — add it as:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['donation','report','promise'] as Panel[]).map(p => (
                <button
                  key={p}
                  onClick={() => onJumpTo(p, input.trim())}
                  className="py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-xs font-semibold text-gray-600 hover:border-slate-900 hover:text-slate-900 transition-colors capitalize"
                >
                  {p === 'donation' ? 'Donation' : p === 'report' ? 'Report' : 'Promise'}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const genId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── Donation Form ────────────────────────────────────────────────────────────
const DonationForm: React.FC<{ onSaved: () => void; prefillUrl?: string }> = ({ onSaved, prefillUrl }) => {
  const [f, setF] = useState({
    donorName: '', donorType: DonorType.INDIVIDUAL, amount: '',
    type: DonationType.CASH, date: new Date().toISOString().split('T')[0],
    status: Status.RECEIVED, targetParish: 'All', sourceUrl: prefillUrl ?? '', notes: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDonation({
      id: genId('d'),
      donorName: f.donorName,
      donorType: f.donorType,
      amount: Number(f.amount),
      type: f.type,
      date: f.date,
      status: f.status,
      targetParish: f.targetParish,
      sourceUrl: f.sourceUrl,
      notes: f.notes || undefined,
    });
    onSaved();
  };

  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Donor Name *</label>
          <input className="input" required value={f.donorName} onChange={e => set('donorName', e.target.value)} />
        </div>
        <div>
          <label className="label">Donor Type</label>
          <select className="input" value={f.donorType} onChange={e => set('donorType', e.target.value)}>
            {Object.values(DonorType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Donation Type</label>
          <select className="input" value={f.type} onChange={e => set('type', e.target.value)}>
            {Object.values(DonationType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Amount (JMD) *</label>
          <input className="input" type="number" required min="0" value={f.amount} onChange={e => set('amount', e.target.value)} />
        </div>
        <div>
          <label className="label">Date *</label>
          <input className="input" type="date" required value={f.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={f.status} onChange={e => set('status', e.target.value)}>
            {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Target Parish</label>
          <select className="input" value={f.targetParish} onChange={e => set('targetParish', e.target.value)}>
            <option value="All">All</option>
            {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Source URL (proof/receipt) *</label>
          <input className="input" type="url" required value={f.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} placeholder="https://…" />
        </div>
        <div className="col-span-2">
          <label className="label">Notes</label>
          <textarea className="input" rows={2} value={f.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>
      <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800">
        <Plus className="w-4 h-4" /> Save Donation
      </button>
    </form>
  );
};

// ─── Report Form ──────────────────────────────────────────────────────────────
const ReportForm: React.FC<{ onSaved: () => void; prefillUrl?: string }> = ({ onSaved, prefillUrl }) => {
  const [f, setF] = useState({
    parish: PARISHES[0], communityName: '', reporterType: 'Official' as 'Official' | 'Volunteer' | 'Resident',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    issue: '', sourceUrl: prefillUrl ?? '',
    verifiedCount: '0', disputedCount: '0',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveReport({
      id: genId('r'),
      parish: f.parish,
      communityName: f.communityName,
      reporterType: f.reporterType,
      severity: f.severity,
      issue: f.issue,
      verifiedCount: Number(f.verifiedCount) || 0,
      disputedCount: Number(f.disputedCount) || 0,
      timestamp: new Date().toISOString(),
      sourceUrl: f.sourceUrl,
    });
    onSaved();
  };

  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Parish *</label>
          <select className="input" value={f.parish} onChange={e => set('parish', e.target.value)}>
            {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Community *</label>
          <input className="input" required value={f.communityName} onChange={e => set('communityName', e.target.value)} />
        </div>
        <div>
          <label className="label">Reporter Type</label>
          <select className="input" value={f.reporterType} onChange={e => set('reporterType', e.target.value)}>
            {['Official','Volunteer','Resident'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Severity</label>
          <select className="input" value={f.severity} onChange={e => set('severity', e.target.value)}>
            {['Low','Medium','High','Critical'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Issue Description *</label>
          <textarea className="input" rows={3} required value={f.issue} onChange={e => set('issue', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Source URL *</label>
          <input className="input" type="url" required value={f.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} placeholder="https://…" />
        </div>
        <div>
          <label className="label">Verified Count</label>
          <input className="input" type="number" min="0" value={f.verifiedCount} onChange={e => set('verifiedCount', e.target.value)} />
        </div>
        <div>
          <label className="label">Disputed Count</label>
          <input className="input" type="number" min="0" value={f.disputedCount} onChange={e => set('disputedCount', e.target.value)} />
        </div>
      </div>
      <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800">
        <Plus className="w-4 h-4" /> Save Report
      </button>
    </form>
  );
};

// ─── Promise Form ─────────────────────────────────────────────────────────────
const PromiseForm: React.FC<{ onSaved: () => void; prefillUrl?: string }> = ({ onSaved, prefillUrl }) => {
  const [f, setF] = useState({
    title: '', description: '', promisedDate: new Date().toISOString().split('T')[0],
    budgetAllocated: '', budgetSpent: '0', status: Status.PLEDGED,
    progress: '0', sourceUrl: prefillUrl ?? '', ministry: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    savePromise({
      id: genId('p'),
      title: f.title,
      description: f.description,
      promisedDate: f.promisedDate,
      budgetAllocated: Number(f.budgetAllocated),
      budgetSpent: Number(f.budgetSpent),
      status: f.status,
      progress: Number(f.progress),
      sourceUrl: f.sourceUrl,
      ministry: f.ministry || undefined,
    });
    onSaved();
  };

  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }));

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Title *</label>
          <input className="input" required value={f.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Description *</label>
          <textarea className="input" rows={2} required value={f.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className="label">Budget Allocated (JMD) *</label>
          <input className="input" type="number" required min="0" value={f.budgetAllocated} onChange={e => set('budgetAllocated', e.target.value)} />
        </div>
        <div>
          <label className="label">Budget Spent (JMD)</label>
          <input className="input" type="number" min="0" value={f.budgetSpent} onChange={e => set('budgetSpent', e.target.value)} />
        </div>
        <div>
          <label className="label">Promised Date *</label>
          <input className="input" type="date" required value={f.promisedDate} onChange={e => set('promisedDate', e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={f.status} onChange={e => set('status', e.target.value)}>
            {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Progress % (0–100)</label>
          <input className="input" type="number" min="0" max="100" value={f.progress} onChange={e => set('progress', e.target.value)} />
        </div>
        <div>
          <label className="label">Ministry</label>
          <input className="input" value={f.ministry} onChange={e => set('ministry', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Source URL *</label>
          <input className="input" type="url" required value={f.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} placeholder="https://…" />
        </div>
      </div>
      <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800">
        <Plus className="w-4 h-4" /> Save Promise
      </button>
    </form>
  );
};

// ─── Admin Panel ──────────────────────────────────────────────────────────────
const AdminPanel: React.FC<Props> = ({ onClose }) => {
  const [pw, setPw]           = useState('');
  const [authed, setAuthed]   = useState(false);
  const [pwError, setPwError] = useState(false);
  const [panel, setPanel]     = useState<Panel>('inbox');
  const [prefillUrl, setPrefillUrl] = useState('');
  const [saved, setSaved]     = useState(false);

  const jumpTo = (p: Panel, url: string) => {
    setPrefillUrl(url);
    setPanel(p);
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  };

  const onSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white flex-shrink-0">
          <h2 className="text-lg font-bold">Admin</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700"><X className="w-5 h-5" /></button>
        </div>

        {!authed ? (
          /* ─ Password Gate ─ */
          <form onSubmit={login} className="flex-1 flex flex-col items-center justify-center px-8 gap-4">
            <Lock className="w-10 h-10 text-slate-400" />
            <p className="text-sm text-gray-600 text-center">Enter the admin password to manage ledger data.</p>
            <input
              type="password"
              className={`input w-full text-center text-lg tracking-widest ${pwError ? 'border-red-500' : ''}`}
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            {pwError && <p className="text-red-500 text-xs">Incorrect password.</p>}
            <button type="submit" className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800">
              Unlock
            </button>
          </form>
        ) : (
          /* ─ Forms ─ */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              {(['inbox','donation','report','promise'] as Panel[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPanel(p)}
                  className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    panel === p ? 'border-b-2 border-slate-900 text-slate-900' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {p === 'inbox' ? 'Inbox' : p === 'donation' ? 'Donation' : p === 'report' ? 'Report' : 'Promise'}
                </button>
              ))}
            </div>

            {/* Saved banner */}
            {saved && (
              <div className="bg-green-50 border-b border-green-200 px-6 py-2 text-sm text-green-700 font-medium">
                Saved — reload page to see updated data.
              </div>
            )}

            {/* Reset to verified data */}
            <div className="border-b border-gray-100 px-6 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">Flush localStorage → reload verified Hurricane Melissa data</span>
              <button
                onClick={() => {
                  if (confirm('Reset all ledger data to verified Hurricane Melissa records?')) {
                    resetToVerifiedData();
                    window.location.reload();
                  }
                }}
                className="text-xs px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-medium"
              >
                Reset to Verified
              </button>
            </div>

            {/* Form area */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {panel === 'inbox'    && <SourceInbox onJumpTo={jumpTo} />}
              {panel === 'donation' && <DonationForm onSaved={onSaved} prefillUrl={prefillUrl} />}
              {panel === 'report'   && <ReportForm   onSaved={onSaved} prefillUrl={prefillUrl} />}
              {panel === 'promise'  && <PromiseForm  onSaved={onSaved} prefillUrl={prefillUrl} />}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .input { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #111827; background: #f9fafb; outline: none; }
        .input:focus { border-color: #1e293b; box-shadow: 0 0 0 2px rgba(30,41,59,0.15); }
        textarea.input { resize: vertical; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
