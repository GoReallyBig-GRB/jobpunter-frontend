# JobPunter Frontend

Evidence-based job discovery and application management platform.

## Architecture

- **Frontend:** Next.js App Router, React, TypeScript, and Tailwind CSS.
- **Backend:** the separate [jobpunter-backend repository](https://github.com/GoReallyBig-GRB/jobpunter-backend), implemented as a Python/FastAPI modular monolith.
- **Authoritative application database:** PostgreSQL, managed by the backend through SQLAlchemy and Alembic.
- **Google sign-in:** used only for application identity. Drive, Gmail, Calendar, and Tasks each request their own scopes only when the user chooses to connect that integration. Workspace access tokens are isolated in memory by integration and are never used as backend API credentials.
- **AI execution:** system-managed, server-side API. Provider credentials and model configuration belong in the backend runtime, never in browser code.
- **File storage:** a backend-managed storage adapter; vendor choice remains open.
- **Google Sheets:** optional export/sync only, never the primary database.
- **Google AI Studio:** prototyping/development only, not a required production runtime.

This repository contains the frontend and its typed API clients. Backend routes, database migrations, provider adapters, authorization enforcement, background workers, and server-side secrets belong in the backend repository.

## Current status and boundaries

The Next.js migration branch contains the frontend framework migration and client-to-API integration. The backend API implementation is reviewed separately in the backend repository; open pull requests are not production deployments. Do not assume an API capability is available in a deployed environment until its backend change is approved, merged, and deployed.

Some existing screens still use legacy client-side state and are not yet fully migrated to PostgreSQL-backed APIs. Do not introduce dual writes or silently replace candidate data. Migrate each domain only after its API contract, ownership checks, data migration, error/loading states, and rollback path are verified.

## Local development

```bash
npm ci
npm run dev
```

Set `NEXT_PUBLIC_JOBPUNTER_API_BASE_URL=http://localhost:8000` to point the frontend at a local FastAPI service. This URL is public configuration, not a secret.

Never place database URLs, provider API keys, server credentials, or other privileged settings in this repository's frontend environment variables.
