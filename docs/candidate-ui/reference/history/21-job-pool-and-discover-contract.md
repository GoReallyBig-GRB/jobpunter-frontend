# Job Pool and Discover — candidate UI and integration contract

18 November 2026. PRD v1.6 sections 12–19, 20–23, canonical-ingestion section 43 and the email adapter guidance were reviewed against the latest user instruction. Existing frontend technology and branding remain unchanged. Backend files were inspected read-only; this deliverable does not claim production integration.

## Two footer destinations

The footer contains Home, Career, Review, Job Pool, Discover, Punts, Pipeline and More. On the phone-sized app surface, eight labelled targets occupy two rows of four, with touch targets above 44 px rather than eight compressed icons. Job Pool and Punts show dynamic counts. The active destination is distinct from hover/focus.

**Job Pool** is the candidate’s filtered view of already processed, currently matched, viable opportunities. It is not a new canonical repository. PRD section 14 still governs the shared canonical job identity; evaluations, evidence, decisions and application records remain candidate-private. The latest user instruction narrows the candidate-facing Pool beyond the broader backend canonical store.

**Discover** initiates acquisition and lets the candidate review a run’s complete outcome. Unmatched, incomplete or unsuitable discoveries remain accessible here or in Review; they do not appear as viable Pool cards. First-time global search now lands in Discover results, preserving the initial search-to-application journey without claiming a candidate match before career information exists.

## Job Pool layout and behavior

- Summary: actual viable and Punt counts for today, plus total active counts. The Punt summary opens the Punts tab. Punts are a subset of viable opportunities, not an additional collection to add to the total.
- Search: labelled “Search your Job Pool”; searches already discovered and processed opportunities. It never starts global acquisition.
- Filters: recency, Career Pathway, discovery source, remote/onsite/hybrid, employment type and watching. Changes combine; Clear filters restores the full active view.
- Ordering: newest known posting date first, otherwise first discovered time, with a stable canonical-ID tie-breaker. Unknown posting dates remain unknown. Rediscovery updates last-seen/provenance; it does not reset first discovery or pretend an old listing is new.
- Cards: title, employer, source facts, freshness/discovery information, pathway, **Found via** provenance, expandable job details and fit/evidence/gaps.
- Non-Punt actions: Review, Watch, Apply and Reject. Review opens the evidence and opportunity; Apply starts preparation, not employer submission. Pursuing a non-Punt requires a reasoned decision while retaining the original assessment and disclosed gaps.
- Watch/Reject: candidate dispositions are separate from the original system recommendation. Record actor, reason, timestamp and evaluation revision. A watched opportunity remains viable unless freshness or other eligibility changes; it is not presented as an immediate Punt recommendation. Rejection suppresses the active card but preserves the record. Restoration is deliberate and does not erase history.
- Empty states distinguish no processed opportunities from no filter matches. Offer Discover or the existing run results, not a fake population of jobs.

Pool admission requires a normalized canonical job, sufficiently complete JD, current candidate evaluation against approved career/CV source versions, viability under constraints, and appropriate freshness/accessibility. Incomplete, closed, stale, rejected or hard-blocked records must not be described as current viable opportunities. The prototype has explicit awaiting-match, stale, needs-detail, viable and unviable states.

## Evidence and explainability

Each evaluated opportunity must expose fit strength, original disposition, supporting candidate evidence, source/profile/CV versions, hard blockers, missing or conflicting evidence, verification needs, route accessibility, freshness and evaluation time. Preserve individual dimensions rather than using one score to hide a critical blocker.

“No evidence found” is not “candidate lacks this capability.” Candidate overrides must not rewrite underlying facts, remove hard blockers or silently qualify an opportunity as a Punt. Candidate-facing badges say how the job was found; they do not expose worker names, connector internals or raw model configuration. Detailed technical provenance remains in appropriate audit records.

## Candidate-initiated discovery paths

| Path | Candidate UI | PRD mapping / requirements |
|---|---|---|
| Immediate global search | Top panel with position, keywords, location, arrangement and employment type | Quick Match; new external discovery, followed by normalization and evaluation when career input is approved. |
| Job URL | URL field plus “Where did you find it?” | Manual URL. On retrieval failure, retain the URL and offer full JD paste. No silent disappearance. |
| Full job description | Description, optional URL, required source label | Manual JD; source examples include Indeed, WhatsApp, email and social media. Source label is provenance, not an instruction to connect to that platform. |
| Email or recruiter alert | Pasted message/digest, optional listing URL, source label | Manual Email; split multiple jobs, deduplicate, evaluate separately. Parser-only output is not a completed canonical acquisition. |
| Connected email alerts | Integration card with observed availability and separate permission scope | Automated Email Alerts. Sign-in is not mailbox authorization. No pretend Gmail connection. |
| Scheduled discovery | Daily/weekly schedule card | Candidate-selected time/day/timezone, pathways, sources and constraints; approval binds recurring scope. |
| Permitted APIs, employer sites and feeds | Source availability and discovery results | Candidate uses available sources through approved acquisition paths; credentials, provider configuration and connectors remain protected admin responsibilities. |
| Run history | Recent discovery cards | Run timestamp, method, duplicate links, outcome counts, partial-source failures, retries and retained source context. |

Global search remains the primary top panel. Other paths are tinted cards beneath it. An intake request and subsequent status must remain visible until completion or an actionable failure.

## Unified run results and routing

Results group into Punts, viable non-Punts, not viable, needs more detail, and awaiting CV/current matching. “All” provides a combined review. Do not classify unknown/incomplete jobs as rejected solely because a reliable assessment cannot yet be made.

1. Acquire supported source content and preserve its provenance/snapshot.
2. Split individual listings, normalize, resolve canonical identity and deduplicate.
3. Retrieve/validate JD, required fields, application route and freshness.
4. Evaluate against the candidate’s approved source snapshot where available.
5. Add current viable results to the candidate Pool; qualifying strongest matches also appear in Punts using the same identity.
6. Keep unsuitable and incomplete results available with explanations and recovery actions; they stay out of the curated Pool.

If a first-time candidate has no CV, keep the collected results in Discover. Add/create/review a CV, then assess those same results; do not rerun global search merely to match them. Candidates can inspect a listing or open the no-CV application guidance, but documents cannot be fabricated without career information.

Repeated discoveries converge on the same job. Retain additional discovery methods and origins. Re-evaluate material changes; do not reintroduce an unchanged rejected opportunity as new. A source failure must be distinct from a successful run with zero matches, and partial success must be visible without discarding successful results.

## Verified backend contracts and integration gaps

Reviewed in `jobpunter-backend/app/api/v1/`:

- `opportunities.py`: `GET /candidate/opportunities` currently accepts pagination, outcome, validity, freshness, lifecycle and query filters. Map these directly where applicable. Recency/date range, Career Pathway, normalized discovery method/origin, working arrangement, employment type, candidate-watch state, sorted pagination and summary counts need verified/additional query contracts; do not simulate server filtering over only one loaded page.
- `opportunities.py`: evaluation detail and reasoned overrides (`newDisposition`, `expectedRevision`, reason, optional notes); Punt and application creation/listing remain distinct. Frontend Apply must prepare a package and preserve candidate ownership of final submission.
- `manual_ingestion.py`: `POST /candidate/jobs/manual-ingestion` supports `MANUAL_URL`, `MANUAL_JD`, `MANUAL_EMAIL`, job/source fields and email fields. Preserve the documented idempotency mechanism. The additional human-readable origin label needs an explicit persisted provenance mapping; do not silently send an unknown request property into a strict schema.
- `email_parser.py`: `POST /email/parse-job-alert` parses supplied content only. It does not persist jobs, connect Gmail or submit applications.
- `discovery.py`: settings and manual mission creation/listing exist under `/candidate/discovery`. A single global-search UI must map filters to verified settings/mission inputs rather than inventing an arbitrary search endpoint. Confirm current profile prerequisites and provide a supported first-CV/first-search path where the API currently expects a candidate profile.

Production feed responses should include canonical ID, candidate evaluation ID/revision, currentness, source-version keys, normalized filters, freshness timestamps, candidate disposition, Punt qualification, application linkage, source badge information and source-health warnings. Expose server-computed counts over the full filtered set, with an explicit candidate timezone for “today”. Stable cursor pagination is preferable as new discoveries arrive.

Intake and run mutations need expected revisions where applicable, idempotency keys, authorization, a persisted run ID, source-level status and safe retries. Gate Pool/Punt admission on current assessments; editing the career source or JD must invalidate the relevant evaluation and show an actionable re-evaluation state. Do not submit an unassessed job to existing evaluation-override APIs.

## Prototype scope and validation

The prototype demonstrates local search/filtering, source labels, grouped run outcomes, deduplication, Watch/Reject decisions, current-match admission, Punt links and application preparation routing. The summary counts derive from its actual sample records; “20 opportunities and 10 Punts” is not hardcoded. Sample input paths explicitly state that pasted content is not parsed and URLs are not fetched. Connected email, external API discovery, persistent processing and live matching remain backend integration work.

The eight-tab footer, first-time pending results, CV-to-Punt flow, local search, filters, Watch/Reject, provenance, nonviable/incomplete exclusion, duplicate convergence, rejection retention and mobile widths are covered by targeted browser checks. Existing first-search raw results move to Discover results; the prior “filter matches in Pool before CV” design is superseded by the latest user instruction.

## Browser refinement — 18 November
- Footer retains eight destinations in one horizontally swipeable row; the active destination is brought into view. This supersedes the earlier two-row layout.
- Discover global search starts collapsed and expands from its labelled chevron control.
- Legacy URL, description and email intake entry points use the same forms as Discover; the intake hub uses the same four discovery cards, including the shared email-connection route.
- Pool opportunities appear automatically, newest first, in an initially expanded collection above the search panel. No search is required to load assessed records.
- Search and filters share one panel. Draft filter selections are committed only by Search pool or Apply filters. Clear filters is visually secondary and resets all criteria.
- These are presentation changes; admission, matching, evidence and source-provenance contracts remain unchanged.

### Search and incremental results refinement
The Pool search panel now starts collapsed and uses the same chevron disclosure as Discover global search. Inside, the primary yellow Search pool action is wider than the aligned Filters action. Filter fields expand beneath both actions. Opportunities are not a collapsible collection: show five initially, then append batches of five with Show more until exhausted. New searches or applied filters reset the visible batch; previously shown rows remain in place while loading more. Production should use a stable newest-first cursor and accurate total/end-of-results signals. Local interaction checks cover 5/10/13 records, filtering and reset, plus 320/390/430/736 px alignment.

19 November: document 22 supersedes candidate external-search/source-management assumptions in this document. UI must not expose central-pool architecture. Search pool is the sole filter submit action; Apply filters is removed.
