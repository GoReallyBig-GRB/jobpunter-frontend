# JobPunter Foundation 01

This directory contains the production-target backend foundation slice.

## Implemented

- FastAPI server shell
- `/api/v1` routing
- request IDs
- structured domain errors
- authentication-provider seam
- server-side ownership primitive
- PostgreSQL/SQLAlchemy/Alembic foundation
- UUID IDs, UTC timestamps, optimistic revision fields
- identity and candidate profile persistence
- candidate claims and evidence-source persistence
- evidence state machine
- candidate/evidence API slice
- unit tests for authorization and evidence state transitions

The `X-User-ID` header is explicitly development-only and is not production authentication.
