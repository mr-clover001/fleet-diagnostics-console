# Requirements Description

## Business Requirements

# Requirement

1 Operations engineers must be able to monitor vehicle health in near real-time
2 Engineers must filter diagnostic events by vehicle ID, error code, severity, and time range
3 The system must identify and highlight vehicles in a "critical" state
4 Engineers must see aggregated views — errors per vehicle and most frequent error codes
5 The system must support ingestion of diagnostic events from log files
6 Engineers must be able to paginate through large sets of raw events
7 The dashboard must provide at least two distinct views of the same data

## Assumptions Made

# Assumption

1 A vehicle is considered **critical** if it has 3 or more ERROR events within the last 1 hour |
2 Events are **append-only** — no updates or deletes to historical data |
3 Vehicle IDs are alphanumeric strings (e.g. "1234", "TRUCK-01") |
4 All timestamps are stored and returned in **UTC ISO 8601** format |
5 Default pagination is **20 events per page**, max 200 per request |
6 Log format follows the structure: `[timestamp] [VEHICLE_ID:x] [LEVEL] [CODE:x] [message]` |
7 The frontend is a **SPA** (no SSR needed) — it is an internal operations tool |
8 "Near real-time" is achieved via **manual refresh / filter triggers**, not WebSocket streaming |
9 SQLite is acceptable for this assignment scope — production would use PostgreSQL |
