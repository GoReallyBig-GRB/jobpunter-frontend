> Latest design evaluation (17 November): [five-question standard and contextual CV workflow](13-screen-evaluation-and-contextual-cv.md), with [all-screen acceptance register](14-screen-acceptance-register.md). The updated preview contains 124 views.

> Latest direction: [Results, paper layout and ongoing assistance](11-results-cv-layout-and-assisted-operation.md) supersedes conflicting details below. No-CV flow gives next steps only; CV-based fit analysis uses the existing results. Current preview: 117 views.

> Correction: [Optional-CV first application](10-first-application-optional-cv.md) supersedes any CV upload gate below. Continue searching or proceed to risk-aware handoff without a CV; guided CV creation is an alternative. Current preview: 116 views.

> Latest update: [Search, Home and rich CV backend brief](09-search-home-and-rich-cv-backend-brief.md) governs first-search CV progression, generated Master CV approval and rich-document editing. Current prototype: 113 retained-and-expanded views.

> Update — 16 November 2026: see [progressive onboarding](07-progressive-onboarding.md) and [discovery curation](08-discovery-curation-and-provenance.md). The current prototype has 112 views and a Home-first footer. Initial filter-qualified discovery and reviewed-CV matching can precede full career setup. Raw alerts are curated before candidate review. Earlier conflicting prerequisites and navigation below are historical.

# JobPunter candidate application refinement

16 November 2026

Latest refinement: [CV editing, search scopes, pipeline and Gmail readiness](06-cv-discovery-pipeline-and-email-readiness.md). Footer order is now **Career, Review, Punts, Pipeline, More**. The Gmail preview no longer treats a local consent toggle as a real connection; the backend implementation gap is explicit.

Terminology and candidate collection semantics are governed by [Product vocabulary and opportunity model](05-product-vocabulary-and-opportunity-model.md): selected Career Pathways, CV Variants, a candidate Job Pool of viable pathway-relevant opportunities, and Punts as the strongest recommendations within it. The shared canonical repository remains an internal storage concept.

## Status and continuity

This is an upgrade of the existing assisted candidate prototype. All 96 screen identifiers and the connected application journey are retained. The prior revision is preserved locally for comparison. This work does not replace either repository's architecture, technology or production code. The old production frontend remains a conceptual UI reference; the PRD, explicit product decisions and verified backend contracts retain their established authority.

The current prototype remains `jobpunter-assisted-journey.html`. The workflow and contract documents in this directory continue to apply. This document supersedes their earlier visual copy and navigation labels where noted below.

## Application language

- Use concise task names, specific next actions and meaningful status. Examples: “Review your career profile”, “Punts for you”, “View Punt”, “Application questions” and “Your pipeline”.
- Do not use a company narrator (“we”, “our”), promotional slogans, paired marketing claims or website-style hero copy in the application.
- Explain what will happen, what needs attention and what a decision authorizes. Keep the tone direct, helpful and professional.
- Use “you” when it helps clarify ownership. Avoid repetitive statements about the system doing the work.
- Keep implementation commentary and prototype disclosures outside the product surface wherever possible. Retain operational facts that affect a decision: evidence gaps, consent scope, stale versions, delivery failures and manual submission.
- Use discipline-neutral language. Projects and other work, contributions, methods, qualifications and evidence must remain useful across professions and sectors.

## Visual and navigation upgrade

The supplied JobPunter artwork sits at the top left on every screen, including setup. There is no central logo hero. Existing artwork is preserved; no replacement wordmark or symbol is drawn.

Black and charcoal surfaces, precise spacing, restrained rounded panels, clear typography and selective yellow emphasis replace the earlier wireframe treatment. Yellow identifies the primary decision, active navigation, edit affordances and recommended Punts. Actions use pill-shaped buttons. Fields and document surfaces use softer but distinct geometry. Supporting text retains contrast.

Primary navigation is **Review, Punts, Pipeline, Career, More**. These are revised labels over the existing destinations; they do not remove candidate scope. Setup uses four visible stages: documents, profile, pathways and CVs. Profile sections disclose details in place. A CV opened from a Punt returns to that Punt. Brief navigation motion respects reduced-motion preferences.

Google and Apple are interaction-quality references, not instructions to copy their branding, introduce their component libraries or replace JobPunter's existing frontend technology.

## Editing and approval contract

Every generated candidate record must offer a visible, accessible pencil action. The current upgrade applies this pattern to the assembled profile, pathway rationale and gap descriptions, CVs, tailored CVs, cover letters, application answers, fit assessments, evidence summaries, extracted details, interview questions, feedback, scores and proposed interview-event details. Existing detailed editors remain available.

The profile covers personal information, experience, education, projects and other work, achievements, skills/methods/resources, links and supporting evidence. Candidate amendments must appear in subsequent profile-derived drafts.

Saving is distinct from approving. Saving a change creates a draft revision; the prior version and original suggestion remain available. Profile and pathway approval cover their reviewed records together. Each CV, adaptation, letter and answer still has its own approval. Unchanged accepted documents are not repeatedly sent through an editor.

Profile or pathway changes invalidate dependent readiness. A stale CV cannot be accepted until its source is reviewed and it is refreshed. Refreshing preserves version history. A CV amendment does not silently update the underlying profile. Approved packages cannot silently include changed, unapproved content.

Editing an evidence-gap description does not erase the original flag. Risk acceptance remains a distinct, reasoned decision. Candidate revisions to feedback or scores are retained with the original generated assessment; approval does not make a claim independently verified or recalculate an assessment engine result.

The editing controls in the preview are local simulations. Production must persist these relationships, revision histories, exact-version approvals and freshness checks through verified contracts. Rendering a pencil icon alone does not satisfy the requirement.

## Discovery work queue — checked against PRD v1.6

The added request is incorporated without replacing the current refinement. PRD section 12 explicitly lists eight acquisition modes; section 52.1 defines authorized email processing. All must converge into the same Job Pool and source history.

| PRD path | Candidate route | Current upgrade / next depth of work |
|---|---|---|
| Quick Match | Punts → Discovery & imports → Quick Match | Existing immediate-run path retained; confirm real scope and outcome against discovery contracts. |
| Scheduled Daily Match | Discovery → Scheduled matching | Existing schedule editor retained; review timezone, scope, approval, pause/cancel and actual run history. |
| Scheduled Weekly Match | Same schedule editor | Preserve day/time selection and historical run configuration. |
| Manual URL | Discovery → Add an opportunity → Posting URL | Retain retrieval and pasted-description fallback; add fuller success/restricted-source states during integration work. |
| Manual JD | Add an opportunity → Job description | Retain role, organisation and full-description entry. |
| Manual Email | Add an opportunity → Email or digest | Retain pasted alert/recruiter-message parsing and per-opportunity review without granting mailbox access. |
| Automated Email Alerts | Discovery → Collect email alerts | Upgraded existing connection screen: Gmail consent explanation, alert-label/sender/subject filters, lookback and explicit approval of a collection run. Next: review ongoing collection approval, pause/resume, renewal and recovery in greater depth. |
| Permitted APIs and feeds | Discovery → Sources and coverage | Retain candidate-visible coverage/health. Protected connector configuration remains in the desktop admin workspace. |

Manual search and filters remain in the Job Pool. Search of collected opportunities must be distinguished from a new acquisition/matching run. A new discovery entry is available directly from the primary Punts view.

Email requirements retained from the PRD: single-job alerts, multi-job digests, recruiter messages, duplicate emails, changed alerts, irrelevant content and source message identifiers. Partial or incomplete extraction must not discard other valid opportunities. A duplicate links source provenance to the existing job. Extracted job information remains reviewable before downstream matching and packaging.

Gmail is the PRD's preferred architectural direction, subject to actual authorization and feasibility. Google sign-in is not mailbox consent. Collection filters do not imply narrower provider OAuth permissions. Other providers must not be represented as implemented without verified support. Connected, available, degraded, restricted and last-success states must remain distinct. The upgraded preview does not connect to or read a mailbox.

## Verification and remaining boundaries

The original connected journey and all 96 screen identifiers are retained. Browser checks cover the upload-to-application journey, narrow layouts, profile editing, retained originals, profile changes flowing into a CV, approval invalidation, versioned refresh, contextual return navigation and pencil controls. The source PRD is reference material and was not modified.

This remains an interaction/design preview. No real parsing, AI generation, mailbox processing, document delivery, application submission or scoring is claimed. Repository implementation, real contract wiring and candidate usability testing remain subsequent work.
