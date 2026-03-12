import { getDatabase } from "../config/database";
import { EventsByVehicle, EventsByCode, CriticalVehicle } from "../types";

// My Logic :  A vehicle is CRITICAL if it has 3+ ERROR events in the last 1 hour
const CRITICAL_ERROR_THRESHOLD = 3;
const CRITICAL_WINDOW_HOURS = 1;

export const aggregationRepository = {
  // Errors grouped by vehicle
  getByVehicle(from?: string, to?: string, limit = 20): EventsByVehicle[] {
    const db = getDatabase();

    const conditions: string[] = [];
    const params: string[] = [];

    if (from) {
      conditions.push("timestamp >= ?");
      params.push(from);
    }
    if (to) {
      conditions.push("timestamp <= ?");
      params.push(to);
    }

    const whereSQL = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    return db
      .prepare(
        `
      SELECT
        vehicle_id                                            AS vehicleId,
        COUNT(*)                                              AS totalEvents,
        SUM(CASE WHEN level = 'ERROR' THEN 1 ELSE 0 END)     AS errorCount,
        SUM(CASE WHEN level = 'WARN'  THEN 1 ELSE 0 END)     AS warnCount,
        SUM(CASE WHEN level = 'INFO'  THEN 1 ELSE 0 END)     AS infoCount,
        MAX(timestamp)                                        AS lastSeen
      FROM diagnostic_events
      ${whereSQL}
      GROUP BY vehicle_id
      ORDER BY errorCount DESC
      LIMIT ?
    `,
      )
      .all(...params, limit) as EventsByVehicle[];
  },

  // Most frequent error codes
  getByCode(from?: string, to?: string, limit = 20): EventsByCode[] {
    const db = getDatabase();

    const conditions: string[] = [];
    const params: string[] = [];

    if (from) {
      conditions.push("timestamp >= ?");
      params.push(from);
    }
    if (to) {
      conditions.push("timestamp <= ?");
      params.push(to);
    }

    const whereSQL = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    return db
      .prepare(
        `
      SELECT
        code,
        COUNT(*)       AS count,
        level,
        MAX(timestamp) AS lastSeen
      FROM diagnostic_events
      ${whereSQL}
      GROUP BY code
      ORDER BY count DESC
      LIMIT ?
    `,
      )
      .all(...params, limit) as EventsByCode[];
  },

  // Vehicles currently in critical state (3+ ERRORs in last 1 hour)
  getCriticalVehicles(): CriticalVehicle[] {
    const db = getDatabase();

    const windowStart = new Date(
      Date.now() - CRITICAL_WINDOW_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const rows = db
      .prepare(
        `
      SELECT
        vehicle_id   AS vehicleId,
        COUNT(*)     AS errorCount,
        MAX(timestamp) AS lastErrorAt,
        GROUP_CONCAT(DISTINCT code) AS recentErrorCodes
      FROM diagnostic_events
      WHERE level = 'ERROR'
        AND timestamp >= ?
      GROUP BY vehicle_id
      HAVING COUNT(*) >= ?
      ORDER BY errorCount DESC
    `,
      )
      .all(windowStart, CRITICAL_ERROR_THRESHOLD) as Array<{
      vehicleId: string;
      errorCount: number;
      lastErrorAt: string;
      recentErrorCodes: string;
    }>;

    // Convert comma-separated codes string to array
    return rows.map((row) => ({
      ...row,
      recentErrorCodes: row.recentErrorCodes
        ? row.recentErrorCodes.split(",")
        : [],
    }));
  },
};
