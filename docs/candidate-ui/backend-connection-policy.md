# Visible backend connection gaps — approved 20 November 2026

## Required behavior during UI implementation

Build the approved screens first or alongside integration, with an explicit action-level connection registry. No missing action may silently fall back to fixture writes, local fake success or invented provider results. The archived design demo remains a simulation and is not evidence of connection. This policy applies to the new implementation; it does not certify that its screens have been built.

For each data action record: stable action ID, screen, related CUI gap IDs, connection state, API operation, verified environment/revision and test evidence. A screen with some connected actions remains usable; gate individual actions, not the whole screen.

| State | Badge / initiated-action feedback | Execution |
|---|---|---|
| Not connected | Backend pending / **Backend not connected. This action cannot run yet. No changes were saved. Tracking reference: CUI-xxx.** | Do not dispatch, mutate saved state, navigate to success or download a fabricated result |
| Connected but unverified | Verification pending / **Backend connection not verified for this action.** | Keep gated in the implementation preview until acceptance evidence is recorded |
| Verified | No pending badge | Invoke the real operation with normal loading/success handling |
| Connected request fails | **Could not complete this action.** Explain the actual error and retry option | Do not relabel as not connected; do not substitute fake results |
| Request outcome uncertain after dispatch | **The result could not be confirmed. Check the latest record before retrying.** | Do not claim nothing was saved; reconcile via idempotency/readback |

Badges and messages must be accessible, keyboard reachable and identify the affected action. A pending action remains clickable to explain why it cannot execute. Show the message in an alert/status region or accessible dialog. Pure navigation, expanding sections and editing unsaved input need no backend call. Local unsaved input must remain labelled as unsaved.

The implementation preview shows technical messages and gap IDs. Production uses appropriate feature-availability wording and never enables an unverified action merely because preview mode is off. A health endpoint passing or a backend being deployed is not proof that every action is integrated.

## Registry and verification

Start from connection-actions.json. Initial `unverified` states reflect absent integration evidence for the new UI, not a claim that those backend services do not exist. During screen implementation split broad entries into exact button/form actions; keep a coverage check requiring every persistence/provider action to have a registry entry. Unknown actions fail closed. Removing a badge requires both real integration and recorded verification.

Tests must assert that a pending click shows its gap ID and does not invoke the API or change saved state; a verified click calls the intended operation once; API failures are distinguished from missing integration; mixed-connectivity screens remain usable. Include timeout/unknown-outcome handling. Preserve the canonical Open → Implemented → Verified → Closed gap register alongside action-level readiness.

## Product correction

The owner reports that the backend is deployed and central-pool acquisition is already implemented: approximately 20 scheduled acquisition runs per day feed the central pool; candidate searches and daily updates read it. Frontend has not been deployed. Treat CUI-001 as implementation-location/deployment verification and UI integration, not presumed missing acquisition code. Verify the branch/deployed revision and behavior before proposing replacement work. Keep all these internal details out of candidate UI copy.
