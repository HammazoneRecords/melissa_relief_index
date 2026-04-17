import { Donation, CommunityReport, GovPromise, KPIMetrics, DonationType, DonorType, Status } from '../types';
import { VERIFIED_DONATIONS, VERIFIED_COMMUNITY_REPORTS, VERIFIED_GOV_PROMISES } from './verifiedData';

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
  return read<Donation>(KEYS.donations, SEED_DONATIONS);
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
  return read<CommunityReport>(KEYS.reports, SEED_REPORTS);
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
  return read<GovPromise>(KEYS.promises, SEED_PROMISES);
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

// ─── Computed KPIs ────────────────────────────────────────────────────────────
export function getKPIs(): KPIMetrics {
  const donations = getDonations();

  const totalCashReceived = donations
    .filter(d => d.type === DonationType.CASH && d.status !== Status.PLEDGED && d.status !== Status.FAILED)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalValueKind = donations
    .filter(d => d.type !== DonationType.CASH)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDisbursed = donations
    .filter(d => d.status === Status.DISTRIBUTED)
    .reduce((sum, d) => sum + d.amount, 0);

  const reports = getReports();
  const criticalZones = new Set(
    reports.filter(r => r.severity === 'Critical' || r.severity === 'High').map(r => r.parish)
  ).size;

  // These are manually updatable — stored separately or derived from entries
  return {
    totalCashReceived,
    totalValueKind,
    totalDisbursed,
    familiesHelped: 0,      // update manually via admin
    activeAgencies: new Set(donations.map(d => d.donorName)).size,
    criticalZones,
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
  totalReceived: number;
  donationCount: number;
  hasReport: boolean;
  topSeverity: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
}

const SEVERITY_RANK = { None: 0, Low: 1, Medium: 2, High: 3, Critical: 4 };

export function getParishSummaries(): ParishSummary[] {
  const donations = getDonations();
  const reports = getReports();

  return PARISHES.map(parish => {
    const parishDonations = donations.filter(
      d => d.targetParish === parish || d.targetParish === 'All'
    );
    const parishReports = reports.filter(r => r.parish === parish);

    const topSeverity = parishReports.reduce<ParishSummary['topSeverity']>(
      (top, r) => SEVERITY_RANK[r.severity] > SEVERITY_RANK[top] ? r.severity : top,
      'None'
    );

    return {
      parish,
      totalReceived: parishDonations.reduce((s, d) => s + d.amount, 0),
      donationCount: parishDonations.length,
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
