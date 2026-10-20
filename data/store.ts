import { Donation, CommunityReport, GovPromise, KPIMetrics, DonationType, DonorType, Status, FulfillmentGrade, ClaimCategory, EvidenceConfidence, ClaimProvenance, SourceDocument } from '../types';
import { VERIFIED_DONATIONS, VERIFIED_COMMUNITY_REPORTS, VERIFIED_GOV_PROMISES, SOURCE_DOCUMENTS, applyProvenanceOverrides } from './verifiedData';

// ─── Storage keys ────────────────────────────────────────────────────────────
const KEYS = {
  donations: 'mri_donations',
  reports: 'mri_reports',
  promises: 'mri_promises',
  lastUpdated: 'mri_last_updated',
};

// ─── Seed data — sourced from verified Hurricane Melissa records ──────────────
// All entries in verifiedData.ts have explicit source URLs
const SEED_DONATIONS: Donation[] = VERIFIED_DONATIONS;
const SEED_REPORTS: CommunityReport[] = VERIFIED_COMMUNITY_REPORTS;
const SEED_PROMISES: GovPromise[] = VERIFIED_GOV_PROMISES;

// ─── Source document lookup ───────────────────────────────────────────────────
const SOURCE_BY_URL = new Map<string, SourceDocument>();
SOURCE_DOCUMENTS.forEach(s => {
  SOURCE_BY_URL.set(s.url, s);
  SOURCE_BY_URL.set(s.url.replace(/\/$/, ''), s);
  SOURCE_BY_URL.set(s.url.toLowerCase().replace(/\/$/, ''), s);
});

/** Derives ClaimCategory from a Donation's type. */
function donationCategory(d: Donation): ClaimCategory {
  if (d.type === DonationType.CASH) return ClaimCategory.CASH;
  if (d.type === DonationType.FOOD || d.type === DonationType.SUPPLIES) return ClaimCategory.PACKAGES;
  if (d.type === DonationType.EQUIPMENT) return ClaimCategory.OPERATIONAL;
  return ClaimCategory.OTHER;
}

/** Auto-enriches a record with provenance if it doesn't have one. */
function enrichDonation(d: Donation): Donation {
  if (d.provenance) return applyProvenanceOverrides(d);
  const src = SOURCE_BY_URL.get(d.sourceUrl);
  const enriched: Donation = {
    ...d,
    provenance: {
      sourceId: src?.id ?? `unmapped:${d.sourceUrl}`,
      category: donationCategory(d),
      confidence: src ? EvidenceConfidence.REPORTED : EvidenceConfidence.HELD,
      unit: d.type === DonationType.CASH ? 'JMD' : undefined,
      flags: src ? [] : ['unmapped-source'],
    },
  };
  return applyProvenanceOverrides(enriched);
}

function enrichReport(r: CommunityReport): CommunityReport {
  if (r.provenance) return applyProvenanceOverrides(r);
  const src = SOURCE_BY_URL.get(r.sourceUrl);
  const enriched: CommunityReport = {
    ...r,
    provenance: {
      sourceId: src?.id ?? `unmapped:${r.sourceUrl}`,
      category: ClaimCategory.PEOPLE,
      confidence: src ? EvidenceConfidence.REPORTED : EvidenceConfidence.HELD,
      unit: 'people',
      flags: src ? [] : ['unmapped-source'],
    },
  };
  return applyProvenanceOverrides(enriched);
}

function enrichPromise(p: GovPromise): GovPromise {
  if (p.provenance) return applyProvenanceOverrides(p);
  const src = SOURCE_BY_URL.get(p.sourceUrl);
  const enriched: GovPromise = {
    ...p,
    provenance: {
      sourceId: src?.id ?? `unmapped:${p.sourceUrl}`,
      category: p.budgetAllocated > 0 ? ClaimCategory.BUDGET : ClaimCategory.INFRA,
      confidence: src ? EvidenceConfidence.REPORTED : EvidenceConfidence.HELD,
      unit: p.budgetAllocated > 0 ? 'USD' : undefined,
      flags: src ? [] : ['unmapped-source'],
    },
  };
  return applyProvenanceOverrides(enriched);
}

// ─── Generic read/write helpers ───────────────────────────────────────────────
function read<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return seed;
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(KEYS.lastUpdated, new Date().toISOString());
}

// ─── Donations ────────────────────────────────────────────────────────────────
export function getDonations(): Donation[] {
  return read<Donation>(KEYS.donations, SEED_DONATIONS).map(enrichDonation);
}

export function saveDonation(donation: Donation): void {
  const all = getDonations();
  const idx = all.findIndex(d => d.id === donation.id);
  if (idx >= 0) all[idx] = donation;
  else all.unshift(donation);
  write(KEYS.donations, all);
}

export function deleteDonation(id: string): void {
  write(KEYS.donations, getDonations().filter(d => d.id !== id));
}

// ─── Community Reports ────────────────────────────────────────────────────────
export function getReports(): CommunityReport[] {
  return read<CommunityReport>(KEYS.reports, SEED_REPORTS).map(enrichReport);
}

export function saveReport(report: CommunityReport): void {
  const all = getReports();
  const idx = all.findIndex(r => r.id === report.id);
  if (idx >= 0) all[idx] = report;
  else all.unshift(report);
  write(KEYS.reports, all);
}

export function deleteReport(id: string): void {
  write(KEYS.reports, getReports().filter(r => r.id !== id));
}

// ─── Government Promises ──────────────────────────────────────────────────────
export function getPromises(): GovPromise[] {
  return read<GovPromise>(KEYS.promises, SEED_PROMISES).map(enrichPromise);
}

export function savePromise(promise: GovPromise): void {
  const all = getPromises();
  const idx = all.findIndex(p => p.id === promise.id);
  if (idx >= 0) all[idx] = promise;
  else all.unshift(promise);
  write(KEYS.promises, all);
}

export function deletePromise(id: string): void {
  write(KEYS.promises, getPromises().filter(p => p.id !== id));
}

// ─── Source Documents ─────────────────────────────────────────────────────────
export function getSourceDocuments(): SourceDocument[] {
  return SOURCE_DOCUMENTS;
}

export function getSourceById(id: string): SourceDocument | undefined {
  return SOURCE_DOCUMENTS.find(s => s.id === id);
}

// ─── Computed KPIs ────────────────────────────────────────────────────────────
export function getKPIs(): KPIMetrics {
  const donations = getDonations();
  // Sub-claims (e.g. don-012 diaspora fund inside the don-001 aggregate fund)
  // are excluded from cash totals to avoid double-counting.
  const isSubClaim = (d: Donation) => !!d.provenance?.parentClaimId;
  const topLevelCash = donations.filter(
    d => d.type === DonationType.CASH && !isSubClaim(d)
  );

  const totalCashReceived = topLevelCash
    .filter(d => d.status !== Status.PLEDGED && d.status !== Status.FAILED)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDisbursed = topLevelCash
    .filter(d => d.status === Status.DISTRIBUTED)
    .reduce((sum, d) => sum + d.amount, 0);

  const reports = getReports();
  const criticalZones = new Set(
    reports.filter(r => r.severity === 'Critical' || r.severity === 'High').map(r => r.parish)
  ).size;

  return {
    totalCashReceived,
    totalDisbursed,
    inKindRecordCount: donations.filter(d => d.type !== DonationType.CASH).length,
    sourceBackedRecordCount: donations.length + reports.length + getPromises().length,
    activeAgencies: new Set(donations.map(d => d.donorName)).size,
    criticalZones,
    flaggedClaimCount: [
      ...donations,
      ...reports,
      ...getPromises(),
    ].filter(r => {
      const c = r.provenance?.confidence;
      return c === EvidenceConfidence.HELD || c === EvidenceConfidence.DISPUTED;
    }).length,
    sourceDocumentCount: SOURCE_DOCUMENTS.length,
  };
}

// ─── Last updated timestamp ───────────────────────────────────────────────────
export function getLastUpdated(): string | null {
  return localStorage.getItem(KEYS.lastUpdated);
}

// ─── Reset to verified seed data (use from Admin panel to flush stale localStorage) ──
export function resetToVerifiedData(): void {
  write(KEYS.donations, VERIFIED_DONATIONS);
  write(KEYS.reports, VERIFIED_COMMUNITY_REPORTS);
  write(KEYS.promises, VERIFIED_GOV_PROMISES);
}

// ─── Parish summary (for Relief Map) ─────────────────────────────────────────
export interface ParishSummary {
  parish: string;
  directCashReceived: number;
  directAssistanceRecordCount: number;
  evidenceRecordCount: number;
  hasReport: boolean;
  topSeverity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
}

const SEVERITY_RANK = { None: 0, Low: 1, Medium: 2, High: 3, Critical: 4 };

export function getParishSummaries(): ParishSummary[] {
  const donations = getDonations();
  const reports = getReports();

  return PARISHES.map(parish => {
    const parishDonations = donations.filter(d => d.targetParish === parish);
    const parishReports = reports.filter(r => r.parish === parish);

    const topSeverity = parishReports.reduce<ParishSummary['topSeverity']>(
      (top, r) => SEVERITY_RANK[r.severity] > SEVERITY_RANK[top] ? r.severity : top,
      'None'
    );

    return {
      parish,
      directCashReceived: parishDonations
        .filter(d => d.type === DonationType.CASH && d.status !== Status.PLEDGED && d.status !== Status.FAILED)
        .reduce((s, d) => s + d.amount, 0),
      directAssistanceRecordCount: parishDonations.length,
      evidenceRecordCount: parishDonations.length + parishReports.length,
      hasReport: parishReports.length > 0,
      topSeverity,
    };
  });
}

export const PARISHES = [
  "Hanover", "St. Elizabeth", "St. James", "Trelawny", "Westmoreland",
  "Clarendon", "Manchester", "St. Ann", "St. Catherine", "St. Mary",
  "Kingston", "Portland", "St. Andrew", "St. Thomas"
];

// ─── Gap Detection & Fulfillment Analysis ────────────────────────────────────

export function getFulfillmentGrade(promise: GovPromise, today: Date): FulfillmentGrade {
  const hasEvidence = (promise.reportIds?.length ?? 0) > 0;
  if (!hasEvidence) return FulfillmentGrade.UNVERIFIED;

  const due = new Date(promise.promisedDate);
  const isOverdue = due < today && promise.progress < 100;

  if (promise.progress === 100 && promise.status === Status.DISTRIBUTED) return FulfillmentGrade.FULFILLED;
  if (isOverdue && promise.progress === 0 && promise.status === Status.PLEDGED) return FulfillmentGrade.UNFULFILLED;
  if (isOverdue) return FulfillmentGrade.OVERDUE;
  return FulfillmentGrade.PARTIAL;
}

export function getUnverifiedPromises(promises: GovPromise[]): GovPromise[] {
  return promises.filter(p => !p.reportIds || p.reportIds.length === 0);
}

export function getOverduePromises(promises: GovPromise[], today: Date): GovPromise[] {
  return promises.filter(p => {
    const due = new Date(p.promisedDate);
    return due < today && p.progress < 100;
  });
}

export function getUnreportedParishes(donations: Donation[], reports: CommunityReport[]): string[] {
  const reportedParishes = new Set(reports.map(r => r.parish));
  const donationParishes = new Set(
    donations.flatMap(d => d.targetParish === 'All' ? [] : [d.targetParish])
  );
  return [...donationParishes].filter(p => !reportedParishes.has(p));
}

export function getUntrackedDonations(donations: Donation[], reports: CommunityReport[]): Donation[] {
  return donations.filter(d => {
    if (d.targetParish === 'All') return false;
    const parishReports = reports.filter(r => r.parish === d.targetParish);
    return parishReports.every(r => (r.verifiedCount ?? 0) === 0);
  });
}

export function getBudgetOverruns(promises: GovPromise[]): GovPromise[] {
  return promises.filter(p => p.budgetAllocated > 0 && p.budgetSpent > p.budgetAllocated);
}

// ─── Overlap-Aware Totals (Task 002) ──────────────────────────────────────────
// Separates claims by category and excludes sub-claims from parent totals.

export interface OverlapGroup {
  parentId: string;
  parentLabel: string;
  childIds: string[];
}

/** All known parent-child overlap groups. */
export function getOverlapGroups(): OverlapGroup[] {
  const all = [
    ...getDonations().map(d => ({ id: d.id, label: d.donorName })),
    ...getReports().map(r => ({ id: r.id, label: r.communityName })),
    ...getPromises().map(p => ({ id: p.id, label: p.title })),
  ];
  const labelMap = new Map(all.map(a => [a.id, a.label]));

  const groups = new Map<string, OverlapGroup>();
  const allRecords = [...getDonations(), ...getReports(), ...getPromises()];

  allRecords.forEach(r => {
    const pid = r.provenance?.parentClaimId;
    if (pid) {
      if (!groups.has(pid)) {
        groups.set(pid, {
          parentId: pid,
          parentLabel: labelMap.get(pid) ?? pid,
          childIds: [],
        });
      }
      groups.get(pid)!.childIds.push(r.id);
    }
  });

  return [...groups.values()];
}

/** Returns the set of all claim IDs that are sub-claims (have a parent). */
export function getSubClaimIds(): Set<string> {
  const subIds = new Set<string>();
  [...getDonations(), ...getReports(), ...getPromises()].forEach(r => {
    if (r.provenance?.parentClaimId) subIds.add(r.id);
  });
  return subIds;
}

/** Cash totals broken down by category, with overlap annotation. */
export interface CategoryTotal {
  category: ClaimCategory;
  unit: string;
  totalAmount: number;
  recordCount: number;
  subClaimCount: number;
  note: string;
}

export function getCategoryTotals(): CategoryTotal[] {
  const donations = getDonations();
  const subIds = getSubClaimIds();

  const byCategory = new Map<ClaimCategory, { amount: number; count: number; subCount: number; unit: string }>();

  donations.forEach(d => {
    const cat = d.provenance?.category ?? ClaimCategory.OTHER;
    const unit = d.provenance?.unit ?? (d.type === DonationType.CASH ? 'JMD' : 'count');
    const existing = byCategory.get(cat) ?? { amount: 0, count: 0, subCount: 0, unit };
    existing.count++;
    if (subIds.has(d.id)) existing.subCount++;
    if (d.type === DonationType.CASH && !d.provenance?.parentClaimId
        && d.status !== Status.PLEDGED && d.status !== Status.FAILED) {
      existing.amount += d.amount;
    }
    byCategory.set(cat, existing);
  });

  // Also collect GovPromise budget figures as BUDGET category
  const promises = getPromises();
  const budgetExisting = byCategory.get(ClaimCategory.BUDGET) ?? { amount: 0, count: 0, subCount: 0, unit: 'USD' };
  promises.forEach(p => {
    if (p.budgetAllocated > 0) {
      budgetExisting.count++;
      budgetExisting.amount += p.budgetAllocated;
      if (subIds.has(p.id)) budgetExisting.subCount++;
    }
  });
  if (budgetExisting.count > 0) byCategory.set(ClaimCategory.BUDGET, budgetExisting);

  return [...byCategory.entries()].map(([category, data]) => ({
    category,
    unit: data.unit,
    totalAmount: data.amount,
    recordCount: data.count,
    subClaimCount: data.subCount,
    note: data.subCount > 0
      ? `${data.subCount} sub-claim(s) excluded from parent totals`
      : 'No sub-claims',
  }));
}

/** Returns records with data-quality flags for review. */
export function getFlaggedRecords(): Array<{ id: string; label: string; type: string; flags: string[] }> {
  const results: Array<{ id: string; label: string; type: string; flags: string[] }> = [];

  getDonations().forEach(d => {
    const flags = d.provenance?.flags;
    if (flags && flags.length > 0) {
      results.push({ id: d.id, label: d.donorName, type: 'Donation', flags });
    }
  });
  getReports().forEach(r => {
    const flags = r.provenance?.flags;
    if (flags && flags.length > 0) {
      results.push({ id: r.id, label: r.communityName, type: 'Report', flags });
    }
  });
  getPromises().forEach(p => {
    const flags = p.provenance?.flags;
    if (flags && flags.length > 0) {
      results.push({ id: p.id, label: p.title, type: 'Promise', flags });
    }
  });

  return results;
}
