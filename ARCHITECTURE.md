# Architecture

## Backend

**Stack:** Node.js, Express, TypeScript, SQLite (better-sqlite3), Zod, Swagger

I went with Express over NestJS to keep things simple and explicit for this scope.
SQLite made sense here — no infrastructure to set up, file-based, and fully
queryable with SQL. In production I'd swap it for PostgreSQL.

### Structure

```
Request → Router → Controller → Service → Repository → SQLite
```

I kept strict layer separation so each file has one job:

- **Router** — just maps routes to controllers, nothing else
- **Controller** — reads the request, calls the service, sends the response
- **Service** — business logic lives here (e.g. what makes a vehicle "critical")
- **Repository** — all SQL in one place, maps snake_case DB rows to camelCase TS
- **Parser** — regex-based log line parser, completely isolated and testable

### Database

```
diagnostic_events
id          INTEGER PRIMARY KEY
timestamp   TEXT  (ISO 8601 UTC)
vehicle_id  TEXT  (indexed)
level       TEXT  ERROR | WARN | INFO (indexed)
code        TEXT  (indexed)
message     TEXT
created_at  TEXT
```

Indexes on `vehicle_id`, `level`, `code`, `timestamp`, and a composite on
`(vehicle_id, timestamp)` to keep time-range queries per vehicle fast.

WAL mode enabled for better read concurrency.

### A few decisions worth noting

- **Critical vehicle** = 3+ ERROR events in the last hour. Threshold lives as
  a constant in the repository so it's easy to change.
- **Zod middleware** is a generic factory function — you pass in any schema and
  get a validator back. Reused across all routes.
- **Bulk inserts** use a SQLite transaction for performance when seeding.

### Endpoints

```
GET  /api/events                  filtered + paginated events
GET  /api/events/:id              single event
POST /api/events/ingest           ingest raw log text
GET  /api/aggregations/by-vehicle error counts per vehicle
GET  /api/aggregations/by-code    most frequent codes
GET  /api/aggregations/critical   vehicles with 3+ errors in last hour
GET  /api/health                  health check
GET  /api-docs                    Swagger UI
```

---

## Frontend

**Stack:** Angular 17 (standalone), NgRx, Angular Material, ng2-charts

### State

Three slices in the NgRx store:

```
filters       → what the user has currently typed/selected
events        → the paginated API response, loading flag, error
aggregations  → byVehicle, byCode, criticalVehicles
```

I chose NgRx over a simpler solution because the assignment specifically asked
for observable-based state management, and NgRx makes the data flow explicit
and easy to trace.

### How a filter change flows through the app

```
User types in filter input
  → form.valueChanges with debounceTime(400ms)
  → FiltersActions.setFilters dispatched
  → EventsEffects picks it up via ofType()
  → debounceTime(300ms) again to catch rapid changes
  → switchMap calls the API (cancels any previous in-flight request)
  → success → store updated → vm$ emits → table re-renders
```

The double debounce (form + effect) is intentional — the form debounce reduces
dispatches, the effect debounce handles cases where multiple actions fire
in quick succession (e.g. page change + filter change together).

### RxJS operators used and why

| Operator               | Where                 | Why                                              |
| ---------------------- | --------------------- | ------------------------------------------------ |
| `switchMap`            | Effects               | Cancels in-flight requests on new filter         |
| `debounceTime`         | FilterPanel + Effects | Avoid flooding the API while typing              |
| `combineLatest`        | Components            | Single vm$ from multiple store selectors         |
| `withLatestFrom`       | Effects               | Read filters without creating a new subscription |
| `shareReplay(1)`       | Components            | One subscription shared across the template      |
| `forkJoin`             | AggregationsEffects   | All 3 aggregation calls fired in parallel        |
| `distinctUntilChanged` | FilterPanel           | Skip if nothing actually changed                 |
| `catchError`           | Effects               | Errors go into store, shown via error-banner     |

### Components

```
DashboardComponent       layout shell — sticky toolbar, filters, tabs
  - FilterPanelComponent reactive form, auto-dispatches on change
  - EventsTableComponent paginated table, color-coded by severity
     ─ SeverityBadgeComponent
  - AggregationsComponent charts, summary cards, critical vehicle list
     - LoadingSpinnerComponent
```

### Two views

- **Events tab** — raw event table with pagination, sticky column headers,
  rows highlighted by severity level
- **Analytics tab** — summary stat cards, bar chart of top 10 error codes
  (color-coded by severity), per-vehicle breakdown table, critical vehicle
  alerts at the top
