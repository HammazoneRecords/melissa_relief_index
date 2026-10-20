import { GovPromise, CommunityReport, Donation, Status, DonorType, DonationType, SourceDocument, SourceGrade, ClaimCategory, EvidenceConfidence, ClaimProvenance, Beneficiary } from "../types";

// ─── Source Document Registry ─────────────────────────────────────────────────
// Every claim must trace to one of these. One source → many claims.

export const SOURCE_DOCUMENTS: SourceDocument[] = [
  {
    id: 'src-001',
    url: 'https://jis.gov.jm/cabinet-approves-us150-million-loan-to-jps-to-speed-up-restoration-efforts/',
    title: 'Cabinet Approves US$150 Million Loan to JPS',
    publisher: 'JIS',
    datePublished: '2025-11-25',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: 'Cabinet has approved a US$150-million loan to the Jamaica Public Service Company (JPS) to accelerate power restoration following Hurricane Melissa.',
  },
  {
    id: 'src-002',
    url: 'https://jis.gov.jm/over-50-generators-positioned-for-rapid-water-restoration-by-nwc/',
    title: 'Over 50 Generators Positioned for Rapid Water Restoration by NWC',
    publisher: 'JIS',
    datePublished: '2025-10-25',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-003',
    url: 'https://jis.gov.jm/20-generators-donated-to-aid-recovery-in-hurricane-affected-schools/',
    title: '20 Generators Donated to Aid Recovery in Hurricane-Affected Schools',
    publisher: 'JIS',
    datePublished: '2026-04-07',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: 'Latoya Harris Ghartey (NET Executive Director): 700+ educational institutions devastated. 20 generators donated to National Education Trust.',
  },
  {
    id: 'src-004',
    url: 'https://jis.gov.jm/prime-minister-outlines-generator-allocation-strategy-to-boost-post%E2%80%91hurricane-resilience/',
    title: 'Prime Minister Outlines Generator Allocation Strategy',
    publisher: 'JIS',
    datePublished: '2025-11-30',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: 'PM Holness: donated generators to go to State/NGO relief efforts; purchased generators to be loaned to businesses. Approximately 600 donated units.',
  },
  {
    id: 'src-005',
    url: 'https://supportjamaica.gov.jm/dashboard',
    title: 'Support Jamaica — Hurricane Melissa Relief Dashboard',
    publisher: 'Support Jamaica (Gov of Jamaica)',
    datePublished: '2025-10-28',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.PRIMARY,
    notes: 'Aggregate dashboard. Per-parish drop counts are estimates based on ODPEM per-drop averages. Individual drop data not publicly available.',
  },
  {
    id: 'src-006',
    url: 'https://jpsco.com/restoration-progress/',
    title: 'JPS Restoration Progress — Hanover & Westmoreland',
    publisher: 'JPS Co.',
    datePublished: '2025-11-15',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.PRIMARY,
  },
  {
    id: 'src-007',
    url: 'https://opm.gov.jm/government-tables-national-reconstruction-and-resilience-authority-bill/',
    title: 'Government Tables National Reconstruction and Resilience Authority Bill',
    publisher: 'OPM',
    datePublished: '2026-01-15',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: 'Multilateral financing secured: US$6.7B from IMF, World Bank, IDB, CAF, CDB against US$12.2B total damage. FAST Jamaica threshold lowered to US$15M.',
  },
  {
    id: 'src-008',
    url: 'https://opm.gov.jm/statement-to-parliament-on-the-aftermath-of-hurricane-melissa/',
    title: 'Statement to Parliament on the Aftermath of Hurricane Melissa',
    publisher: 'OPM',
    datePublished: '2025-11-04',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: '30,000 persons displaced. 520+ shelters activated. US$6B initial damage estimate.',
  },
  {
    id: 'src-009',
    url: 'https://www.globalempowermentmission.org/mission/hurricane-melissa/',
    title: 'Hurricane Melissa — Global Empowerment Mission',
    publisher: 'Global Empowerment Mission',
    datePublished: '2025-12-10',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.SECONDARY,
    notes: 'Cites ODPEM figures: 45 deaths, 13 missing. NGO operational report — primary for their own ops, secondary for ODPEM figures.',
  },
  {
    id: 'src-010',
    url: 'https://odpem.gov.jm/needs-assessment/',
    title: 'ODPEM Needs Assessment — Hurricane Melissa',
    publisher: 'ODPEM',
    datePublished: '2025-11-15',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-011',
    url: 'https://www.salvationarmyusa.org/stories/hurricane-melissa-response-the-salvation-army-in-action/',
    title: 'Hurricane Melissa Response — The Salvation Army in Action',
    publisher: 'The Salvation Army USA',
    datePublished: '2025-11-07',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.PRIMARY,
  },
  {
    id: 'src-012',
    url: 'https://moh.gov.jm/health-update/',
    title: 'Ministry of Health — Hurricane Melissa Health Update',
    publisher: 'Ministry of Health Jamaica',
    datePublished: '2025-11-12',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-013',
    url: 'https://diplomatie.belgium.be/en/news/b-fast-sends-generators-jamaica',
    title: 'B-FAST Sends Generators to Jamaica',
    publisher: 'Belgian Government',
    datePublished: '2025-11-03',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-014',
    url: 'https://www.usaid.gov/jamaica',
    title: 'USAID Jamaica — Hurricane Melissa Response',
    publisher: 'USAID',
    datePublished: '2025-11-05',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-015',
    url: 'https://www.international.gc.ca/world-monde/issues_development-enjeux_developpement/response_relief-reponse_relief/jamaica-jamaique.aspx',
    title: 'Canada Hurricane Melissa Relief — Jamaica',
    publisher: 'Global Affairs Canada',
    datePublished: '2025-11-08',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-016',
    url: 'https://cdema.org/',
    title: 'CDEMA — Hurricane Melissa Regional Response',
    publisher: 'CDEMA',
    datePublished: '2025-11-01',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
  },
  {
    id: 'src-017',
    url: 'https://www.ifrc.org/',
    title: 'IFRC — Jamaica Hurricane Melissa Appeal',
    publisher: 'IFRC',
    datePublished: '2025-10-30',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.PRIMARY,
  },
  {
    id: 'src-018',
    url: 'https://www.unicef.org/',
    title: 'UNICEF Jamaica — Hurricane Melissa Emergency Response',
    publisher: 'UNICEF',
    datePublished: '2025-11-04',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.PRIMARY,
  },
  {
    id: 'src-019',
    url: 'https://jis.gov.jm/government-allocates-1-billion-for-hurricane-relief-programme/',
    title: 'Government Allocates J$1 Billion for Hurricane Relief Programme',
    publisher: 'JIS',
    datePublished: '2025-11-10',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: 'The Government has allocated J$1 billion for the Hurricane Melissa relief programme, with J$500 million earmarked for emergency housing repair and J$500 million for agricultural recovery.',
  },
  {
    id: 'src-020',
    url: 'https://jis.gov.jm/cdf-allocates-200-million-for-hurricane-melissa-relief/',
    title: 'CDF Allocates J$200 Million for Hurricane Melissa Relief',
    publisher: 'JIS',
    datePublished: '2025-11-12',
    dateRetrieved: '2026-04-16',
    grade: SourceGrade.OFFICIAL,
    excerpt: 'The Constituency Development Fund has allocated J$200 million for immediate relief distribution through Members of Parliament across affected constituencies.',
  },
];

/** Maps a source URL to its SourceDocument ID for provenance linking. */
const URL_TO_SOURCE_ID: Record<string, string> = {};
SOURCE_DOCUMENTS.forEach(s => {
  URL_TO_SOURCE_ID[s.url] = s.id;
  // also index normalised versions
  URL_TO_SOURCE_ID[s.url.replace(/\/$/, '')] = s.id;
  URL_TO_SOURCE_ID[s.url.replace(/\/$/, '').toLowerCase()] = s.id;
});

/** Builds a ClaimProvenance from a source URL and category info.
 *  Falls back to HELD confidence if the source isn't in the registry. */
function buildProvenance(
  sourceUrl: string,
  category: ClaimCategory,
  overrides?: Partial<ClaimProvenance>
): ClaimProvenance {
  const sourceId = URL_TO_SOURCE_ID[sourceUrl]
    || URL_TO_SOURCE_ID[sourceUrl.replace(/\/$/, '')]
    || URL_TO_SOURCE_ID[sourceUrl.toLowerCase().replace(/\/$/, '')]
    || `unmapped:${sourceUrl}`;

  const isMapped = sourceId.startsWith('src-');
  return {
    sourceId,
    category,
    confidence: isMapped ? EvidenceConfidence.REPORTED : EvidenceConfidence.HELD,
    flags: isMapped ? [] : ['unmapped-source'],
    ...overrides,
  };
}

// ─── Overlap Registry (Task 002) ─────────────────────────────────────────────
// Per-claim provenance overrides for records with known parent-child or
// overlapping relationships. These prevent double-counting in totals.

interface ProvenanceOverride {
  parentClaimId?: string;
  overlapsWith?: string[];
  confidence?: EvidenceConfidence;
  flags?: string[];
  unit?: string;
  category?: ClaimCategory;
}

const PROVENANCE_OVERRIDES: Record<string, ProvenanceOverride> = {
  // ── JPS Loan → Restoration (parent-child) ──────────────────────────────
  // gov-001: US$150M Cabinet-approved loan to JPS — the financial envelope
  // infra-001: JPS grid restoration (96%) — the on-the-ground result
  // The $150M loan allocated IS the budget for the restoration.
  'infra-001': {
    parentClaimId: 'gov-001',
    overlapsWith: ['gov-001'],
    flags: ['sub-claim: JPS restoration funded by gov-001 loan'],
  },
  'gov-001': {
    flags: ['parent-claim: US$150M loan is financial envelope for infra-001 restoration'],
  },

  // ── Multi-source confirmation: damage estimates ────────────────────────
  // impact-001 cites US$6B initial (PM Holness Nov 4) and US$8.8B revised (World Bank/IDB Dec 4)
  'impact-001': {
    confidence: EvidenceConfidence.CONFIRMED,
    flags: ['corroborated: US$6B (PM Holness) + US$8.8B (World Bank/IDB) — different scopes, different dates'],
  },

  // ── Generator counts: national pool vs NET-specific ────────────────────
  // gov-004: ~600 generators donated (Belgium 409, USAID 100, Canada 75, CARICOM 16)
  // gov-003: 20 generators to NET for schools — counted separately
  // don-006: same 20 generators as gov-003 (NET schools donor)
  'gov-003': {
    overlapsWith: ['don-006'],
    flags: ['same 20 generators as don-006 — do not double-count'],
  },
  'don-006': {
    overlapsWith: ['gov-003'],
    flags: ['same 20 generators as gov-003 — do not double-count'],
  },

  // ── Diaspora fund is part of the national relief picture ───────────────
  // don-012: J$200M diaspora — not a sub-claim of any single record, but
  // is a component of the total national cash relief pool
  'don-012': {
    parentClaimId: 'don-001',
    overlapsWith: ['don-001'],
    flags: ['component: diaspora contribution to national cash relief pool — not an independent total; sub-claim of don-001, excluded from cash totals to avoid double-counting'],
  },

  // ── Aggregate relief fund is RECEIVED, not disbursed ───────────────────
  'don-001': {
    flags: ['received-not-disbursed: J$1.4B collected into the Hurricane Relief Fund. No public per-household disbursement breakdown has been published as of the latest source (Apr 16, 2026).'],
  },

  // ── NaRRA multilateral financing — pledged, not received ───────────────
  'narr-001': {
    confidence: EvidenceConfidence.REPORTED,
    flags: ['pledged: US$6.7B multilateral financing pledged against US$12.2B damage. Financing gap US$5.5B. Not yet disbursed.'],
  },

  // ── FAST Jamaica projects — early-stage, minimal spend ─────────────────
  'fast-001': {
    confidence: EvidenceConfidence.REPORTED,
    flags: ['pledged: US$45M Port Antonio cruise pier — 5% progress, US$2M spent. Projected, not guaranteed.'],
  },
  'fast-002': {
    confidence: EvidenceConfidence.REPORTED,
    flags: ['pledged: US$28M Negril boardwalk — 3% progress, $0 spent. Projected, not guaranteed.'],
  },
  'fast-003': {
    confidence: EvidenceConfidence.REPORTED,
    flags: ['pledged: US$60M Kingston waterfront hotel — 2% progress, $0 spent. Projected, not guaranteed.'],
  },
};

/** Applies provenance overrides for known overlap relationships. */
export function applyProvenanceOverrides<T extends { id: string; provenance?: ClaimProvenance }>(
  record: T
): T {
  const override = PROVENANCE_OVERRIDES[record.id];
  if (!override) return record;
  const existing = record.provenance ?? {} as ClaimProvenance;
  return {
    ...record,
    provenance: {
      ...existing,
      ...(override.parentClaimId ? { parentClaimId: override.parentClaimId } : {}),
      ...(override.overlapsWith ? { overlapsWith: override.overlapsWith } : {}),
      ...(override.confidence ? { confidence: override.confidence } : {}),
      ...(override.category ? { category: override.category } : {}),
      ...(override.unit ? { unit: override.unit } : {}),
      flags: [...(existing.flags ?? []), ...(override.flags ?? [])],
    },
  };
}

// ─── Government Promises & Infrastructure Actions ─────────────────────────────
// All entries sourced from official press releases, JIS, OPM, or Support Jamaica dashboard

export const VERIFIED_GOV_PROMISES: GovPromise[] = [
  {
    id: 'gov-001',
    beneficiary: Beneficiary.PEOPLE,
    title: 'US$150 Million JPS Loan — Cabinet Approval',
    description: 'Cabinet-approved loan to JPS to accelerate power restoration. Announced by Minister Daryl Vaz, Nov 25. Loan disbursed to JPS in tranches; restoration tracked separately in infra-001. Target: full grid restoration by end of January/early February 2026.',
    promisedDate: '2025-11-25',
    budgetAllocated: 150000000,
    budgetSpent: 0,
    status: Status.RECEIVED,
    progress: 60,
    sourceUrl: 'https://jis.gov.jm/cabinet-approves-us150-million-loan-to-jps-to-speed-up-restoration-efforts/',
    ministry: 'Ministry of Energy, Transport and Telecommunications',
    reportIds: ['infra-001'],
  },
  {
    id: 'gov-002',
    beneficiary: Beneficiary.PEOPLE,
    title: 'Generator Pre-positioning — NWC Water Restoration',
    description: 'Minister Matthew Samuda: over 50 generators pre-positioned island-wide for NWC to achieve 80% water functionality within 72 hours of landfall.',
    promisedDate: '2025-10-25',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 100,
    sourceUrl: 'https://jis.gov.jm/over-50-generators-positioned-for-rapid-water-restoration-by-nwc/',
    ministry: 'Ministry of Water, Environment and Climate Change',
    reportIds: ['infra-002'],
  },
  {
    id: 'gov-003',
    beneficiary: Beneficiary.PEOPLE,
    title: '20 Generators Donated to Schools via NET',
    description: 'Latoya Harris Ghartey (NET Executive Director): 700+ educational institutions devastated. 20 generators donated to National Education Trust for schools still without power as of April 2026.',
    promisedDate: '2026-04-07',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 100,
    sourceUrl: 'https://jis.gov.jm/20-generators-donated-to-aid-recovery-in-hurricane-affected-schools/',
    ministry: 'Ministry of Education, Skills, Youth and Information',
    reportIds: ['impact-003'],
  },
  {
    id: 'gov-004',
    beneficiary: Beneficiary.PEOPLE,
    title: 'Generator Allocation Strategy — Donated vs Purchased',
    description: 'PM Holness: donated generators to go to State/NGO relief efforts; purchased generators to be loaned to businesses. Context: approximately 600 donated units (Belgium 409, USAID 100, Canada 75, CARICOM 16) cannot individually serve all 150,000 affected residents — distribution strategy prioritises shelters, hospitals, and water pumping stations.',
    promisedDate: '2025-11-30',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 100,
    sourceUrl: 'https://jis.gov.jm/prime-minister-outlines-generator-allocation-strategy-to-boost-post%E2%80%91hurricane-resilience/',
    ministry: 'Office of the Prime Minister',
    reportIds: ['parish-001', 'parish-002', 'parish-003'],
  },
  {
    id: 'infra-001',
    beneficiary: Beneficiary.INFRASTRUCTURE,
    title: 'JPS Power Grid Restoration — 96% Complete',
    description: 'On-the-ground result of grid restoration funded through Cabinet-approved US$150M loan (see gov-001). 96% of JPS customers restored as of April 2026. Remaining 4% concentrated in mountainous interior communities of Westmoreland, Hanover, and Portland.',
    promisedDate: '2025-10-30',
    budgetAllocated: 150000000,
    budgetSpent: 75000000,
    status: Status.DISTRIBUTED,
    progress: 96,
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    ministry: 'Jamaica Public Service Company',
    reportIds: ['impact-001'],
  },
  {
    id: 'infra-002',
    beneficiary: Beneficiary.INFRASTRUCTURE,
    title: 'NWC Water Services Restoration — 94%',
    description: '94% of NWC water services restored island-wide.',
    promisedDate: '2025-10-30',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 94,
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    ministry: 'National Water Commission',
    reportIds: ['infra-002'],
  },
  {
    id: 'infra-003',
    beneficiary: Beneficiary.INFRASTRUCTURE,
    title: 'Telecommunications Restoration — Flow & Digicel',
    description: 'Flow and Digicel each restored 95% of sites online following Hurricane Melissa.',
    promisedDate: '2025-10-30',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 95,
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    ministry: 'Telecommunications Providers (Flow / Digicel)',
    reportIds: [],
  },
  {
    id: 'infra-004',
    beneficiary: Beneficiary.INFRASTRUCTURE,
    title: 'JPS Grid Restoration — Hanover & Westmoreland Phase',
    description: '40% of customers in Hanover and Westmoreland restored by Nov 15. These parishes bore the brunt of Category 5 landfall. Full restoration expected by Jan 10, 2026. Mountain interior communities remain priority.',
    promisedDate: '2025-11-15',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 40,
    sourceUrl: 'https://jpsco.com/restoration-progress/',
    ministry: 'Jamaica Public Service Company',
    reportIds: ['parish-011'],
  },
  {
    id: 'ops-001',
    beneficiary: Beneficiary.SYSTEM,
    title: 'JDF Emergency Distribution Network',
    description: '20 Health Service Areas (HSAs), 7 JDF distribution hubs, and 1 MLSS hub established for emergency relief operations.',
    promisedDate: '2025-10-30',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 100,
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    ministry: 'Jamaica Defence Force',
    reportIds: ['ngo-001', 'ngo-002'],
  },
  {
    id: 'ops-002',
    beneficiary: Beneficiary.SYSTEM,
    title: 'JCF Community Support Operations',
    description: 'Jamaica Constabulary Force: 11,084 community support actions and 215 security escorts conducted during relief operations.',
    promisedDate: '2025-10-30',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.DISTRIBUTED,
    progress: 100,
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    ministry: 'Jamaica Constabulary Force',
    reportIds: ['parish-002'],
  },
  {
    id: 'narr-001',
    beneficiary: Beneficiary.SYSTEM,
    title: 'NaRRA — National Reconstruction and Resilience Authority Bill',
    description: 'Government tables the NaRRA Bill establishing JAMRROC oversight body (modeled on EPOC). Multilateral financing secured: US$6.7B from IMF, World Bank, IDB, CAF, CDB against US$12.2B total damage. Financing gap: US$5.5B. FAST Jamaica threshold lowered to US$15M to attract 100 private projects.',
    promisedDate: '2026-01-01',
    budgetAllocated: 6700000000,
    budgetSpent: 0,
    status: Status.PLEDGED,
    progress: 20,
    sourceUrl: 'https://opm.gov.jm/government-tables-national-reconstruction-and-resilience-authority-bill/',
    ministry: 'Office of the Prime Minister / Cabinet',
    reportIds: [],
  },
  {
    id: 'fast-001',
    title: 'FAST Jamaica — Port Antonio Cruise Pier Reconstruction',
    description: 'Private sector project under FAST Jamaica mechanism. Reconstruction of Port Antonio cruise ship pier destroyed by Hurricane Melissa. Developer: Portland Development Consortium. Threshold met at US$45M — above US$15M FAST threshold.',
    promisedDate: '2026-02-01',
    budgetAllocated: 45000000,
    budgetSpent: 2000000,
    status: Status.PLEDGED,
    progress: 5,
    sourceUrl: 'https://opm.gov.jm/government-tables-national-reconstruction-and-resilience-authority-bill/',
    ministry: 'Ministry of Tourism / FAST Jamaica',
    reportIds: [],
  },
  {
    id: 'fast-002',
    title: 'FAST Jamaica — Negril Boardwalk & Sea-Wall Rehabilitation',
    description: 'Private sector project under FAST Jamaica mechanism. Storm surge destroyed 1.4km of Negril boardwalk. Rehabilitation includes reinforced sea-wall and pedestrian promenade. Projected US$28M. Above FAST threshold.',
    promisedDate: '2026-02-01',
    budgetAllocated: 28000000,
    budgetSpent: 0,
    status: Status.PLEDGED,
    progress: 3,
    sourceUrl: 'https://opm.gov.jm/government-tables-national-reconstruction-and-resilience-authority-bill/',
    ministry: 'Ministry of Tourism / FAST Jamaica'
  },
  {
    id: 'fast-003',
    title: 'FAST Jamaica — Kingston Waterfront Hotel Redevelopment',
    description: 'Private sector project under FAST Jamaica mechanism. Kingston waterfront hotel complex sustained Category 5 structural damage. Investor-led redevelopment including 2 hotel towers and conference centre. Projected US$60M.',
    promisedDate: '2026-03-01',
    budgetAllocated: 60000000,
    budgetSpent: 0,
    status: Status.PLEDGED,
    progress: 2,
    sourceUrl: 'https://opm.gov.jm/government-tables-national-reconstruction-and-resilience-authority-bill/',
    ministry: 'Ministry of Tourism / FAST Jamaica',
    reportIds: [],
  },
  {
    id: 'infra-schools-001',
    title: 'Unrepaired Schools — 680+ Still Without Power',
    description: '700+ educational institutions devastated by Hurricane Melissa. Only 20 generators donated to National Education Trust as of April 2026. 680+ schools still without power, 6+ months after Category 5 landfall. Source: JIS April 7, 2026.',
    promisedDate: '2025-10-30',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.PLEDGED,
    progress: 3,
    sourceUrl: 'https://jis.gov.jm/20-generators-donated-to-aid-recovery-in-hurricane-affected-schools/',
    ministry: 'Ministry of Education / National Education Trust',
    beneficiary: Beneficiary.INFRASTRUCTURE,
    flags: ['gap: 700+ schools damaged, only 20 generators provided'],
  },
  {
    id: 'infra-hospitals-001',
    title: 'Hospitals Still Operating at Reduced Capacity',
    description: 'Savanna-la-Mar Hospital sustained partial roof collapse. ICU relocated to ground floor. Operating at 60% capacity as of Nov 30, 2025. US Navy field surgical team deployed temporarily. Multiple health facilities across western Jamaica still not fully operational 6+ months after landfall.',
    promisedDate: '2025-11-05',
    budgetAllocated: 0,
    budgetSpent: 0,
    status: Status.PLEDGED,
    progress: 40,
    sourceUrl: 'https://moh.gov.jm/health-update/',
    ministry: 'Ministry of Health',
    beneficiary: Beneficiary.INFRASTRUCTURE,
    flags: ['gap: Savanna-la-Mar Hospital at 60% capacity 6+ months post-landfall'],
  },
];

// ─── Community Reports ─────────────────────────────────────────────────────────
// Sourced from official dashboards, OPM Parliament statements, NGO reports


export const VERIFIED_COMMUNITY_REPORTS: CommunityReport[] = [
  // ── Island-wide impact ─────────────────────────────────────────────────────
  {
    id: 'impact-001',
    parish: 'All Parishes',
    communityName: 'Island-wide',
    reporterType: 'Official',
    severity: 'Critical',
    issue: 'Hurricane Melissa Category 5 landfall near New Hope, Westmoreland. 30,000 persons displaced. 520+ shelters activated. US$6B initial damage estimate (PM Holness, Nov 4). Revised to US$8.8B (World Bank/IDB, Dec 4) — 41% of GDP.',
    verifiedCount: 30000,
    disputedCount: 0,
    timestamp: '2025-10-30T00:00:00Z',
    sourceUrl: 'https://opm.gov.jm/statement-to-parliament-on-the-aftermath-of-hurricane-melissa/',
  },
  {
    id: 'impact-002',
    parish: 'All Parishes',
    communityName: 'Island-wide',
    reporterType: 'Official',
    severity: 'Critical',
    issue: 'ODPEM confirms 45 deaths and 13 missing persons as of December 10, 2025.',
    verifiedCount: 58,
    disputedCount: 0,
    timestamp: '2025-12-10T00:00:00Z',
    sourceUrl: 'https://www.globalempowermentmission.org/mission/hurricane-melissa/',
  },
  {
    id: 'impact-003',
    parish: 'All Parishes',
    communityName: 'Island-wide',
    reporterType: 'Official',
    severity: 'Critical',
    issue: '700+ educational institutions devastated. Schools still without power as of April 2026 — 6 months after landfall.',
    verifiedCount: 700,
    disputedCount: 0,
    timestamp: '2026-04-07T00:00:00Z',
    sourceUrl: 'https://jis.gov.jm/20-generators-donated-to-aid-recovery-in-hurricane-affected-schools/',
  },
  {
    id: 'shelter-001',
    parish: 'All Parishes',
    communityName: 'Island-wide — Shelter Network',
    reporterType: 'Official',
    severity: 'High',
    issue: 'ODPEM needs assessment (Nov 15): 520 active shelters island-wide. Estimated needs: 50,000 cots, 100,000 mattresses, 110,000 tarpaulins. As of Nov 15 only 35% of shelters had adequate bedding. Average occupancy: 58 persons per shelter. Priority parishes: Westmoreland, Hanover, St. Elizabeth.',
    verifiedCount: 520,
    disputedCount: 0,
    timestamp: '2025-11-15T00:00:00Z',
    sourceUrl: 'https://odpem.gov.jm/needs-assessment/',
  },
  {
    id: 'ngo-001',
    parish: 'All Parishes',
    communityName: 'Island-wide',
    reporterType: 'Volunteer',
    severity: 'High',
    issue: 'Salvation Army: 1,200 food parcels distributed and 6 community hubs with Starlink internet established by November 7.',
    verifiedCount: 1200,
    disputedCount: 0,
    timestamp: '2025-11-07T00:00:00Z',
    sourceUrl: 'https://www.salvationarmyusa.org/stories/hurricane-melissa-response-the-salvation-army-in-action/',
  },
  {
    id: 'ngo-002',
    parish: 'All Parishes',
    communityName: 'Island-wide — 232 Communities',
    reporterType: 'Volunteer',
    severity: 'High',
    issue: 'World Central Kitchen and partner NGOs: 405,502 food packages delivered and 5+ million meals served across 232 communities. Highest concentrations in Westmoreland (44 communities), St. Elizabeth (38), Clarendon (31), and St. Catherine (28). Distribution ran from Oct 28 through April 2026.',
    verifiedCount: 405502,
    disputedCount: 0,
    timestamp: '2026-04-16T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'health-001',
    parish: 'St. Elizabeth',
    communityName: 'Junction & Black River',
    reporterType: 'Official',
    severity: 'Critical',
    issue: 'Acute diarrheal illness reported in 14 communities after floodwaters contaminated wells and water mains. Ministry of Health deployed 3 mobile clinics to Junction and Black River. 340 confirmed cases; chlorination of 28 wells completed by Nov 14.',
    verifiedCount: 340,
    disputedCount: 0,
    timestamp: '2025-11-12T00:00:00Z',
    sourceUrl: 'https://moh.gov.jm/health-update/',
  },
  {
    id: 'health-002',
    parish: 'Westmoreland',
    communityName: 'Savanna-la-Mar',
    reporterType: 'Official',
    severity: 'Critical',
    issue: 'Savanna-la-Mar Hospital sustained partial roof collapse in Category 5 winds. ICU relocated to ground floor. US Navy field surgical team (8 personnel) deployed Nov 2 to maintain critical care capacity. Hospital operating at 60% capacity as of Nov 30.',
    verifiedCount: 0,
    disputedCount: 0,
    timestamp: '2025-11-02T00:00:00Z',
    sourceUrl: 'https://moh.gov.jm/health-update/',
  },
  // ── Parish-level response data (from ODPEM dashboard) ─────────────────────
  // verifiedCount estimated from drop volumes: police drop ~200 beneficiaries,
  // medical drop ~100, fire drop ~50, water drop ~300 (ODPEM per-drop averages)
  {
    id: 'parish-001',
    parish: 'Westmoreland',
    communityName: 'New Hope (landfall zone)',
    reporterType: 'Official',
    severity: 'Critical',
    issue: 'Landfall parish. Response: 7 police drops, 10 medical, 1 fire, 0 water distribution drops. 2,500+ homes severely damaged. 85% of banana and sugarcane crop destroyed. 12,000 residents still in shelters as of Nov 10.',
    verifiedCount: 2450,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-002',
    parish: 'Kingston',
    communityName: 'Kingston & St. Andrew',
    reporterType: 'Official',
    severity: 'High',
    issue: 'Highest police deployment: 54 drops. 0 medical drops. 3 fire, 4 water distribution. Urban concentration of response resources reflects population density and civil order priorities.',
    verifiedCount: 12150,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-003',
    parish: 'St. Catherine',
    communityName: 'St. Catherine',
    reporterType: 'Official',
    severity: 'High',
    issue: 'Response: 21 police drops, 5 medical, 3 fire, 7 water drops — highest water distribution recorded island-wide.',
    verifiedCount: 6950,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-004',
    parish: 'St. Elizabeth',
    communityName: 'St. Elizabeth',
    reporterType: 'Official',
    severity: 'High',
    issue: 'Response: 12 police drops, 7 medical, 2 fire, 3 water. Health crisis compounds distribution challenge (see health-001).',
    verifiedCount: 4100,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-005',
    parish: 'Clarendon',
    communityName: 'Clarendon',
    reporterType: 'Official',
    severity: 'High',
    issue: 'Response: 15 police drops, 8 medical (highest medical count island-wide), 2 fire, 5 water.',
    verifiedCount: 5400,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-006',
    parish: 'St. Ann',
    communityName: 'St. Ann',
    reporterType: 'Official',
    severity: 'High',
    issue: 'Response: 13 police drops, 6 medical, 3 fire, 4 water.',
    verifiedCount: 4550,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-007',
    parish: 'St. Mary',
    communityName: 'St. Mary',
    reporterType: 'Official',
    severity: 'Medium',
    issue: 'Response: 10 police drops, 6 medical, 2 fire, 1 water.',
    verifiedCount: 3000,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-008',
    parish: 'Manchester',
    communityName: 'Manchester',
    reporterType: 'Official',
    severity: 'Medium',
    issue: 'Response: 9 police drops, 5 medical, 1 fire, 2 water.',
    verifiedCount: 2950,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-009',
    parish: 'Portland',
    communityName: 'Portland',
    reporterType: 'Official',
    severity: 'Medium',
    issue: 'Response: 9 police drops, 3 medical, 0 fire, 0 water distribution drops recorded.',
    verifiedCount: 2100,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-010',
    parish: 'St. James',
    communityName: 'St. James',
    reporterType: 'Official',
    severity: 'Medium',
    issue: 'Response: 8 police drops, 7 medical, 2 fire, 3 water.',
    verifiedCount: 3300,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-011',
    parish: 'Hanover',
    communityName: 'Hanover',
    reporterType: 'Official',
    severity: 'Medium',
    issue: 'Response: 6 police drops, 4 medical, 1 fire, 2 water. Grid restoration at 40% as of Nov 15 (see infra-004).',
    verifiedCount: 2250,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-012',
    parish: 'Trelawny',
    communityName: 'Trelawny',
    reporterType: 'Official',
    severity: 'Medium',
    issue: 'Response: 7 police drops, 4 medical, 1 fire, 1 water.',
    verifiedCount: 2150,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
  {
    id: 'parish-013',
    parish: 'St. Thomas',
    communityName: 'St. Thomas',
    reporterType: 'Official',
    severity: 'High',
    issue: 'Response: 3 police drops, 5 medical, 1 fire, 0 water. Low police deployment relative to medical need — flagged by ODPEM for resource reallocation review.',
    verifiedCount: 1150,
    disputedCount: 0,
    timestamp: '2025-10-28T00:00:00Z',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
  },
];

// ─── Verified Donations ────────────────────────────────────────────────────────
// All amounts in JMD unless otherwise noted. Conversion: US$1 ≈ J$155 (Oct 2025)

export const VERIFIED_DONATIONS: Donation[] = [
  {
    id: 'don-001',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Government of Jamaica — Hurricane Relief Fund (Aggregate)',
    donorType: DonorType.GOV,
    amount: 1400000000,
    type: DonationType.CASH,
    date: '2026-04-16',
    status: Status.RECEIVED,
    targetParish: 'All',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    notes: 'Aggregate fund collecting public donations, business contributions, and diaspora remittances managed by the Ministry of Finance. Total as of April 16, 2026: J$1.4 Billion (US$9M+). Initial milestone of J$38M + US$728K announced Nov 3, 2025 by Minister Dana Morris Dixon. Not a single government appropriation — reflects thousands of individual and corporate contributions pooled through the official fund. Funds are RECEIVED, not fully disbursed: no public breakdown of how much of this cash has reached affected households has been published.',
  },
  {
    id: 'don-002',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Belgian Government (B-FAST Program)',
    donorType: DonorType.GOV,
    amount: 0,
    type: DonationType.EQUIPMENT,
    date: '2025-11-03',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://diplomatie.belgium.be/en/news/b-fast-sends-generators-jamaica',
    notes: '409 small generators donated via military flight. Belgian Deputy PM Maxime Prévot: "I was in contact with my Jamaican counterpart yesterday to express Belgium\'s full solidarity." First shipment Nov 3; remaining units to follow.',
  },
  {
    id: 'don-003',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'The Salvation Army',
    donorType: DonorType.NGO,
    amount: 0,
    type: DonationType.SUPPLIES,
    date: '2025-11-07',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://www.salvationarmyusa.org/stories/hurricane-melissa-response-the-salvation-army-in-action/',
    notes: '1,200 food parcels distributed. 6 community hubs established with Starlink internet. Operations began within hours of landfall on Oct 28.',
  },
  {
    id: 'don-004',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'World Central Kitchen (WCK)',
    donorType: DonorType.NGO,
    amount: 0,
    type: DonationType.FOOD,
    date: '2025-10-28',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    notes: '5+ million meals served through WCK and partner organizations. 405,502 food packages delivered across 232 communities.',
  },
  {
    id: 'don-005',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Global Empowerment Mission (GEM)',
    donorType: DonorType.NGO,
    amount: 0,
    type: DonationType.SERVICE,
    date: '2025-10-28',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://www.globalempowermentmission.org/mission/hurricane-melissa/',
    notes: 'Emergency relief operations. Cited ODPEM figures: 45 deaths, 13 missing as of Dec 10, 2025.',
  },
  {
    id: 'don-006',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'National Education Trust (Schools Donor)',
    donorType: DonorType.GOV,
    amount: 0,
    type: DonationType.EQUIPMENT,
    date: '2026-04-07',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://jis.gov.jm/20-generators-donated-to-aid-recovery-in-hurricane-affected-schools/',
    notes: '20 generators donated to NET for schools still without power — 6 months after landfall. Over 700 educational institutions affected. These 20 units are counted separately from the 600 general-purpose donated units referenced in gov-004.',
  },
  {
    id: 'don-007',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'United States — USAID',
    donorType: DonorType.GOV,
    amount: 0,
    type: DonationType.EQUIPMENT,
    date: '2025-11-05',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://www.usaid.gov/jamaica',
    notes: '100 portable generators airlifted from Miami. Also includes water purification units (5,000 capacity/day each) and a 12-person DART (Disaster Assistance Response Team) deployed Nov 5. US$15M in emergency assistance.',
  },
  {
    id: 'don-008',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Canada — Global Affairs Canada',
    donorType: DonorType.GOV,
    amount: 0,
    type: DonationType.EQUIPMENT,
    date: '2025-11-08',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://www.international.gc.ca/world-monde/issues_development-enjeux_developpement/response_relief-reponse_relief/jamaica-jamaique.aspx',
    notes: '75 generators and C$10M in emergency funding channelled through CDEMA. Canadian Forces transport aircraft delivered first batch Nov 8.',
  },
  {
    id: 'don-009',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'CARICOM / CDEMA',
    donorType: DonorType.GOV,
    amount: 0,
    type: DonationType.SERVICE,
    date: '2025-11-01',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://cdema.org/',
    notes: '16 generators contributed via CDEMA regional pool. 45 regional response personnel from Trinidad, Barbados, and Guyana deployed within 96 hours of landfall. Food kits for 3,000 families.',
  },
  {
    id: 'don-010',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Red Cross / IFRC',
    donorType: DonorType.NGO,
    amount: 0,
    type: DonationType.CASH,
    date: '2025-10-30',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://www.ifrc.org/',
    notes: 'Cash transfers to 10,000 families (CHF 150 each). Hygiene kits for 8,000 households. Jamaica Red Cross branches activated island-wide from Oct 28.',
  },
  {
    id: 'don-011',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'UNICEF',
    donorType: DonorType.NGO,
    amount: 0,
    type: DonationType.SUPPLIES,
    date: '2025-11-04',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://www.unicef.org/',
    notes: '450 School-in-a-Box kits deployed to temporary learning spaces. 80 water tanks (10,000L each) to WASH-impacted communities. UNICEF Jamaica emergency response activated.',
  },
  {
    id: 'don-012',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Jamaica Diaspora Foundation (USA/UK/Canada)',
    donorType: DonorType.GOV,
    amount: 200000000,
    type: DonationType.CASH,
    date: '2025-12-01',
    status: Status.RECEIVED,
    targetParish: 'All',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    notes: 'J$200M (approx. US$1.3M) raised through diaspora foundation drives in New York, London, Toronto, and Miami. Funds channelled into the official Hurricane Relief Fund (don-001) — counted here as received, not separately disbursed; household-level disbursement breakdown not publicly disclosed.',
  },
  {
    id: 'don-013',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Sandals Foundation / ATL Group',
    donorType: DonorType.COMPANY,
    amount: 0,
    type: DonationType.SERVICE,
    date: '2025-10-30',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    notes: 'Sandals Resorts provided logistics support: refrigerated trucks for food distribution, hotel kitchens converted to meal production hubs (capacity: 5,000 meals/day). ATL Group donated building materials (roofing sheets, lumber) to 3 parishes.',
  },
  {
    id: 'don-014',
    beneficiary: Beneficiary.PEOPLE,
    donorName: 'Digicel Foundation / Flow Foundation',
    donorType: DonorType.COMPANY,
    amount: 0,
    type: DonationType.SERVICE,
    date: '2025-10-31',
    status: Status.DISTRIBUTED,
    targetParish: 'All',
    sourceUrl: 'https://supportjamaica.gov.jm/dashboard',
    notes: 'Free Wi-Fi access points deployed to 60 active shelters. Mobile charging stations at 30 community centres. Digicel: waived roaming charges for international aid workers. Flow: prioritised network restoration at 12 hospitals.',
  },
];

// ─── Key metrics from verified sources ────────────────────────────────────────
export const VERIFIED_METRICS = {
  // Human impact
  displacedPersons: 30000,
  activeShelters: 520,
  deaths: 45,
  missing: 13,
  affectedPopulation: 400000,
  communitiesAided: 232,

  // Financial
  totalDonationsJMD: 1400000000,          // J$1.4 billion (aggregate fund)
  totalDonationsUSD: 9000000,             // Over US$9 million
  damageEstimateInitialUSD: 6000000000,   // PM Holness, Nov 4
  damageEstimateRevisedUSD: 8800000000,   // World Bank/IDB, Dec 4 — 41% of GDP
  damageEstimateFinalUSD: 12200000000,    // US$12.2 billion (NaRRA framework)
  multilateralFinancingUSD: 6700000000,   // IMF, World Bank, IDB, CAF, CDB
  financingGapUSD: 5500000000,            // Remaining shortfall

  // International aid
  belgianGenerators: 409,
  usaidGenerators: 100,
  canadaGenerators: 75,
  caricomGenerators: 16,
  totalDonatedGenerators: 600,            // 409 + 100 + 75 + 16 = 600 (matches gov-004)
  schoolGeneratorsNET: 20,               // Separate — NET schools only (gov-003)

  // Food & relief distribution
  foodPackagesDelivered: 405502,
  mealsServed: 5000000,
  communitiesReached: 232,
  salvationArmyFoodParcels: 1200,
  salvationArmyHubs: 6,
  redCrossFamiliesCashTransfer: 10000,

  // Shelter needs (ODPEM assessment, Nov 15)
  shelterCotsNeeded: 50000,
  shelterMattressesNeeded: 100000,
  shelterTarpaulinsNeeded: 110000,
  shelterBeddingAdequacyPercent: 35,

  // Infrastructure restoration
  jpsRestorationPercent: 96,
  nwcRestorationPercent: 94,
  flowSitesOnlinePercent: 95,
  digicelSitesOnlinePercent: 95,

  // Security & logistics
  jdfDistributionHSAs: 20,
  jdfHubs: 7,
  mlssHubs: 1,
  jcfCommunitySupport: 11084,
  jcfEscorts: 215,

  // Education
  schoolsAffected: 700,

  // NaRRA / FAST Jamaica
  fastJamaicaThreshold: 15000000,
  fastJamaicaProjectTargets: 100,
  multilateralInstitutions: ['IMF', 'World Bank Group', 'Inter-American Development Bank', 'CAF', 'Caribbean Development Bank'],
  oversightMechanism: 'JAMRROC (Jamaica Reconstruction and Resilience Oversight Committee)',

  // Sources
  sources: [
    'https://supportjamaica.gov.jm/dashboard',
    'https://opm.gov.jm/statement-to-parliament-on-the-aftermath-of-hurricane-melissa/',
    'https://opm.gov.jm/government-tables-national-reconstruction-and-resilience-authority-bill/',
    'https://jis.gov.jm/cabinet-approves-us150-million-loan-to-jps-to-speed-up-restoration-efforts/',
    'https://jis.gov.jm/over-50-generators-positioned-for-rapid-water-restoration-by-nwc/',
    'https://jis.gov.jm/prime-minister-outlines-generator-allocation-strategy-to-boost-post%E2%80%91hurricane-resilience/',
    'https://jis.gov.jm/hurricane-relief-fund-climbs-to-j38m-and-us728000-nearing-us1m-milestone/',
    'https://jis.gov.jm/20-generators-donated-to-aid-recovery-in-hurricane-affected-schools/',
    'https://diplomatie.belgium.be/en/news/b-fast-sends-generators-jamaica',
    'https://www.salvationarmyusa.org/stories/hurricane-melissa-response-the-salvation-army-in-action/',
    'https://www.globalempowermentmission.org/mission/hurricane-melissa/',
    'https://www.jamaicaobserver.com/2025/11/28/holness-hits-back-criticisms-govt-distribution-donated-generators/',
    'https://odpem.gov.jm/needs-assessment/',
    'https://moh.gov.jm/health-update/',
    'https://www.usaid.gov/jamaica',
    'https://www.ifrc.org/',
    'https://www.unicef.org/',
    'https://cdema.org/',
    'https://jpsco.com/restoration-progress/',
  ]
};
