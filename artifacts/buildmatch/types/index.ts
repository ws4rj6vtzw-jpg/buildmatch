export type Role = "builder" | "worker";

export type Worker = {
  id: string;
  name: string;
  photo: string;
  primaryTrade: string;
  skills: string[];
  yearsExperience: number;
  availableNow: boolean;
  availableFrom?: string;
  suburb: string;
  postcode: string;
  distanceKm: number;
  rating: number;
  completedJobs: number;
  bio: string;
  tickets: string[];
  hourlyRate: number;
  publicLiabilityInsured?: boolean;
  insurerName?: string;
};

export type Builder = {
  id: string;
  name: string;
  contactName: string;
  photo: string;
  suburb: string;
  postcode: string;
  rating: number;
  completedJobs: number;
  bio: string;
  tradesNeeded: string[];
};

export type Job = {
  id: string;
  builderId: string;
  title: string;
  trade: string;
  suburb: string;
  postcode: string;
  startDate: string;
  durationDays: number;
  payRate: number;
  payType: "hour" | "day";
  requiredTickets: string[];
  description: string;
  createdAt: number;
  applicants: string[]; // worker ids
};

export type Swipe = {
  fromId: string;
  toId: string;
  direction: "right" | "left";
  ts: number;
};

export type Match = {
  id: string;
  builderId: string;
  workerId: string;
  jobId?: string; // if from a job acceptance
  createdAt: number;
};

export type Message = {
  id: string;
  matchId: string;
  fromId: string;
  text: string;
  ts: number;
};

export type Rating = {
  id: string;
  jobId: string;
  fromId: string;
  toId: string;
  stars: number;
  comment?: string;
  ts: number;
};

export type CompletedSnap = {
  jobId: string;
  builderId: string;
  workerId: string;
  title: string;
  trade: string;
  payRate: number;
  payType: "hour" | "day";
  durationDays: number;
  completedAt: number;
};

export type UploadedDocument = {
  id: string;
  category: string;   // e.g. "CSCS Card", "Public Liability Insurance"
  section: "ticket" | "insurance";
  uri: string;        // local image URI
  uploadedAt: number;
  verified: false;    // always false in MVP — backend review pending
};

export type AuthUser = {
  id: string;
  phone: string;
  role: Role;
  // Builder profile fields
  companyName?: string;
  contactName?: string;
  // Worker profile fields
  fullName?: string;
  photo?: string;
  primaryTrade?: string;
  skills?: string[];
  yearsExperience?: number;
  availableNow?: boolean;
  availableFrom?: string;
  suburb?: string;
  postcode?: string;
  travelRadiusKm?: number;
  bio?: string;
  tickets?: string[];
  hourlyRate?: number;
  rating?: number;
  completedJobs?: number;
  profileComplete?: boolean;
  publicLiabilityInsured?: boolean;
  insurerName?: string;
  isPro?: boolean;
  documents?: UploadedDocument[];
};
