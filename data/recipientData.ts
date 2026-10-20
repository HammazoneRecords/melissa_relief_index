import { Donation } from '../types';
import { VERIFIED_DONATIONS } from './verifiedData';

// ─── Per-Contribution Recipient Attribution ───────────────────────────────────
// Rules enforced here:
//  1. A recipient is named ONLY if the entry's source document explicitly names
//     who received the contribution. Otherwise: 'recipient not publicly identified'.
//  2. Distribution status is 'recipient-confirmed-distributed' ONLY where the
//     source explicitly documents delivery to communities/people. Handing a
//     consignment to an agency is at most 'received-by-recipient'. Anything
//     less is 'no-public-evidence'.
//  3. Nothing here may imply community delivery that the source does not state.

export type RecipientKind =
  | 'government-agency'
  | 'private-charity'
  | 'multilateral-organisation'
  | 'not-publicly-identified';

export type DistributionEvidence =
  | 'recipient-confirmed-distributed'  // source explicitly documents delivery to communities/people
  | 'received-by-recipient'            // source documents receipt by a named recipient only
  | 'no-public-evidence';              // source documents neither receipt nor distribution

export interface RecipientAttribution {
  donationId: string;
  recipientName: string;
  recipientKind: RecipientKind;
  distributionEvidence: DistributionEvidence;
  /** Exact basis in the source document for the recipient + evidence values. */
  evidenceBasis: string;
}

export const RECIPIENT_ATTRIBUTIONS: Record<string, RecipientAttribution> = {
  'don-001': {
    donationId: 'don-001',
    recipientName: 'Hurricane Relief Fund (Government of Jamaica, Ministry of Finance-managed)',
    recipientKind: 'government-agency',
    distributionEvidence: 'no-public-evidence',
    evidenceBasis: 'Source documents collection into the official fund; notes state funds are RECEIVED, not fully disbursed, and no public per-household disbursement breakdown has been published.',
  },
  'don-002': {
    donationId: 'don-002',
    recipientName: 'recipient not publicly identified (consignment flown to Jamaica)',
    recipientKind: 'not-publicly-identified',
    distributionEvidence: 'no-public-evidence',
    evidenceBasis: 'Belgian source confirms dispatch of 409 generators by military flight; it does not name the receiving Jamaican agency or document community-level distribution.',
  },
  'don-003': {
    donationId: 'don-003',
    recipientName: 'Affected communities served directly by The Salvation Army (private charity)',
    recipientKind: 'private-charity',
    distributionEvidence: 'recipient-confirmed-distributed',
    evidenceBasis: 'Salvation Army source explicitly documents 1,200 food parcels distributed and 6 community hubs with Starlink internet established by Nov 7, 2025.',
  },
  'don-004': {
    donationId: 'don-004',
    recipientName: 'Affected communities served directly by World Central Kitchen and partner NGOs (private charity)',
    recipientKind: 'private-charity',
    distributionEvidence: 'recipient-confirmed-distributed',
    evidenceBasis: 'Support Jamaica dashboard explicitly documents 405,502 food packages delivered and 5+ million meals served across 232 named-parish concentrations.',
  },
  'don-005': {
    donationId: 'don-005',
    recipientName: 'recipient not publicly identified',
    recipientKind: 'not-publicly-identified',
    distributionEvidence: 'no-public-evidence',
    evidenceBasis: 'GEM source page describes emergency relief operations and cites ODPEM figures, but does not document specific quantities delivered to named communities.',
  },
  'don-006': {
    donationId: 'don-006',
    recipientName: 'National Education Trust (NET) — government education trust',
    recipientKind: 'government-agency',
    distributionEvidence: 'received-by-recipient',
    evidenceBasis: 'JIS source explicitly states 20 generators were donated TO the National Education Trust for schools; onward placement in individual schools is not itemised in the source.',
  },
  'don-007': {
    donationId: 'don-007',
    recipientName: 'recipient not publicly identified (airlifted to Jamaica)',
    recipientKind: 'not-publicly-identified',
    distributionEvidence: 'no-public-evidence',
    evidenceBasis: 'USAID source documents the airlift of 100 generators, water purification units and DART deployment; it does not name the receiving agency or document community-level distribution.',
  },
  'don-008': {
    donationId: 'don-008',
    recipientName: 'CDEMA regional response mechanism',
    recipientKind: 'multilateral-organisation',
    distributionEvidence: 'received-by-recipient',
    evidenceBasis: 'Global Affairs Canada source states C$10M and 75 generators were channelled through CDEMA; community-level delivery of individual units is not documented in the source.',
  },
  'don-009': {
    donationId: 'don-009',
    recipientName: 'CDEMA regional response mechanism',
    recipientKind: 'multilateral-organisation',
    distributionEvidence: 'received-by-recipient',
    evidenceBasis: 'CDEMA source documents 16 generators into the regional pool, 45 response personnel deployed, and food kits stated for 3,000 families; per-family delivery is not itemised in the source.',
  },
  'don-010': {
    donationId: 'don-010',
    recipientName: 'Affected families served via IFRC / Jamaica Red Cross (private charity)',
    recipientKind: 'private-charity',
    distributionEvidence: 'recipient-confirmed-distributed',
    evidenceBasis: 'IFRC source explicitly documents cash transfers to 10,000 families (CHF 150 each) and hygiene kits for 8,000 households, with Jamaica Red Cross branches activated.',
  },
  'don-011': {
    donationId: 'don-011',
    recipientName: 'Temporary learning spaces and WASH-impacted communities served via UNICEF',
    recipientKind: 'multilateral-organisation',
    distributionEvidence: 'recipient-confirmed-distributed',
    evidenceBasis: 'UNICEF source explicitly documents 450 School-in-a-Box kits deployed to temporary learning spaces and 80 water tanks (10,000L) to WASH-impacted communities.',
  },
  'don-012': {
    donationId: 'don-012',
    recipientName: 'Hurricane Relief Fund (Government of Jamaica, Ministry of Finance-managed)',
    recipientKind: 'government-agency',
    distributionEvidence: 'received-by-recipient',
    evidenceBasis: 'Notes state diaspora funds were channelled into the official Hurricane Relief Fund (don-001) and are counted as received, not separately disbursed; household-level breakdown not publicly disclosed.',
  },
  'don-013': {
    donationId: 'don-013',
    recipientName: 'Food-distribution partners and affected communities in 3 parishes (parishes not named in source); Sandals Foundation / ATL Group are private-sector donors',
    recipientKind: 'private-charity',
    distributionEvidence: 'recipient-confirmed-distributed',
    evidenceBasis: 'Support Jamaica dashboard explicitly documents refrigerated trucks deployed for food distribution, hotel kitchens converted to meal-production hubs, and ATL building materials donated to 3 parishes.',
  },
  'don-014': {
    donationId: 'don-014',
    recipientName: '60 active shelters and 30 community centres (operating agencies not named in source); Digicel Foundation / Flow Foundation are private-sector donors',
    recipientKind: 'not-publicly-identified',
    distributionEvidence: 'recipient-confirmed-distributed',
    evidenceBasis: 'Support Jamaica dashboard explicitly documents free Wi-Fi access points deployed to 60 active shelters and mobile charging stations at 30 community centres.',
  },
};

export function getAttribution(donation: Donation): RecipientAttribution {
  const a = RECIPIENT_ATTRIBUTIONS[donation.id];
  if (a) return a;
  // Unknown IDs (e.g. user-added records): no attribution exists — say so.
  return {
    donationId: donation.id,
    recipientName: 'recipient not publicly identified',
    recipientKind: 'not-publicly-identified',
    distributionEvidence: 'no-public-evidence',
    evidenceBasis: 'No recipient attribution exists in the verified source documents for this record.',
  };
}

/** Count of entries whose source explicitly documents distribution to communities. */
export function countEvidencedDistributions(): number {
  return VERIFIED_DONATIONS.filter(
    d => RECIPIENT_ATTRIBUTIONS[d.id]?.distributionEvidence === 'recipient-confirmed-distributed'
  ).length;
}
