import { Donation, DonationType, Status, CommunityReport, GovPromise, KPIMetrics, DonorType } from "../types";

export const MOCK_KPIS: KPIMetrics = {
  totalCashReceived: 12500000,
  totalValueKind: 4500000,
  totalDisbursed: 6800000,
  familiesHelped: 3420,
  activeAgencies: 14,
  criticalZones: 5
};

export const MOCK_DONATIONS: Donation[] = [
  { id: 'd1', donorId: 'u1', donorName: 'Global Aid Foundation', amount: 5000000, type: DonationType.CASH, date: '2023-10-25', status: Status.RECEIVED, targetParish: 'All' },
  { id: 'd2', donorId: 'u2', donorName: 'Diaspora Group UK', amount: 150000, type: DonationType.SUPPLIES, date: '2023-10-26', status: Status.DISTRIBUTED, targetParish: 'St. Thomas' },
  { id: 'd3', donorId: 'u3', donorName: 'Massy Distributions', amount: 300000, type: DonationType.FOOD, date: '2023-10-27', status: Status.DELAYED, targetParish: 'Portland' },
  { id: 'd4', donorId: 'u4', donorName: 'Local Artist Collective', amount: 50000, type: DonationType.CASH, date: '2023-10-28', status: Status.VERIFIED, targetParish: 'Kingston' },
  { id: 'd5', donorId: 'u5', donorName: 'US Embassy', amount: 2000000, type: DonationType.EQUIPMENT, date: '2023-10-29', status: Status.PLEDGED, targetParish: 'St. Mary' },
];

export const MOCK_REPORTS: CommunityReport[] = [
  { id: 'r1', parish: 'St. Thomas', communityName: 'Yallahs', reporterType: 'Resident', severity: 'Critical', issue: 'Bridge collapsed, food supplies cut off for 3 days.', verifiedCount: 45, disputedCount: 2, timestamp: '2h ago' },
  { id: 'r2', parish: 'Portland', communityName: 'Port Antonio', reporterType: 'Volunteer', severity: 'High', issue: 'Shelter at capacity, need clean water immediately.', verifiedCount: 28, disputedCount: 0, timestamp: '5h ago' },
  { id: 'r3', parish: 'Kingston', communityName: 'Tivoli Gardens', reporterType: 'Official', severity: 'Medium', issue: 'Power restored, but debris blocking main access road.', verifiedCount: 12, disputedCount: 5, timestamp: '8h ago' },
  { id: 'r4', parish: 'St. Elizabeth', communityName: 'Black River', reporterType: 'Resident', severity: 'Low', issue: 'Minor flooding in market area.', verifiedCount: 5, disputedCount: 1, timestamp: '12h ago' },
];

export const MOCK_PROMISES: GovPromise[] = [
  { id: 'p1', title: 'Road Clearing - Eastern Parishes', description: 'Clear main highways in St. Thomas and Portland.', promisedDate: '2023-10-30', budgetAllocated: 5000000, budgetSpent: 1200000, status: Status.DELAYED, progress: 25 },
  { id: 'p2', title: 'Emergency Water Distribution', description: 'Deploy 50 water trucks to affected zones.', promisedDate: '2023-10-28', budgetAllocated: 2000000, budgetSpent: 1800000, status: Status.DISTRIBUTED, progress: 90 },
  { id: 'p3', title: 'Shelter Repair Grants', description: 'Immediate $50k grants for damaged roofs.', promisedDate: '2023-11-05', budgetAllocated: 10000000, budgetSpent: 0, status: Status.PLEDGED, progress: 0 },
];

export const PARISHES = [
  "Hanover", "St. Elizabeth", "St. James", "Trelawny", "Westmoreland",
  "Clarendon", "Manchester", "St. Ann", "St. Catherine", "St. Mary",
  "Kingston", "Portland", "St. Andrew", "St. Thomas"
];
