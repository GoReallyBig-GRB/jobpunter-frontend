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


## Branch-level boundary verification (2026-10-09)

Checked these paths directly on `migration/vite-to-nextjs`:

| Path | Observed result | Meaning |
|---|---|---|
| `backend/app/main.py` | Not found (404) | Legacy FastAPI implementation is no longer in the frontend repository. |
| `backend/pyproject.toml` | Not found (404) | Legacy backend package/config is no longer in the frontend repository. |
| `backend/migrations/env.py` | Not found (404) | Legacy Alembic config is no longer in the frontend repository. |
| `firestore.rules` | Not found (404) | Legacy Firestore rules file is removed. |
| `src/engine/aiProvider.ts` | Still present; blob `fdeca25ea4171e1a544ee6cccd8838079bbe714a` | AI/domain behavior remains in the frontend and must be mapped before removal. |
| `src/engine/evaluator.ts` | Still present; blob `2c673aa2f73b3d37f286a73568e1c0b9c8052514` | Candidate-agnostic evaluation and hard eligibility rules remain in the frontend. |
| `src/engine/emailParser.ts` | Still present; blob `354fd5d30fc7df387c3a11a7ac45f9fbdd70b17a` | Job-alert parsing remains in the frontend. |
| `src/engine/providers/providerManager.ts` | Still present; blob `2fef55d83d5d8777dab7cb806d6e5a6d8c63ee7a` | Provider/model management code remains in the frontend; candidate-controlled provider configuration must not be migrated as-is. |

This confirms **repository boundary cleanup for the legacy `backend/` directory only**. It does not confirm product parity. The remaining TypeScript engine modules are explicit migration blockers; do not remove them until their behavior has a tested FastAPI equivalent or a documented product decision to defer/retain it.
