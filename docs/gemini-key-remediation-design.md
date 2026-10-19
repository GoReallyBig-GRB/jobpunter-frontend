# System-managed AI architecture and key remediation

## Required boundary

The PRD places AI orchestration behind the separate Python/FastAPI backend. This frontend repository must call the backend API; it must not host AI execution routes or contain provider credentials. Candidates cannot supply provider API keys or select provider/model/task routing. Provider adapters and system configuration belong in the backend.

## Current repository boundary

- The frontend provider manager calls `NEXT_PUBLIC_JOBPUNTER_API_BASE_URL/api/v1/ai/generate` and sends the signed-in user's application identity token as a bearer credential. The URL is public configuration, not a secret.
- The AI execution implementation has been moved out of this repository to `jobpunter-backend`. Its AI task API is under review in backend PR #38 and is not yet part of backend mainline.
- The backend change defines bounded request contracts for the currently supported task types, a server-side Google AI adapter, safe provider/JSON error mapping, and API contract/authentication tests.
- Google sign-in authenticates the application user; Google Workspace OAuth tokens are not backend API credentials.

## Known gaps before production

1. The backend AI API must pass CI and be approved, merged, deployed, and verified in the target environment before the frontend integration can be called production-ready.
2. Distributed per-user/global quotas, spend ceilings, monitoring, alerts, and input/output retention policy remain required.
3. Formal per-task input/output schemas, completeness and provenance validation, and durable AI execution/audit records remain incomplete.
4. Provider/model selection is currently configured through backend runtime settings; the PRD's versioned AI Task Registry and protected administrative control plane are not yet complete.
5. End-to-end tests for authorized requests, revoked/invalid tokens, all task types, provider failures, structured-output failures, safe errors, and secret non-disclosure remain required.
6. Broader backend domain coverage, candidate ownership enforcement, background processing, storage, and deployment verification remain incomplete.

## Legacy browser data

Do not ask candidates to supply provider credentials as a workaround. Do not silently delete old `zc_ai_credentials_v1`, `zc_ai_model_registry_v1`, or `zc_ai_task_routes_v1` localStorage values. The current candidate execution path must not read, write, or transmit them. Any cleanup or migration requires an explicit decision and tests.
