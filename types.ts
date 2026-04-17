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

export interface Donation {
  id: string;
  donorName: string;
  donorType: DonorType;
  amount: number;
  type: DonationType;
  date: string;
  status: Status;
  targetParish: string;
  sourceUrl: string;       // required — the receipt/proof link
  notes?: string;
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
  sourceUrl: string;       // link to article, social post, or official statement
}

export interface GovPromise {
  id: string;
  title: string;
  description: string;
  promisedDate: string;
  budgetAllocated: number;
  budgetSpent: number;
  status: Status;
  progress: number;        // 0-100
  sourceUrl: string;       // link to press release, JIS article, or official doc
  ministry?: string;
}

export interface KPIMetrics {
  totalCashReceived: number;
  totalValueKind: number;
  totalDisbursed: number;
  familiesHelped: number;
  activeAgencies: number;
  criticalZones: number;
}
