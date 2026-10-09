# Frontend/backend integration readiness

## Repository boundary

The frontend owns Next.js screens, client state presentation, typed API clients, and user-facing request/loading/error states. The separate backend repository owns FastAPI routes, authorization, domain rules, AI execution, PostgreSQL persistence, migrations, background work, and privileged configuration.

PostgreSQL is the authoritative application database. Some existing screens still use legacy client-side state and have not yet been migrated to backend-owned resources. Do not describe those screens as PostgreSQL-backed until their API integration and persistence behavior have been verified. Do not dual-write a domain to competing stores or replace candidate data with demo data after a request failure.

Google sign-in authenticates the user. The frontend sends the application identity token as a bearer token; Google Workspace OAuth tokens are separate and must never be used as backend API credentials.

## Backend routes on the current mainline

| Frontend domain | Backend route(s) | Current coverage | Migration status |
| --- | --- | --- | --- |
| Candidate profile | `GET /api/v1/candidate/profile` | Identity/profile shell only: id, user_id, status, revision | Not a replacement for the full Master Career Profile |
| Candidate evidence | `POST /api/v1/candidate/evidence`; submit/approve/reject/archive transitions | Create and revision-guarded status transitions | No frontend screen fully migrated |
| Evaluations | `GET /api/v1/candidate/evaluations` | Lists backend evaluation records | Not equivalent to the complete frontend Job model |
| Qualified opportunities (Punts) | `GET/POST /api/v1/candidate/punts` | Lists and creates qualified-opportunity records | No frontend screen fully migrated |
| Applications | `GET/POST /api/v1/candidate/applications`; transition route | Lists, creates, and transitions application records | Full application audit/history integration remains incomplete |
| AI task execution | `POST /api/v1/ai/generate` | Implemented on an open backend review branch, not yet on backend mainline | Do not assume deployed availability until approved, merged, and deployed |

## Important gaps before migrating screens

- No complete candidate-agnostic job discovery, canonical job pool, and full evaluation API yet matches the frontend's complete Job model.
- Full CRUD contracts are still needed for the Master Career Profile, career pathways, CV variants, Master CV, preferences, discovery settings, and integration configuration.
- The backend profile response is much smaller than the frontend profile. Do not map the two as if they were interchangeable.
- API failure must produce a visible error/retry state, not fabricated jobs or silent replacement with demo data.
- Ownership checks, optimistic concurrency, provenance, and audit behavior must be verified for each resource before its UI is switched over.

## Migration sequence

1. Confirm the backend route exists on the intended branch and environment, then validate its schema and authorization behavior.
2. Connect one screen/domain at a time with loading, empty, error, and retry states.
3. Add data migration and rollback steps before changing the authoritative source for an existing domain.
4. Verify ownership isolation, audit events, and persistence after reload.
5. Retire the legacy implementation only after parity and regression tests pass.
