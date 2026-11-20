> Update — 16 November 2026: see [progressive onboarding](07-progressive-onboarding.md) and [discovery curation](08-discovery-curation-and-provenance.md). The current prototype has 112 views and a Home-first footer. Initial filter-qualified discovery and reviewed-CV matching can precede full career setup. Raw alerts are curated before candidate review. Earlier conflicting prerequisites and navigation below are historical.

# JobPunter vocabulary and opportunity model

16 November 2026 · Governing clarification for the candidate interface

## Career Profile → Career Pathways → CV Variants

**Master Career Profile** is the candidate's reviewed factual record and supporting evidence.

**Career Pathways** are selected, candidate-approved directions for matching. “Job lanes” is an explanatory concept, not the interface label. PRD section 8 specifies role family, target roles/seniority, domains, evidence, gaps, rationale, confidence, origin and candidate approval. Suggestions do not become active targets until approved. Four initial suggestions are useful, not mandatory and not a maximum.

**CV Variant** is the explicit interface term for a professional presentation of the approved profile for a Career Pathway. Replace “lane CV”, “frontline CV” and similar invented labels. Each variant is fully readable, editable and approved by exact version. PRD section 11.2 supports pathway, evidence emphasis, terminology, selected experience and source relationships. A job-specific adaptation creates a separate reviewed version without silently changing the source variant or Master Career Profile.

Use “Career Pathways”, “Review pathway”, “CV Variants”, “Review CV Variant”, “Tailor CV Variant” and “Approve CV Variant” consistently. Internal prototype route/state identifiers are unchanged to preserve continuity; they are not product terminology or a request to rename verified backend contracts.

## Candidate Job Pool

The candidate's **Job Pool** is the collection of viable jobs within their selected Career Pathways. Every viable discovery feeds it, regardless of acquisition channel. The interface must not present the entire acquisition catalogue, an unresolved digest item or a rejected match as part of this collection.

Eligibility for the candidate view needs a current candidate-specific decision about pathway relevance, evidence, constraints and viability. Preserve the source, description, source freshness, assessment version and any explicitly accepted uncertainty. An amendment to a pathway, constraint or factual profile can require reassessment. A formerly viable opportunity that becomes stale or unresolved must show its changed state and leave the current viable collection until resolved; its history must remain available.

**Punts** are the strongest, sufficiently supported matches in that Job Pool which JobPunter recommends for application. Every Punt is a viable opportunity, but not every viable opportunity is a Punt. Its card should explain the recommendation, name the selected Career Pathway and attach the most suitable approved CV Variant. Recommendation does not mean submission; applying remains the candidate's action at the employer portal.

“Sure fit” describes confidence in the evidence-based match, not an assured interview, job offer or hiring outcome. Do not introduce an arbitrary score cutoff as if it came from the PRD. The actual qualification and prioritisation rules require verified product/backend contracts.

## Relationship to the PRD's canonical repository

PRD section 14 describes a shared canonical job repository and prohibits duplicating a vacancy for each candidate. The latest product-owner clarification defines the **candidate-facing collection**, not a separate physical job repository.

Keep one canonical vacancy and its source records. Candidate-specific evaluations and approved pathways determine membership in the candidate's Job Pool and its Punt subset. The same vacancy can be viable for one candidate, a Punt for another, and unsuitable for a third without duplicating the job or sharing private candidate assessments.

PRD section 17 distinguishes APPLY, REVIEW, WATCH and REJECT from application lifecycle state. Section 19's Review Queue remains a filtered view of canonical records requiring attention, with candidate-specific decisions. It must not imply that every queued discovery has already passed the candidate Job Pool viability gate.

## Discovery flow

1. Acquire through Quick Match, daily/weekly matching, a posting URL, a full job description, pasted email, an authorized email connection, or a permitted API/feed.
2. Split multi-job content; preserve raw source and message identity; normalize, deduplicate and retrieve/check the actual description.
3. Evaluate against selected Career Pathways, approved profile/evidence and constraints.
4. Add viable opportunities to the candidate Job Pool. Keep unresolved discoveries in review; preserve unsuitable results in history rather than presenting them as viable.
5. Recommend the strongest qualifying matches as Punts, with a suitable approved CV Variant ready.
6. On the candidate's approval, prepare/adapt the application package. Record actual manual submission separately.

Duplicate discovery adds provenance to the existing job. An incomplete or changed email item must not discard other valid items. A source connection is distinct from successful collection, and successful collection is distinct from candidate viability or a Punt recommendation.

## Current prototype changes

All existing screens and routes remain. Candidate copy now uses Career Pathways and CV Variant. The Job Pool distinguishes a recommended Punt from another viable opportunity; the unresolved records-role example remains in the Review Queue. Discovery results explain why incomplete content has not entered the candidate Job Pool. Punts are described as the strongest application recommendations rather than every discovered or merely relevant job.

This document takes precedence over older design shorthand about a candidate seeing the entire “canonical pool”. It does not silently alter the backend schema or claim that real evaluation/pool-membership contracts are already implemented.
