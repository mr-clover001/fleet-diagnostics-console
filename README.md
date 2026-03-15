# Fleet Diagnostics Console

A fullstack fleet health monitoring dashboard for operations engineers.
Built with **Node.js + Express + TypeScript** (backend) and
**Angular 17 + NgRx** (frontend).

---

## Prerequisites

Tool & Version
Node.js 18+
npm 9+
Angular CLI 17+

Install Angular CLI globally:

```bash
npm install -g @angular/cli
```

---

## Running the Backend

```bash
cd fleet-backend

#Note: No Need to add .env file in backend , i have already added and push and i didn't mention to ignore that in Git Ignore file 
# Install dependencies
npm install

# Optional Command:- if seed_log.txt in seed Folder is not present then run Command it will generate the log
node src/seed/generateLogs.js

# Seed database with sample data (100 events)
npm run seed

# Start dev server
npm run dev
```

Backend runs on: `http://localhost:3000`  
Swagger docs at: `http://localhost:3000/api-docs`

To reset and re-seed:

```bash
npm run seed -- --reset
```

---

## Running the Frontend

```bash
cd fleet-frontend

# Install dependencies
npm install

# Start dev server
ng serve
```

Frontend runs on: `http://localhost:4200`

> Make sure the backend is running first.

---

## What Works

- Ingest diagnostic events from raw log format
- REST API with filters: vehicle, code, severity (combinable)
- Pagination on all event queries
- Aggregations: by vehicle, by error code, critical vehicles
- Swagger UI with all endpoints documented
- Angular dashboard with NgRx state management
- Filter panel with debounced auto-dispatch
- Two views: Events Table + Analytics Dashboard
- Bar chart for top error codes
- Critical vehicle alerts
- Sticky navbar + filters, scrollable data only
- Color-coded severity badges
- In-flight request cancellation via switchMap
- semantic HTML, keyboard-friendly where it makes sense

---

## What I Would Do Next With More Time

### Backend

- [ ] Enhance the Folder Structure According to Scable and Entreprise Level ( Modular Folder Structure) 
- [ ] Replace SQLite with PostgreSQL + TimescaleDB for time-series at scale
- [ ] Add WebSocket / SSE for true real-time event streaming
- [ ] Add Redis caching for aggregation endpoints ( Because for Enterprise Level Project)
- [ ] Add rate limiting per client IP
- [ ] Add Jest unit + integration tests

### Frontend

- [ ] Add virtual scrolling for very large event lists
- [ ] Real-time updates via WebSocket observable
- [ ] Export filtered results to CSV
- [ ] Dark mode support
- [ ] Vehicle drill-down detail page
- [ ] E2E tests with Cypress
- [ ] Enhance the UI for better User experience.

### Infrastructure (MUST for EnterPrise Level Project)

- [ ] Docker + docker-compose for full stack
- [ ] CI/CD pipeline via GitHub Actions
- [ ] API versioning (/api/v1/)
- [ ] JWT authentication + role-based access

```

---

## 5. API DOCUMENTATION

Your Swagger is already auto-generated and live at:
```

http://localhost:3000/api-docs
