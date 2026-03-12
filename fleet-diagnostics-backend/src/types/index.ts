// ENUMS

export enum EventLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
}

// CORE DOMAIN MODEL

export interface DiagnosticEvent {
  id: number;
  timestamp: string; // ISO 8601 UTC  e.g. "2025-07-24T14:21:08.000Z"
  vehicleId: string; // e.g. "1234"
  level: EventLevel;
  code: string; // e.g. "U0420"
  message: string; // e.g. "Steering angle sensor malfunction"
  createdAt: string; // When row was inserted
}

// Raw shape returned from DB (snake_case) — mapped in repository

export interface DiagnosticEventRow {
  id: number;
  timestamp: string;
  vehicle_id: string;
  level: string;
  code: string;
  message: string;
  created_at: string;
}

// QUERY / FILTER TYPES

export interface EventFilters {
  vehicleId?: string;
  code?: string;
  level?: EventLevel;
  from?: string; // ISO date string
  to?: string; // ISO date string
  page?: number;
  limit?: number;
}

// AGGREGATION TYPES

export interface EventsByVehicle {
  vehicleId: string;
  totalEvents: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  lastSeen: string;
}

export interface EventsByCode {
  code: string;
  count: number;
  level: string;
  lastSeen: string;
}

export interface CriticalVehicle {
  vehicleId: string;
  errorCount: number;
  lastErrorAt: string;
  recentErrorCodes: string[];
}

// API RESPONSE WRAPPERS

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: Record<string, any>;
    }
  }
}
