import { getDatabase } from "../config/database";
import {
  DiagnosticEvent,
  DiagnosticEventRow,
  EventFilters,
  PaginatedResult,
} from "../types";
import { ParsedEvent } from "../parser/logParser";

//  Row mapper
function mapRow(row: DiagnosticEventRow): DiagnosticEvent {
  return {
    id: row.id,
    timestamp: row.timestamp,
    vehicleId: row.vehicle_id,
    level: row.level as DiagnosticEvent["level"],
    code: row.code,
    message: row.message,
    createdAt: row.created_at,
  };
}

//  Repository
export const eventRepository = {
  // INSERT a single event
  insert(event: ParsedEvent): DiagnosticEvent {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO diagnostic_events (timestamp, vehicle_id, level, code, message)
      VALUES (@timestamp, @vehicleId, @level, @code, @message)
    `);

    const info = stmt.run({
      timestamp: event.timestamp,
      vehicleId: event.vehicleId,
      level: event.level,
      code: event.code,
      message: event.message,
    });

    return this.findById(info.lastInsertRowid as number)!;
  },

  // BULK INSERT — uses a transaction for performance
  insertMany(events: ParsedEvent[]): number {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO diagnostic_events (timestamp, vehicle_id, level, code, message)
      VALUES (@timestamp, @vehicleId, @level, @code, @message)
    `);

    const insertAll = db.transaction((rows: ParsedEvent[]) => {
      for (const row of rows) stmt.run(row);
      return rows.length;
    });

    return insertAll(events) as number;
  },

  // FIND BY ID
  findById(id: number): DiagnosticEvent | null {
    const db = getDatabase();
    const row = db
      .prepare("SELECT * FROM diagnostic_events WHERE id = ?")
      .get(id) as DiagnosticEventRow | undefined;

    return row ? mapRow(row) : null;
  },

  // FIND MANY with filters + pagination
  findMany(filters: EventFilters): PaginatedResult<DiagnosticEvent> {
    const db = getDatabase();

    const { conditions, params } = buildWhereClause(filters);

    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const offset = (page - 1) * limit;

    // Count query
    const countRow = db
      .prepare(`SELECT COUNT(*) as count FROM diagnostic_events ${whereSQL}`)
      .get(...params) as { count: number };

    const total = countRow.count;

    // Data query
    const rows = db
      .prepare(
        `
        SELECT * FROM diagnostic_events
        ${whereSQL}
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
      `,
      )
      .all(...params, limit, offset) as DiagnosticEventRow[];

    return {
      data: rows.map(mapRow),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // COUNT ALL
  count(): number {
    const db = getDatabase();
    const row = db
      .prepare("SELECT COUNT(*) as count FROM diagnostic_events")
      .get() as { count: number };
    return row.count;
  },

  // CLEAR ALL — used in seed reset
  deleteAll(): void {
    getDatabase().exec("DELETE FROM diagnostic_events");
  },
};

//  Query builder helper
function buildWhereClause(filters: EventFilters): {
  conditions: string[];
  params: (string | number)[];
} {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.vehicleId) {
    conditions.push("vehicle_id = ?");
    params.push(filters.vehicleId);
  }
  if (filters.code) {
    conditions.push("UPPER(code) = UPPER(?)");
    params.push(filters.code);
  }
  if (filters.level) {
    conditions.push("level = ?");
    params.push(filters.level);
  }
  if (filters.from) {
    conditions.push("timestamp >= ?");
    params.push(filters.from);
  }
  if (filters.to) {
    conditions.push("timestamp <= ?");
    params.push(filters.to);
  }

  return { conditions, params };
}
