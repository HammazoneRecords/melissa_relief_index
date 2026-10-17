export enum Beneficiary {
  PEOPLE = 'People',
  INFRASTRUCTURE = 'Infrastructure',
  SYSTEM = 'System',
}

export enum DonorType {
  INDIVIDUAL = 'Individual',
  NGO = 'NGO',
  GOV = 'Government',
  COMPANY = 'Private Sector',
  ARTIST = 'Artist',
  DIASPORA = 'Diaspora',
  INFLUENCER = 'Influencer',
  YOUTUBER = 'YouTuber',
}

export enum DonationType {
  CASH = 'Cash',
  SUPPLIES = 'Supplies',
  SERVICE = 'Service',
  EQUIPMENT = 'Equipment',
  FOOD = 'Food'
}

export enum OrgType {
  GOVERNMENT = 'Government',
  NGO = 'NGO',
  PRIVATE = 'Private',
  COMMUNITY = 'Community'
}

export enum Status {
  PLEDGED = 'Pledged',
  RECEIVED = 'Received',
  VERIFIED = 'Verified',
  DISTRIBUTED = 'Distributed',
  DELAYED = 'Delayed',
  FAILED = 'Failed'
}

export enum FulfillmentGrade {
  FULFILLED   = 'Fulfilled',   // progress 100, status DISTRIBUTED, has ≥1 reportId
  PARTIAL     = 'Partial',     // progress 1–99 OR status RECEIVED/VERIFIED
  UNFULFILLED = 'Unfulfilled', // progress 0 AND status PLEDGED, past promisedDate
  OVERDUE     = 'Overdue',     // promisedDate < today AND progress < 100
  UNVERIFIED  = 'Unverified',  // no reportIds linked at all
}

// ─── Evidence & Provenance Schema (Task 001) ─────────────────────────────────

/** How a source was obtained and its reliability tier. */
export enum SourceGrade {
  OFFICIAL = 'Official',         // gov press release, JIS, OPM, parliament record
  PRIMARY  = 'Primary',          // NGO operational report, dashboard with named data
  SECONDARY = 'Secondary',       // news article citing an official, aggregated dashboard
  UNVERIFIED = 'Unverified',     // social media, unattributed claim, unknown origin
}

/** What kind of thing a claim asserts. Separates cash from people from packages. */
export enum ClaimCategory {
  CASH        = 'Cash',          // JMD or USD monetary amount
  BUDGET      = 'Budget',        // allocated/spent budget figure
  PEOPLE      = 'People',        // displaced, housed, fed, employed count
  PACKAGES    = 'Packages',      // food parcels, hygiene kits, supply units
  SHELTER     = 'Shelter',       // shelter count, occupancy, bedding
  OPERATIONAL = 'Operational',   // generators, vehicles, hubs, personnel deployments
  INFRA       = 'Infrastructure',// grid restoration, water, roads, buildings
  OTHER       = 'Other',         // catch-all — flagged for review
}

/** Confidence in a single claim, independent of source grade. */
export enum EvidenceConfidence {
  CONFIRMED  = 'Confirmed',      // corroborated by ≥2 independent sources
  REPORTED   = 'Reported',       // single source, plausible, no contradiction
  ESTIMATED  = 'Estimated',      // derived or extrapolated, disclosed as estimate
  DISPUTED   = 'Disputed',       // conflicting sources exist
  HELD       = 'Held',           // recorded but not yet assessed
}

/**
 * A source document — the root evidence entity.
 * One source can anchor many claims. A claim without a source document
 * is a lead, not evidence.
 */
export interface SourceDocument {
  id: string;                    // e.g. "src-001"
  url: string;
  title: string;
  publisher: string;             // e.g. "JIS", "OPM", "Jamaica Gleaner"
  datePublished: string;         // ISO date the source was published
  dateRetrieved: string;         // ISO date we captured it
  grade: SourceGrade;
  excerpt?: string;              // the specific passage that supports the claim
  notes?: string;                // why this source, what it covers, known gaps
}

/**
 * How a single claim connects to its evidence.
 * Every Donation, CommunityReport, and GovPromise carries this inline.
 */
export interface ClaimProvenance {
  sourceId: string;              // FK → SourceDocument.id
  category: ClaimCategory;       // what kind of thing is being claimed
  confidence: EvidenceConfidence;// how sure we are about this specific claim
  unit?: string;                 // e.g. "JMD", "USD", "people", "generators", "packages"
  dateObserved?: string;         // when the claim was observed in the source (may differ from publication date)
  excerptContext?: string;       // the exact text from the source that grounds this claim
  /** If this claim is a sub-aggregate of another, reference the parent claim ID.
   *  E.g. J$200M diaspora figure is part of J$1.4B aggregate fund. */
  parentClaimId?: string;
  /** Claims known to overlap with this one. Excluded from incompatible totals. */
  overlapsWith?: string[];
  /** Open data-quality flags for this specific claim. */
  flags?: string[];
}

// ─── Core Record Types (updated with provenance) ─────────────────────────────

export interface Donation {
  id: string;
  donorName: string;
  donorType: DonorType;
  amount: number;
  type: DonationType;
  date: string;
  status: Status;
  targetParish: string;
  sourceUrl: string;            // kept for backward compat; canonical link is provenance.sourceId → SourceDocument.url
  notes?: string;
  provenance?: ClaimProvenance; // Task 001: enriched at read time if missing; per-claim evidence tracking
}

export interface CommunityReport {
  id: string;
  parish: string;
  communityName: string;
  reporterType: 'Resident' | 'Volunteer' | 'Official';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  issue: string;
  verifiedCount: number;
  disputedCount: number;
  timestamp: string;
  sourceUrl: string;            // kept for backward compat
  provenance?: ClaimProvenance; // Task 001: enriched at read time if missing
}

export interface GovPromise {
  id: string;
  title: string;
  description: string;
  promisedDate: string;
  budgetAllocated: number;
  budgetSpent: number;
  status: Status;
  progress: number;             // 0-100
  sourceUrl: string;            // kept for backward compat
  ministry?: string;
  reportIds?: string[];         // CommunityReport IDs that validate this promise
  fulfilledDate?: string;       // ISO date when promise was confirmed delivered
  provenance?: ClaimProvenance; // Task 001: enriched at read time if missing
}

export interface KPIMetrics {
  totalCashReceived: number;
  totalDisbursed: number;
  inKindRecordCount: number;
  sourceBackedRecordCount: number;
  activeAgencies: number;
  criticalZones: number;
  /** Count of records with Held or Disputed confidence. */
  flaggedClaimCount: number;
  /** Count of unique source documents in the ledger. */
  sourceDocumentCount: number;
}
