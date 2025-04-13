
// User types
export type UserRole = "generator" | "purchaser" | "sldc";

export interface User {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
  state: string;
  createdAt: Date;
}

export interface GeneratorDetails {
  resourceTypes: string[];
}

export interface PurchaserDetails {
  demandProfile: "industrial" | "residential" | "mixed";
  purchasePriority: "cost" | "sustainability" | "balanced";
}

// Organization types
export interface Organization {
  orgId: string;
  name: string;
  type: "generator" | "purchaser";
  state: string;
}

// Schedule types
export interface Schedule {
  scheduleId: string;
  orgId: string;
  state: string;
  date: Date;
  data: any; // JSON data
  resourceType: string;
  status: "draft" | "sent" | "received";
  filePath: string;
  createdAt: Date;
}

// Report types
export interface Report {
  reportId: string;
  orgId: string;
  state: string;
  date: Date;
  data: any; // JSON data
  status: "draft" | "submitted" | "verified" | "corrected";
  filePath: string;
  createdAt: Date;
  verifications?: ReportVerification[];
}

export interface ReportVerification {
  sldcUserId: string;
  status: "verified" | "corrected";
  comments: string;
  suggestions: Supplier[];
  verifiedAt: Date;
}

// Prediction types
export interface Prediction {
  predictionId: string;
  orgId: string;
  date: Date;
  data: PredictionData;
  carbonEstimate: number;
  createdAt: Date;
}

export interface PredictionData {
  hourlyMW: { timestamp: string; value: number }[];
  feature_impacts: Record<string, number>;
}

// Purchase types
export interface Purchase {
  purchaseId: string;
  orgId: string;
  supplier: string;
  resourceType: string;
  volumeMW: number;
  cost: number;
  carbonEstimate: number;
  location: {
    lat: number;
    lon: number;
  };
  date: Date;
}

export interface Supplier {
  name: string;
  cost: number;
  carbon: number;
  resourceType: string;
  location?: {
    lat: number;
    lon: number;
  };
}

// API response types
export interface AutoPredictResponse {
  timestamp: string;
  predicted_load: number;
  feature_impacts: Record<string, number>;
}

export interface ForecastRangeRequest {
  start_date: string;
  end_date: string;
  frequency: "5min" | "hourly" | "daily";
}

export interface ForecastRangeResponse {
  data: {
    timestamp: string;
    predicted_load: number;
    feature_impacts: Record<string, number>;
  }[];
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Dashboard data types
export interface DashboardStats {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
}

// Form types
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}
