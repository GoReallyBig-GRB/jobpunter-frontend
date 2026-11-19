# Central job discovery — governing decision, 19 November 2026

This explicit product decision supersedes earlier PRD/UI proposals for candidate-triggered external/global source searches.

- JobPunter maintains a shared central collection of processed opportunities, refreshed hourly by backend-owned ingestion and processing.
- Every candidate search, including first-time, Discover/global search, Quick Match and scheduled recommendations, reads this collection. Candidate requests must never dispatch external source searches or configure acquisition connectors.
- A candidate Job Pool is a private, filtered/matched view of eligible central opportunities. Shared job validity/completeness is separate from candidate-specific fit; no CV means fit is pending, not that the job is unprocessed.
- Personal CV, evidence, assessments, preferences, Watch/Reject and application state remain candidate-private. Do not copy these into shared job records.
- Backend/admin owns source credentials, permissions, crawler/API jobs, refresh cadence, retries and source health. Candidate UI exposes no connector-management or source-run repair controls.
- Central refresh is hourly; candidate recommendation timing is a separate approved preference. Refresh must be idempotent, deduplicate identities, preserve provenance, remove/flag expired opportunities and invalidate outdated assessments.
- Search supports keywords, location, employment/working arrangement, pathway fit and cursor pagination over stable opportunity versions. Returning candidates search their own pool or discover additional eligible opportunities. Neither action fans out to external providers.
- Keep provenance (Found via) as candidate-useful history without exposing connector/worker details.
- Previously authorized URL/JD/email intake remains an explicit submission-for-processing path, not an external search. Submitted records require normalization, deduplication and viability checks before searchable admission. Mailbox consent remains separate from backend acquisition configuration; private email content must not become shared job content without a defined sanitization/publication policy.
- UI copy must NOT explain the central pool, hourly refresh or backend architecture. Use plain labels: Find jobs, Your opportunities, Search your Job Pool, Schedule recommendations.
- Pool filtering has one submit action: Search pool. Clear filters resets criteria. No separate Apply filters action.

## Current delivery boundary
The design prototype uses a preprocessed fixture collection for both first-time and Discover searches. It does not implement live search APIs, hourly ingestion, persistence or backend migration. Production backend contracts require alignment with the above model before integration. No production repositories were modified for this UI change.
