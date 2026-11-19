# Automated discovery curation and source visibility

Updated 16 November 2026. This requirement is part of the active frontend work queue and governs email, manual and system discovery alike.

## Candidate experience

Approved discovery scope → collect openings → split multi-job messages → resolve original listings where possible → normalize and deduplicate → assess viability and fit → place credible opportunities in the candidate Job Pool → recommend strongest matches as Punts.

Do not ask candidates to review every raw email or extracted vacancy. A noisy alert stream must not become a noisy Review Queue. Request attention only for a promising opportunity where unresolved information materially affects a decision and cannot be resolved from available sources. Aggregate low-value failures in activity; allow inspection without making it compulsory.

Within completed setup, viability includes selected Career Pathways and constraints. During initial onboarding, visibly distinguish filter-qualified provisional results from reviewed-CV matches and fully assessed recommendations. Never describe a strong match as guaranteed employment.

## Discovery path language

| Discovery route | Candidate-facing label |
|---|---|
| Authorized mailbox collection | Email alert |
| Candidate submits a URL | Job link |
| Candidate pastes email content | Pasted email |
| Candidate pastes/shared WhatsApp content | WhatsApp message |
| Candidate copies a board listing | Job board listing |
| Other pasted description | Pasted description |
| Candidate initiates global search | Job search |
| Approved recurring acquisition | Scheduled search |
| Background discovery across authorized sources | Automated discovery |
| AI-assisted discovery agent | AI-assisted search |
| Job-board acquisition, including JobSpy or Scrapy-backed collection | Job board |
| Employer vacancy feed, including Greenhouse-backed collection | Employer careers |

All viable backend discoveries and connected-source results feed the same candidate Job Pool after assessment. Do not build a separate system-job collection. The route badge and source name answer different questions: for example, Automated discovery · Employer careers, with the employer posting visible in details. JobSpy, Scrapy, Greenhouse adapter IDs, agent execution IDs and worker names remain internal provenance for diagnostics; they are not candidate-facing machinery. Use AI-assisted search only when that was genuinely the acquisition route, not merely because AI later evaluated a job. A scheduled worker must not overwrite the original source route; Scheduled search may describe the discovery trigger alongside Job board or Employer careers.

Every opportunity card and detail should show its discovery path. Keep the original publisher/posting and application destination separate. One canonical vacancy can have multiple discovery events: show the primary route and expandable additional sources, without adding duplicate opportunities. Preserve timestamps and original provenance when reprocessing or correcting a source. Do not invent provenance for migrated jobs; use Source not recorded pending reconciliation.

WhatsApp message describes candidate-supplied content, not an implemented WhatsApp integration. Avoid provider, connector, queue and model names in candidate opportunity copy. Candidate-facing health remains understandable: last checked, delayed, reconnect needed, or needs attention, with no false connected/success state.

## Work queue and acceptance gates

1. Complete common provenance presentation for every opportunity surface, including pipeline and package context, with actual per-record data. Current preview adds labels to primary Pool/Punt/detail and sample scheduled-result views.
2. Implement one canonical vacancy with multiple immutable discovery events and candidate-specific assessments. Deduplication must retain all origins and must not merge materially different vacancies solely by title.
3. Process multi-job alerts in approved batches; partial failures must not discard valid jobs or flood candidate review. Retry idempotently and preserve source history.
4. Validate hard constraints, expiry, source credibility and evidence-backed fit before promotion; provide reasons for viable versus recommended status. Unassessable jobs remain outside the curated pool.
5. Integrate Gmail through real authorization, scoped reading, incremental sync, retries and recovery. The existing paste parser is not a mailbox connector. Keep the current unavailable state until service behavior is verified.
6. Correlate interview invitations and other application messages with the correct application, retain ambiguity and require approval for proposed pipeline changes. Discovery curation and application-event review are different workflows.
7. Verify repeated alerts, multiple links per digest, malformed content, inaccessible postings, stale/closed jobs, mixed viable/unsuitable batches, duplicate paths, missing metadata and uncertain application matches.

Preview limitation: processing buttons show explicitly labeled sample outcomes. No real mailbox, pasted content, job source or live scoring is processed. New source choice on pasted descriptions describes the example import; it is not proof of successful extraction.
