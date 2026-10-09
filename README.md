# JobPunter

Evidence-based job discovery and application management platform.

## Production target

- Frontend: Next.js + TypeScript
- Backend: Python + FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy 2.x
- Migrations: Alembic
- Validation: Pydantic
- Architecture: modular monolith

The backend is the server authority. Browser state is never a security boundary.

## Current implementation

The `backend/` directory contains the first production foundation slice:
- FastAPI API shell
- request IDs and structured errors
- authentication-provider seam
- server-side ownership authorization primitive
- PostgreSQL/SQLAlchemy/Alembic foundation
- identity and candidate profile persistence
- candidate claims and evidence persistence
- evidence state machine and API
- unit tests for authorization and evidence transitions

The `X-User-ID` header is development-only and is not production authentication.
