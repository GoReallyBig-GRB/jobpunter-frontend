> Latest design evaluation (17 November): [five-question standard and contextual CV workflow](13-screen-evaluation-and-contextual-cv.md), with [all-screen acceptance register](14-screen-acceptance-register.md). The updated preview contains 124 views.

> Latest direction: [Results, paper layout and ongoing assistance](11-results-cv-layout-and-assisted-operation.md) supersedes conflicting details below. No-CV flow gives next steps only; CV-based fit analysis uses the existing results. Current preview: 117 views.

> Correction: [Optional-CV first application](10-first-application-optional-cv.md) supersedes any CV upload gate below. Continue searching or proceed to risk-aware handoff without a CV; guided CV creation is an alternative. Current preview: 116 views.

> Latest update: [Search, Home and rich CV backend brief](09-search-home-and-rich-cv-backend-brief.md) governs first-search CV progression, generated Master CV approval and rich-document editing. Current prototype: 113 retained-and-expanded views.

> Update — 16 November 2026: see [progressive onboarding](07-progressive-onboarding.md) and [discovery curation](08-discovery-curation-and-provenance.md). The current prototype has 112 views and a Home-first footer. Initial filter-qualified discovery and reviewed-CV matching can precede full career setup. Raw alerts are curated before candidate review. Earlier conflicting prerequisites and navigation below are historical.

# jobpunter assisted workflow prototype review

Latest extension retains the original 96 views and adds seven, for **103 views**: visual CV editor, external rework, sample comparison, global search, confirmed stage move, email activity and email-event review. See [CV/discovery/pipeline/email readiness](06-cv-discovery-pipeline-and-email-readiness.md). Footer order is **Career, Review, Punts, Pipeline, More**; earlier ordering and two-column Kanban notes below are historical.

Current terminology and opportunity semantics: [Career Pathways, CV Variants, Job Pool and Punts](05-product-vocabulary-and-opportunity-model.md). The candidate Job Pool is the viable, pathway-relevant collection; Punts are its strongest application recommendations.

Updated in place: see [Application refinement and work queue](04-application-refinement-and-work-queue.md) for the current application copy, top-left branding, pencil editing, approval/freshness behavior and discovery additions. All 96 screens below remain. Current navigation labels are Review, Punts, Pipeline, Career and More.

16 November 2026 · Approval-led assistance and pill-button refinement

## Current review direction

The current review surface starts with uploaded CV/Master Profile materials and follows the product-owner clarification in `01-assisted-candidate-workflow.md`. It replaces the previous form/tool-first primary journey. Existing frontend architecture and technology stay; no production frontend or backend files were changed. Supplied artwork and black/yellow/white direction remain. The old frontend UI remains concept reference only.

Primary navigation is Approvals, Punts, Pipeline, Career and System. Evidence/Health, full Job Pool, manual intake and detailed record editors remain accessible as supporting tools. They do not become routine clerical tasks required to obtain a prepared profile, CV Variant or application.

The review contains 25 assistance-focused views, alongside the earlier detailed reference tools. Screen count is not a completion metric. The main question is how much work the system removes while preserving informed, recorded candidate control.

## Connected assistance views

| Stage | Review surfaces | Candidate workload being reduced |
|---|---|---|
| Source-led setup | Upload materials, assembled profile review, Approval Desk | Re-entering personal details, education, experience, prior work, achievements, evidence, other work and links |
| Career Pathways | Four initial suggestions, pathway support/risk review, custom pathway | Inventing directions without support analysis or being forced into four pathways |
| CV Variants | Bounded drafting plan, CV Variant list, full CV review/amendment/acceptance | Creating structured professional variants manually or repeatedly selecting evidence before receiving a useful draft |
| Ranked Punts | Approved matching plan, ranked shortlist, pathway/CV-linked Punt workspace | Manual job searching, ranking and repetitive source-CV selection |
| Optional tailoring | JD adaptation plan/review, cover-letter review, delivery package | Rewriting CVs/letters by hand and changing the source CV Variant unnecessarily |
| Portal assistance | Manual handoff, actual questions, evidence-based answer review | Drafting answers from scratch or losing job/profile context in generic chat |
| Monitoring/pipeline | Opportunity record, reflowed Kanban, confirmed event form, monitoring proposal | Chasing updates without source context or treating speculative events as completed actions |
| Interview practice | Opportunity-specific plan, practice answer, rubric feedback | Preparing disconnected generic answers without the candidate's actual evidence or the job requirements |

Four pathways are suggested initially, not required and not a maximum. The review can proceed with one accepted CV Variant. A fifth custom pathway can be added. New-pathway drafting leaves existing accepted CVs intact rather than forcing repeat generation and acceptance.

## Approval and evidence behavior

Each system operation is represented as a bounded candidate-approved action; internal substeps do not generate needless repeat approvals. Output acceptance remains separate. A CV Variant, adaptation, cover letter, answer and package have explicit version acceptance. Pending approval is never inferred from elapsed time or navigation.

Insufficient evidence can receive clear risk acceptance with a reason and retained flag. That acceptance is scoped to the pathway/profile context in the example and must become a real versioned backend policy. It does not create a fact or qualification. The current backend qualification/readiness rules still require reconciliation with this product decision.

The Punt arrives with the selected pathway and accepted CV. Optional adaptation preserves the source CV. A package can use the CV Variant without adaptation or a cover letter. Actual pasted portal questions stay in the same Punt, need answer review/approval and are not submitted by the app.

After actual manual submission, monitoring scope and a source-backed interview-event proposal need separate approval. The opportunity record retains progression and reasons through Won/Lost. Existing outcomes cannot be rolled back merely by approving another materials package.

## Additional visual direction

Primary and secondary action buttons use pill geometry where appropriate, including bounded drafting approvals, pathway/CV acceptance, adaptation, package actions and practice controls. Back links retain link behavior; fields and cards retain restrained rectangular structure. This applies the user's additional direction without changing the core workflow or supplied identity.

## Verification and limits

The browser review exercised all 96 available assistance/reference views at 320, 390 and 736 CSS pixels (288 combinations), with no document-level horizontal overflow detected. The opportunity board also reflows at those widths. Source upload, Kanban and practice-feedback screenshots were visually inspected. Main action button geometry was checked as pill-shaped.

The connected journey exercises upload/assembly approval → two pathways including reasoned evidence-risk acceptance → AI-draft simulation → CV Variant amendment/acceptance → approved matching → optional adaptation/cover letter → package → actual-question assistance → manual submission confirmation → monitoring approval → interview invitation → practice → offer/Won. Negative checks cover no mandatory four-pathway gate, retained evidence flags, answer approval before copy, source CV preservation and no lifecycle rollback after a terminal outcome. Additional checks cover a fifth custom pathway, no needless regeneration of an existing accepted CV, and a package using one CV Variant without mandatory adaptation/cover letter.

All files, candidates, jobs, CVs, observations and outputs are fictional. No uploaded file/link is read, no AI/provider/mailbox is contacted, no clipboard/file delivery is claimed, no message is sent and no employer application is submitted. Interview scores are explicitly illustrative and are not an assessment of the typed answer. The prototype simulates review flows; real scoring, monitoring, approval authority, versions, waivers and persistence require the contracts in `02-assistance-and-approval-contracts.md`.

These checks do not establish actual usability, accessibility conformance, production integration or automated hiring performance. Candidate testing should focus on effort reduction, understanding of decisions/risks, amendment burden and trust in the distinction between prepared, approved and actually submitted work.
