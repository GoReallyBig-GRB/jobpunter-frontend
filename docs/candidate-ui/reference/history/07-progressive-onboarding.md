> Correction: [Optional-CV first application](10-first-application-optional-cv.md) supersedes any CV upload gate below. Continue searching or proceed to risk-aware handoff without a CV; guided CV creation is an alternative. Current preview: 116 views.

> Latest update: [Search, Home and rich CV backend brief](09-search-home-and-rich-cv-backend-brief.md) governs first-search CV progression, generated Master CV approval and rich-document editing. Current prototype: 113 retained-and-expanded views.

# Progressive candidate onboarding

Updated 16 November 2026. Explicit candidate decisions in this conversation supersede earlier prerequisites and navigation recommendations. Preserve the existing frontend technology and architecture; the legacy UI is a concept reference only.

## First useful outcome

Welcome → name and Gmail account setup → Home global search → filter-qualified Job Pool → quick CV upload and review → CV-based matching → recommended Punt → approved tailored CV and optional cover letter → employer portal → candidate records manual submission → pipeline and next-step guidance.

Home provides global search, current activity, application status, notifications, help and contextual shortcuts. Footer order is Home, Career, Review, Punts, Pipeline, More, preserving the requested relative order of the existing tabs.

Search separates position, location, employment type and work arrangement. Searching the existing Job Pool only filters collected jobs. Global search acquires new discoveries. Before career setup, filter-qualified results are explicitly provisional: filter fit does not establish personal suitability. A reviewed CV enables initial matching without falsely approving a Master Career Profile, Career Pathways or CV Variants.

## Four progressive phases

1. Add a CV and optional supporting documents. Use a single CV picker and a separate multiple-document picker.
2. Review and complete the Master Career Profile, background, education, evidence, preferences and constraints.
3. Review, amend and approve suggested Career Pathways or create custom pathways. Four is a useful breadth suggestion, not a minimum.
4. Review, edit and approve the CV Variant for each selected Career Pathway.

Keep applications available throughout incomplete onboarding. Present one next incomplete phase after a scheduled update; allow Not now and access through Career. Do not silently approve generated facts. Profile and document edits retain history and invalidate affected approvals.

## Scheduling and approval boundaries

Offer morning updates, every 24 hours from approval, chosen daily time and weekly schedules with timezone. Scheduling requires explicit consent to a bounded source and search-filter snapshot. A reviewed CV can support this before full setup. Completed career setup is an explicit later context choice, never an automatic expansion of consent. Context changes require review and renewed schedule approval. Pause, resume and cancel remain accessible.

Candidate approval covers the scoped processing batch or recurring discovery action; it must not become repetitive approval of every raw opening. Generated candidate documents, evidence claims and application packages retain separate approval. JobPunter never submits applications on the candidate’s behalf.

## Content and implementation gates

Use benefit-led copy instead of the proposed 85% and 90% success statistics: those claims have no supplied supporting evidence. Do not promise ATS success or employment outcomes.

The interactive design now contains 112 views, retaining all previous 103. It demonstrates local sample journeys only. Account creation, uploaded-file parsing, external job search, AI matching and background schedules are not live services. Google account sign-in does not grant permission to read Gmail.

Production integration needs a reviewed uploaded-CV source contract for initial matching and packaging, distinct from approved full-profile/CV-Variant prerequisites. Persist onboarding completion, exact approved source versions, schedule/filter snapshots, timezone, cancellation and deduplicated delivery. Backend support must be verified before wiring the interface.

Screen-to-integration additions: Welcome/account → identity service; Home/global search → acquisition query and run state; provisional Pool → candidate collection and fit status; quick CV → import, review/version and match run; first application → existing approved package plus manual submission event; setup progress → four persisted completion predicates; schedule/digest → bounded consent, scheduler and recommendation run outcomes.
