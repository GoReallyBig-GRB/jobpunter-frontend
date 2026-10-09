# Frontend/backend integration readiness

## Current boundary

The frontend continues to use its existing localStorage state and Firebase/Firestore persistence. The backend API client is an integration boundary only; it does not make PostgreSQL authoritative for frontend workflows until a screen explicitly reads and writes the corresponding backend resource.

Firebase Authentication remains the user identity provider. Backend requests use Firebase ID tokens. Google Workspace OAuth access tokens are separate and must not be used as backend credentials.

## Backend routes currently available

| Frontend domain | Backend route(s) | Current coverage | Migration status |
| --- | --- | --- | --- |
| Candidate profile | `GET /api/v1/candidate/profile` | Identity/profile shell only: id, user_id, status, revision | Not a replacement for the rich Master Career Profile |
| Candidate evidence | `POST /api/v1/candidate/evidence`; submit/approve/reject/archive transitions | Create and revision-guarded status transitions | No frontend screen connected |
| Evaluations | `GET /api/v1/candidate/evaluations` | Lists backend evaluation records | Not equivalent to the frontend's complete `Job` model |
| Qualified opportunities ("punts") | `GET/POST /api/v1/candidate/punts` | Lists and creates qualified-opportunity records | No frontend screen connected |
| Applications | `GET/POST /api/v1/candidate/applications`; transition route | Lists, creates, and transitions application records | Not yet a replacement for the frontend's full application audit/history model |

## Important gaps before migrating existing screens

- There is no general job/opportunity ingestion and canonical job read/write API matching the frontend `Job` model.
- There are no replacement CRUD endpoints for the full Master Career Profile, career pathways, CV variants, Master CV, preferences, source emails, discovery settings, AI task configuration, or integration configuration.
- The backend profile response is intentionally much smaller than the frontend profile. Do not map the two as if they were interchangeable.
- Do not dual-write the same domain to PostgreSQL and Firestore/localStorage. Each migrated domain needs one explicit source of truth and a verified migration path.
- Do not replace real candidate data with seed/demo data when an API request fails.

## Recommended integration sequence

1. Keep Firebase Auth; verify the API base URL and bearer-token flow in a configured environment.
2. Validate the typed wrappers against the backend with CI once the CI workflow is available on the default branch.
3. Agree on canonical API schemas and implement the missing job/profile CRUD endpoints before switching corresponding UI screens.
4. Migrate one domain at a time with loading, empty, error, and retry states.
5. Only retire legacy persistence for a domain after API coverage, migration, and rollback behavior are verified.
