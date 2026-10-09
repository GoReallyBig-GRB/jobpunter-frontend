# Legacy Backend Extraction Audit

**Source commit:** `702d929024b8baaac50cf03249efe88e2c3c426b`  
**Extraction:** The `backend/` directory was removed from this frontend repository on 2026-10-08 and its backend responsibilities belong in `GoReallyBig-GRB/jobpunter-backend`.  
**Detailed file-by-file audit:** [Backend parity audit PR #40](https://github.com/GoReallyBig-GRB/jobpunter-backend/pull/40), with the report in `docs/legacy-nextjs-backend-parity-audit.md`.

## What was actually in the legacy `backend/` directory

It was a foundation slice, not a complete backend. It contained:

- FastAPI application shell, API v1 router, health endpoint, request-ID middleware and structured domain errors.
- Candidate profile get/create endpoint.
- Evidence create endpoint, evidence source/provenance record, and submit/approve/reject/archive endpoints.
- Candidate profile, claim, evidence, source and claim-evidence SQLAlchemy models.
- Evidence state machine and revision increment/verification timestamp behavior.
- User and external-identity persistence models, settings, database session setup, and Alembic migrations.
- Identity-provider abstraction and a simple ownership predicate.
- Minimal unit tests for the ownership predicate and a small portion of the evidence state machine.
- Local PostgreSQL Docker Compose configuration and Python dependency setup.

## Migration and safety decisions

- The old development identity dependency accepted `X-User-ID`; it was not production-safe. It must not be restored. The separate backend uses verified bearer identity tokens and maps the external identity to an application user.
- Candidate/evidence routes and SQLAlchemy models have counterparts in the separate backend. Corresponding code does not establish full behavior parity: route-level authorization, PostgreSQL persistence, transaction atomicity, concurrency, and every state transition require tests.
- The separate backend contains additional acquisition, canonical job, requirement review, AI task, opportunity/Punt/application, and work/outbox modules. These were not all present in the legacy `backend/` directory; their existence is not proof that the full frontend product has been migrated.
- The frontend still contains TypeScript domain logic in `src/engine/aiProvider.ts`, `src/engine/evaluator.ts`, and `src/engine/emailParser.ts`. Those functions are not automatically replaced by the generic FastAPI AI-generation route. Each must be mapped to a server implementation with equivalent or stronger tests, or explicitly deferred.
- Google Workspace clients in `src/services/` are integration clients, not backend candidate persistence. Each needs integration-specific scopes, error handling and revocation checks.
- PostgreSQL remains the authoritative application database. Browser state must not be described as persisted until the relevant UI is wired to and tested against backend resources.

## Current status

**Extraction is structurally complete; product parity is not certified.** CI success proves the current checks pass, not that every legacy function works end to end. Do not claim production readiness until the parity audit's acceptance criteria and live staging journey checks pass.

No branch has been merged into `main`.
