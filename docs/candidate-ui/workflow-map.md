# Candidate workflow and existing API map

Paths are under `/api/v1`. Verify against the current backend revision before implementation. Existing routes below are evidence of code, not proof of deployed availability. Proposed behavior in acceptance criteria is not an invented existing endpoint.

| Journey / demo area | Existing operations | Ownership and remaining work | Gap IDs |
|---|---|---|---|
| Sign in / Home | Firebase-backed principal; notifications; applications; support lists | Candidate identity, truthful aggregated stats; never reuse demo account | 005,008 |
| First search / Discover | GET `/candidate/jobs/pool`; POST `/candidate/discovery/missions` | Shared processed jobs vs private match; mission currently acquires, so do not blindly wire it | 001,002 |
| URL/JD/email intake | POST `/candidate/jobs/manual-ingestion`; POST `/email/parse-job-alert` | Submitted private content, normalize/dedupe; parser alone is not persisted ingestion | 001,002 |
| Schedule recommendations | GET/PUT `/candidate/discovery/settings`; missions | Private candidate cadence, independent central refresh | 001 |
| Personal Job Pool | GET `/candidate/opportunities`; canonical pool/detail | Latest private assessment, full filters/counts, stable paging and provenance | 002 |
| Punts / Watch / Reject | GET/POST `/candidate/punts`; `/candidate/evaluations/{id}/overrides`; GET/PUT/DELETE saved jobs | Preserve recommendation versus disposition versus actual submission | 005,009 |
| Career profile / evidence | GET/PATCH `/candidate/profile`; evidence and claims review routes | Candidate-owned facts, provenance, revision and approval | 008 |
| Upload / questionnaire | `/candidate/document-imports` parse/extract-fields/preview/identify-conflicts/confirm/save | Convert accepted data to career source; no unsupported facts | 008 |
| Pathways | `/candidate/career-pathways` suggestions, edit, approve/reject/retire | Candidate-owned and reviewed evidence-supported directions | 008 |
| CV Studio | `/candidate/cvs/master/regenerate`, variants, versions, approve, documents/download | Exact source/version; save and approve are separate operations | 007,008 |
| Apply / preparation | POST `/candidate/applications` | Currently requires punt_id; preserve context for non-Punt and no-CV journeys | 003,008 |
| Package / Q&A / review | `/candidate/applications/{id}/packages`, revisions, validate-claims, prepare-review, review-decision, documents/download | Immutable package/JD/evidence basis; candidate approves exact revision | 007,008 |
| Pipeline | applications list, `{id}/transition`, `{id}/events` | Per application, revision guarded; reconcile invitation and terminal mappings | 004 |
| Email alerts / monitoring | Pasted email parser; outbound notifications | No reviewed personal mailbox workflow equivalent; separate scopes from sign-in | 006 |
| Interview practice / score | No equivalent candidate session routes found in baseline | Persist attempts, score interpretation, repeat/end and login reminders | 006 |
| Notifications / support | notifications/read/email-preferences; support tickets/messages/status | Per user; new watch/interview event producers required | 005,006 |

Numbers in the last column abbreviate CUI-001 etc. Application questions are package artifacts (`application_q_and_a`), not a separate generic chat. Admin requirement-review endpoints are not candidate Review Queue endpoints. The UI Review Queue must assemble only authorized candidate review items.
