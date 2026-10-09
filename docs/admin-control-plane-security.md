# Admin control-plane security boundary

## Decision

The legacy `security/admin-authority-foundation` branch is not merged wholesale. Its Firestore-based implementation is retired from the Next.js migration. This document preserves the requirements worth carrying forward.

The frontend must not expose or imply working admin capability until the separate FastAPI backend implements and verifies server-enforced authorization and persisted configuration governance.

## Requirements to carry forward

- Admin access is denied by default. A signed-in candidate is not an administrator by virtue of signing in.
- The backend is the authority for roles, enabled/disabled status, and every privileged operation. Frontend route guards, hidden navigation items, and client-side authorization lookups are presentation controls only.
- Every admin API operation must authenticate the caller and authorize the specific action server-side. Candidate endpoints and data remain isolated from admin privileges unless an explicit permission grants access.
- Admin role grants, revocation, and privileged configuration changes must not be writable by ordinary clients. Use a controlled backend-only process for role assignment and configuration governance.
- Record security-relevant administrative actions in durable, server-written audit records. Audit records must not be editable or deletable through ordinary client requests.
- Fail closed when identity, authorization, or policy checks cannot be completed. Do not treat a failed lookup as authorization.
- Do not restore Firestore as the production authorization or application-data system. The target architecture is the authenticated FastAPI API with PostgreSQL as the authoritative database.
- Do not place service credentials, signing secrets, or privileged backend credentials in the browser bundle.

## Implementation status

This file records requirements; it does not claim that the admin control plane is implemented. Until the backend and its tests satisfy these requirements, admin functionality remains unavailable in the frontend.

## Acceptance checks before enabling admin UI

- Unauthenticated requests to admin endpoints are rejected.
- An authenticated non-admin cannot read or mutate admin configuration or invoke privileged operations.
- An administrator can perform only explicitly permitted actions.
- Revoked or disabled admin access takes effect on subsequent server-authorized requests.
- Authorization-service failures deny the operation.
- Candidate A cannot access Candidate B's private data through candidate or admin endpoints without an explicitly authorized administrative capability.
- Privileged changes produce durable audit events with actor, action, target, timestamp, and outcome.
- Automated API tests cover allow, deny, revocation, disabled account, and failure paths.
