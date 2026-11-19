# Candidate UI, backend and PRD gap review

Review date: 19 November 2026.

## Assessment

The demo is useful as an approved interaction and visual reference, but it is not yet a reliable implementation contract. The backend already has substantial candidate functionality. The main risks are incompatible workflow rules, missing orchestration and several new features represented only by local demo state.

Do not copy the standalone HTML into the production frontend as the application implementation. Preserve it as a design reference alongside this gap register, then implement against agreed backend contracts.

## Scope and evidence

- Backend inspected: `jobpunter-backend`, HEAD `c984af5ee30348dcd3b64309eb9e79fa0a84279d`.
- UI inspected: `C:/Users/user/.codex/visualizations/2026/11/15/01a1deb9-503e-7771-a3ad-574a2e6c2830/jobpunter-assisted-journey.html`, particularly its active discovery, Punts, document and pipeline renderers. This is a source review of the local demo, not a fresh verification of every deployed screen.
- PRD: extracted attached v1.6 document in `tmp/jobpunter-attached-prd.txt`, especially sections 6–23 and identity/service authorization.
- Later governing requirements: the user's decisions, captured in `deliverables/frontend-design-v3/22-central-pool-product-decision.md`, `23-punts-workspace-and-watch-reminders.md`, and the interview lifecycle brief.
- Latest decisions supersede contradictory older PRD text. Central-pool architecture must remain absent from candidate UI copy.
- Existing uncommitted worker-host/heartbeat work and README changes were left untouched. Other backend worktrees and the production frontend repository were not reviewed. This report is not a claim about the currently deployed backend.
- Static code/contract review only: no live provider, database integration, employer submission or fresh end-to-end test was run. Existing tests were located; their presence is not treated as proof that they currently pass.

Backend paths below are relative to `jobpunter-backend`; UI line references refer to the HTML above.

## Priority findings

### 1. Candidate discovery still triggers external acquisition — high priority

**Requirement:** all candidate searches and scheduled recommendations read already processed central opportunities. Acquisition is independently backend-owned.

**Evidence:** `app/api/v1/discovery.py:171` creates candidate discovery missions. `app/workers/discovery_mission_worker.py:561` selects eligible sources and, around line 607, invokes `execute_source_scope` using `RegisteredAcquisitionService`. Missions still wait for acquisition canonicalization and evaluate source waves. Removing `acquisition_context` from settings has not removed this execution path.

**Impact:** directly wiring the demo's Discover or schedule controls to these missions would violate the latest product decision. Hourly central refresh also needs operational verification; a candidate schedule is not evidence of an independent hourly refresh.

**Required resolution:** separate central acquisition from candidate search/matching. Candidate actions must query processed inventory and create candidate-specific assessments without dispatching external searches. Prove this with an integration test that asserts no connector invocation from candidate search or recommendation scheduling. Verify independent hourly refresh separately. Keep this architecture out of UI text.

### 2. The two existing job feeds do not directly implement the demo's personal Job Pool — high priority

**Evidence:** `app/application/jobs/job_pool_service.py:277` starts with canonical identity and visibility predicates. It does not require a current viable candidate evaluation or complete/processed JD before admitting a result. Lifecycle/freshness restrictions are optional. The endpoint is a shared/owned canonical-job browser, not automatically a private matched pool.

The candidate evaluation feed is closer: `app/application/opportunities/service.py:60` returns latest evaluations per job/target-role pair, explicitly allowing one job to appear more than once. Its API (`app/api/v1/opportunities.py:45`) supports query, outcome, validity, freshness and lifecycle, but not the full combination of recency, pathway, discovery source, arrangement, employment and personal choice filters in the demo. The canonical feed has some of those job filters, but lacks the candidate disposition/fit combination.

**Impact:** wrong feed selection could show unmatched or incomplete jobs in the personal pool, duplicate opportunities across pathways, and give incorrect totals. Client-side filtering of one page cannot produce accurate all-record counts.

**Required resolution:** define separate search-result and personal-pool projections with explicit admission rules, one opportunity identity with multiple pathway assessments, server-side filters and counts, stable pagination and authoritative timestamps. No-CV users may see processed search results, but must not receive invented personal fit. The first five/Show more pattern needs stable paging while new opportunities arrive; current APIs use offset pagination.

### 3. Applying to a non-Punt has no direct application-creation contract — high priority

**Requirement:** viable non-Punts can be reviewed, watched, applied to or rejected, without falsely qualifying them as Punts.

**Evidence:** `app/application/opportunities/schemas.py:11` requires `punt_id` for application creation. `app/application/opportunities/service.py:802` loads an owned Punt and creates a `PLANNED` application from it. Punt qualification in `app/domain/opportunities/service.py:18` requires a current APPLY evaluation, score, deterministic eligibility, mandatory support and verified route.

**Impact:** the demo's non-Punt Apply path cannot simply call the existing create endpoint. Promoting every manually chosen job to a Punt would corrupt recommendation meaning.

**Required resolution:** add an explicit candidate-directed application path referencing the job and relevant assessment, preserving original recommendation and risk acknowledgment. Keep deterministic blocker policy explicit; an evidence-risk acknowledgment must not silently override eligibility rules. Define the no-CV route as access to instructions until sufficient career information exists for document preparation.

### 4. Pipeline states and opportunity ownership differ — high priority

**Evidence:** PRD section 22 distinguishes Screening and Interview invited. The demo also uses `INTERVIEW_INVITED`, `WON` and `LOST`. Backend `app/domain/opportunities/service.py:4` supports PLANNED, APPROVED, SUBMITTED, INTERVIEW, OFFER, ACCEPTED, REJECTED, WITHDRAWN and CLOSED, with strictly limited transitions. There is no separate invitation or screening state.

The demo stores a global `state.pipelineStage` (`HTML:601`, `1193`) while switching the selected job through `activateOpportunity` (`HTML:1339`). This is not a multi-application model. The backend already stores separate applications and audit events.

**Impact:** labels alone cannot represent a missing invitation milestone; multiple jobs can inherit the same demo stage/history. Demo correction moves also need an explicit backend policy rather than bypassing allowed transitions.

**Required resolution:** agree the canonical stage/event mapping, distinguish invitation from interview, and key all UI state by application ID. Keep actual submission separate from package approval. Test two applications moving independently, including stale revision conflicts and terminal outcomes.

### 5. Watched-Punt reminders and complete Punts history are only partially supported — high priority

**Evidence:** saved-job APIs exist (`app/api/v1/saved_jobs.py:19`), returning job identity and saved timestamp. Notifications and email delivery also exist. However, this bookmark contract does not supply per-Punt meaningful-activity time, login notification deduplication, 14-day reminder expiry or a unified new/watched/applied/rejected recommendation history.

The corresponding rule is local in `puntWatchLogin` (`HTML:1377`). `currentPunts` (`HTML:1336`) excludes watched items but does not explicitly exclude submitted items; the dedicated Punts screen uses another classification. This can make displayed counts disagree.

**Required resolution:** retain recommendation identity/history independently of bookmark and application state. Persist disposition events and watch activity; generate one aggregate reminder per fresh login, suppress each inactive watch after 14 days, and retain the saved record. Provide consistent timezone-aware daily and current counts to Home, Pool and Punts.

### 6. Personal mailbox connection and interview preparation lack matching backend workflows — high priority

**Existing:** authenticated pasted-email parsing (`app/api/v1/email_parser.py:22`), manual ingestion, notifications and Firebase identity verification. These are useful building blocks.

**Not found in the reviewed candidate routes/application modules:** personal Gmail consent/callback/token lifecycle and recruiter-message monitoring; interview practice sessions, generated questions, scored attempts, repeat/end actions and reminder/abandonment persistence. Google Drive backup code is not a Gmail authorization implementation. Outbound notification email is not inbox monitoring.

**UI evidence:** `preparationLogin` (`HTML:1298`) handles two reminders locally. `renderPreparationScore` (`HTML:1302`) explicitly calculates self-review ratings, not a live assessment.

**Required resolution:** implement separate mailbox consent and revocation, message-to-opportunity attribution and candidate approval of suggested events. Implement durable interview attempts/results and clarify abandonment timing after the second reminder. Keep demo scores described as self-review until real scoring is available. Test reload, device change, repeat and unfinished-session login cases.

### 7. A4 rich-text preview does not match document export — high priority

**Existing:** real DOCX/PDF generation, private storage/download routes, CV versions and approval. These are not missing features.

**Evidence:** `app/application/documents/rendering.py:29` converts content to plain text blocks. DOCX uses fixed Arial settings (`:132`); PDF uses fixed styles and `pagesize=LETTER` (`:177`). No shared rich-text styling model preserves the demo's selected fonts, colours, links or inline formatting. CV rendering also converts structured profile content to printable sections (`app/application/cv_studio/documents.py:43`).

**Required resolution:** establish a sanitized structured document format and shared A4 layout rules across preview, stored revisions, DOCX and PDF. Validate text, page size, wrapping, links, lists and formatting through an actual preview/edit/save/export round trip. The current save/version endpoints can store content, but that does not guarantee faithful export.

### 8. Guided onboarding and “save and approve” require explicit orchestration — medium/high priority

**Existing:** profile/evidence/claim review, document import parse/extract/conflict/confirm/save, pathway suggestions/approval, CV regeneration/versioning and package review are present. The backend should be reused rather than replaced by demo state.

**Gap:** the demo compresses many operations into local actions. Backend CV save and approve are separate operations (`app/api/v1/cv_studio.py:62`, `:76`); package creation, validation, prepare-review and review-decision are also separate (`app/api/v1/application_packages.py:49–148`). There is no demonstrated integrated flow proving that CV approval reassesses the exact earlier search results, retains the selected job, and resumes application preparation after interruption.

**Required resolution:** specify resumable orchestration and exact IDs/revisions for each step. A partial success must say “saved, approval pending” rather than falsely reporting both. Preserve previously approved versions. Add UI handling for stale revisions, extraction conflicts, unsupported claims, unavailable generation/storage and retry without duplicate work.

### 9. Candidate visibility checks are inconsistent in saved jobs — high priority

**Evidence:** canonical access is protected by `candidate_can_access_job` / `candidate_job_visibility_predicate` (`app/application/jobs/access.py:27`, `:65`). Saving a job (`app/api/v1/saved_jobs.py:56`) checks existence and ACTIVE lifecycle, but does not apply those visibility checks. Listing saved jobs joins Job directly and returns title/company.

**Impact:** a caller possessing an otherwise inaccessible active job ID could potentially save it and retrieve identifying job information. This is a static authorization finding, not a demonstrated exploit.

**Required resolution:** enforce the same visibility rule on bookmark creation and reads, including visibility changes after saving. Test foreign manual submissions and revoked source visibility before wiring Watch to this endpoint.

## Coverage that should be retained

| Candidate area | Backend foundation found | Remaining integration emphasis |
|---|---|---|
| Identity | Provider adapter and Firebase token verification | Real sign-in/session recovery; no fake demo identity |
| Profile, evidence and claims | CRUD, provenance and review transitions | Map questionnaire fields and conflict states; preserve approvals |
| Preferences and pathways | Preference APIs, pathway suggestions and approval/events | Selected-pathway semantics, risk handling and invalidation |
| Imports | Parse, extract, preview, identify conflicts, confirm, save, history | Upload progress, failures and resume; no silent claim approval |
| CV Studio | Master/variants, append-only versions, approval, document download | Rich-text/A4 contract and combined action orchestration |
| Matching and Punts | Evaluations, explanations, provenance, qualification and overrides | Real data replaces fixture matching; current/stale handling |
| Application packages | CV/letter/Q&A artifacts, evidence refs, claim validation, review, revisions, export | Per-opportunity context, editable evidence-backed answers, faithful preview |
| Pipeline | Per-application transitions, revisions and audit events | Stage agreement and independent multi-job UI |
| Notifications/support | Notification list/read/preferences; support ticket workflows | Honest dashboard totals, watch/interview events and linked destinations |
| Scheduling | Daily/weekly/timezone settings and durable missions | Replace candidate acquisition behavior with central-pool matching |

The demo's regex/fixture fit logic (`HTML:1334–1358`) must never become production matching. Backend qualification rules and evidence assessments should remain authoritative.

## UI/specification gaps to close before implementation

1. Add acceptance examples for loading, empty, failed, partially completed, stale and unauthorized states across the main journeys. Most demonstrated success paths currently use local fixtures.
2. Define dashboard count meanings consistently: new versus all Punts, viable pool size, actual submitted applications, unread notifications and unfinished work. Calculate over the full dataset, not the currently loaded page.
3. Add multi-opportunity acceptance cases for package editing, Q&A, pipeline changes, watch/reject and interview attempts. A selected job must never reuse another job's evidence, document or stage.
4. Consolidate the handoff documents with an explicit precedence register. Older source-management and acquisition instructions conflict with the central-pool decision. Preserve useful provenance without exposing connector setup or refresh architecture in candidate copy.
5. Retain the latest approved visual rules: two-column small-card clusters at every phone width, no outer cluster container, individual glowing yellow borders, horizontal single-row footer, and compact content. Existing demo layout checks are not a substitute for testing the integrated frontend with real long titles and records.

## Recommended implementation order

1. Resolve discovery architecture, personal-pool admission/filter contracts and bookmark authorization.
2. Agree non-Punt application creation, pipeline stages and per-opportunity identity.
3. Implement the candidate app against existing profile/import/evidence/CV/package services, including retry/revision handling.
4. Align rich-text preview and exports; prove A4 output.
5. Add durable watched-Punt reminders, mailbox monitoring and interview lifecycle.
6. Run a real candidate acceptance journey: empty account → search → CV upload or guided creation → approval → matching of retained results → Punt and non-Punt preparation → package review/export → candidate-recorded submission → independent pipeline updates → watch/login reminders → interview repeat/end. Include a no-CV route, a stale assessment, two simultaneous applications and a second-device resume.

The demo can be archived in the repository as a clearly labelled design reference now. It should not be labelled implementation-ready or used to promise end-to-end backend support until these gaps are resolved and validated.
