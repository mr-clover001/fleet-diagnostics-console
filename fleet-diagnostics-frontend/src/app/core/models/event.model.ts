export type EventLevel = 'ERROR' | 'WARN' | 'INFO';

export interface DiagnosticEvent {
  id: number;
  timestamp: string;
  vehicleId: string;
  level: EventLevel;
  code: string;
  message: string;
  createdAt: string;
}

export interface EventFilters {
  vehicleId?: string;
  code?: string;
  level?: EventLevel | '';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

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
