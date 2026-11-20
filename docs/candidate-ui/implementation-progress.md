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

## Stable custom domain and second build

Latest owner decision: main staging `https://jobpuntertest.goreallybig.com/`, production reserved `https://jobpunter.goreallybig.com/`, Pages root retained as staging fallback. Cloudflare custom domain 87a587cd-af5c-44c8-993f-aa6421f87ced is active. DNS CNAME bf9bd445a68c2cffd34766960a5459c0 points only jobpuntertest to jobpunter-candidate.pages.dev. No production DNS record was created or modified.

Frontend fixes `5df33d8280faf245ccf91946ce7e4248b608c995` passed CI run 44699411412 and deployed as Cloudflare build 68fd06d1-eabc-4213-9ec7-610ca11f97e8. Cloudflare labels this staging project root slot production; actual JobPunter production remains unchanged. The owner confirmed all three stable Firebase domain additions. Retesting on the custom staging hostname now reaches the Google account chooser and basic profile/email sign-in screen, resolving the unauthorized-domain barrier. Final authenticated session/read/write checks remain separate.

## Authentication and remaining search contract

On the active custom staging hostname, Google sign-in completed and the app displayed Signed in as GoReallyBig. Browser refresh restored the authenticated account. Only basic profile/email identity consent was used; mailbox monitoring remains separately gated. This verifies frontend Firebase sign-in/session restoration, not backend token acceptance. The owner requested a persistent phone viewport; the browser is left at 390 x 844. evidence/home-mobile.jpg captures that deployed signed-in view at frontend 5df33d8.

An exact-revision read of app/application/jobs/job_pool_service.py:277-395 confirms the candidate pool feed filters canonical visibility and optional lifecycle/freshness, not mandatory processed/complete description admission. It uses offset paging, orders by last observation, and treats the complete query as one substring rather than parsing comma-separated keywords. These are concrete unresolved CUI-001/CUI-002 contract requirements; do not remove the search gate or substitute browser filtering for authoritative totals. This is independent of the already implemented central acquisition.

A non-blocking, read-only hosted diagnostic now checks public health revision and GET/PUT preflight permission for the exact custom staging origin. It sends OPTIONS requests only for candidate endpoints, never identity tokens or candidate data. Its results are distinct from the build and authenticated acceptance; a green build cannot close CUI gaps if this diagnostic fails.

## Runtime diagnostic result and configuration blocker

CI run 44702179597 at frontend 3f9214a passed the build, type and gate checks. Its optional public runtime diagnostic exited 1: both GET and PUT preflights returned 405, no Access-Control-Allow-Origin header, so CORS acceptance FAILED. The overall green CI result does not override that diagnostic failure. Exact sanitized results are in evidence/runtime-prerequisites.json.

Health returned 200 but reported da3822ff13ce57d88d3a1df5745f1faf10c05e27 (a 10 November documentation commit); Render still identifies artifact 304673112c4892e56649615e66733c75f063545b as live. This is a stale/mismatched health configuration label, not evidence that newer code deployed. The pool route and service blobs are identical at both revisions. No replacement acquisition implementation is justified by this discrepancy.

CORS configuration is prepared as JOBPUNTER_CORS_ALLOWED_ORIGINS=https://jobpuntertest.goreallybig.com,https://jobpunter-candidate.pages.dev on Render service srv-dbpa0b142hec73c1ispg, merging this one variable. The attempted update was rejected before mutation because the Render connector requires owner confirmation of the target workspace. list_workspaces returns My Workspace, tea-dbp9fsnf3r2c73fgc0ng. Await explicit workspace confirmation; do not select one automatically. No backend environment variable, backend deployment, production DNS or production frontend was changed by that attempt.
