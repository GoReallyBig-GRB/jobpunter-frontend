# Candidate implementation progress — 20 November 2026

Owner: Codex. Frontend baseline: bf73b219e2dbe048c30ecb1b20bb24fd0f712879, PR #8, existing branch. All nine CUI gaps remain Open. No backend files changed.

## Built in React

The App Router now mounts `src/candidate/CandidateApp.tsx` through the existing browser-rendered entry. It no longer mounts the legacy fixture context. Shared responsive layout, all eight footer destinations, Home cards, expandable Discover and personal-pool search, intake forms, career entry/upload/guided draft sections, and explicit unloaded states are implemented. These are an initial implementation slice, not completion of every demo journey. Counts use unavailable markers rather than invented zeroes. No simulated data, scoring, saves, downloads or submissions are used.

`ConnectionAction.tsx` and `connections.ts` enforce the exact action registry. Not-connected actions report the required CUI message without dispatch. Connected-but-unverified search is gated separately. Production wording also keeps operations gated. A status change without an API operation and verification evidence cannot enable an action. Network/timeout failures after dispatch do not claim that nothing was saved. A synchronous in-flight guard prevents repeated clicks from duplicating dispatch.

Discover has a typed adapter for the existing candidate pool GET, with response validation and a timeout. It is wired behind its unverified gate, not enabled. The personal viable-pool contract is not silently substituted with that shared job feed. Search results and selected job identity live above screen navigation and clear on account changes. Durable cross-device resume remains pending.

## Deployed backend evidence

Render service `srv-dbpa0b142hec73c1ispg`, URL `https://jobpunter-api.onrender.com`, reports automatic deployment disabled and configured branch `dep-03/hosting-db-pool-monitoring`. Latest live deployment `dep-dbvti6rrjlhs73fnucv0` identifies commit `304673112c4892e56649615e66733c75f063545b` (20 November 2026 05:25 UTC). This is provider deployment evidence, not authenticated journey verification.

GitHub reads at that exact revision confirm `app/api/v1/job_pool.py` provides GET `/candidate/jobs/pool` and `app/application/jobs/job_pool_schemas.py` defines the response. `app/workers/discovery_mission_worker.py:490-650` still contains connector dispatch. The frontend must not call discovery missions for candidate search. This does not disprove completed independent acquisition; it distinguishes the existing mission path from the required pool read. Scheduled cadence and processed-record admission still need verification. No replacement acquisition implementation was attempted.

## Preview infrastructure

The connected Cloudflare account initially returned no Pages projects. A separate `jobpunter-candidate` project was created, with GitHub source `GoReallyBig-GRB/jobpunter-frontend`, build `npm run build`, output `out`. Production branch remains main with production deployments disabled. Preview deployment selection allows only `docs/candidate-ui-handoff-2026-11-19`. GoReallyBig was not modified.

Preview public API origin is the deployed backend above. Firebase currently uses the existing repository public project unless public environment overrides are supplied. Consequently, sign-in and any later verified operations can use production identity/data services. All new data actions remain gated. Firebase authorized-domain and backend CORS checks remain outstanding. Project creation is not a successful app deployment.

Static-export source inspection: one root page; no server actions, route handlers, dynamic server routes or Next image optimization in the mounted candidate application. `output: 'export'` is configured, with a static server for `npm start` and CI smoke checks serving `out`. Build validation is still required.

## Validation and current limitations

Six executable connection-boundary tests pass using Node 24 type stripping. They cover every registered pending action, production gating, unknown action rejection, evidence required to enable dispatch, one real-handler invocation, runtime/unknown-outcome wording, and isolation from fixture state. Client-secret guard self-test (12 cases), source guard and API-boundary contract check pass.

Local `npm ci` failed: online install exited with an npm handler error amid unavailable DNS; offline attempts report ENOTCACHED. Local type check cannot run without tsc. Offline package-lock refresh also cannot finish because an optional package is missing from the cache. No local build, browser responsiveness, authentication or read/write journey has passed. Cloudflare build and runtime evidence must be recorded separately.

## Published build and browser evidence

Frontend `4c99c88199180dc08aca5ded824e72aa4221ff60` is published on PR #8. GitHub Actions run 44697695930, job 136158303384, passed dependency installation, six gate tests, type checking, static Next.js build and exported-page smoke check. Logs confirm the root route is static. This resolves build compatibility on the hosted runner; local dependencies remain unavailable.

Cloudflare deployment `28f4fcee-dc33-4b76-b798-349e05652665` succeeded as a preview for that exact commit. Browser checks on its URL passed widths 320/360/390/412/430: two computed card columns, zero page-wide horizontal overflow, eight footer destinations in one nowrap row and no icons in the three Home stats. All eight main destinations render at 320px without overflow. Pool filters reset to defaults; Search pool is the sole filter submit control. Browser clicks show the exact not-connected CUI-006 message and distinct unverified CUI-001/CUI-002 message. No scoring or saved state is invented.

The sign-in attempt reaches Firebase and fails with `auth/unauthorized-domain`. The Firebase warning identifies the preview hostname as unauthorized. No authenticated journey has passed and no CUI gap closes on these UI/build checks. Subsequent fixes reset search disclosure state on navigation, focus visible feedback after a pending click, explicitly mark data-action cards, and discard search results after an account switch.

## Stable staging address (owner decision)

The owner requested `https://jobpunter-candidate.pages.dev/` as the simpler staging URL. The separate Pages project's root slot is now reserved for staging, with the handoff branch configured as that project's production branch and automatic production deployments still disabled. Cloudflare's environment label for this slot is `production`; this is not promotion to JobPunter's actual production release. The root slot has integration-preview wording enabled and uses the same public backend origin. Authorization of the stable root hostname in the correct Firebase project is still required. GoReallyBig remains separate and unchanged.

Remaining: stable-root deployment confirmation and browser recheck; Firebase domain and backend CORS verification; authenticated pool read and one safe read/write round trip; actual profile/import/CV/package orchestration; per-application pipeline and interview screens; history/counts/watch authorization; complete rich-text/A4/export journeys; second-device resume. Existing backend capabilities are not declared absent merely because these new UI integrations are pending.
