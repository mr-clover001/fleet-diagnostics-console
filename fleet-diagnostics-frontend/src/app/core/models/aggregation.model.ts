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
