# Consolidated approved candidate requirements

## Authority and superseded proposals

This consolidates the user's decisions through 19 November 2026. Older requirements for candidate-triggered internet acquisition and candidate connector/source-health management are superseded. Older two-row footers, single-column mobile cluster fallbacks, outer cluster containers, separate Apply filters buttons and one-sided-border cards are superseded. Historical pipeline vocabulary is not an approved backend mapping; CUI-004 must reconcile it explicitly.

## R01 — Search and discovery

All first-time, Discover/global, quick and scheduled searches fetch already processed opportunities from JobPunter's central inventory. Independent backend acquisition refreshes hourly. Candidate preferences affect matching/recommendation timing, not connector setup. These implementation details must NOT appear in candidate UI copy. Use Find opportunities, Find jobs and Schedule recommendations.

Discover starts with a collapsed search button and arrow, opening the full search panel. Below it, use small icon cards for URL, pasted JD (optional URL and source), pasted email/alert, separately authorized personal email alerts and scheduling. A submitted item enters processing/deduplication; it is not instantly a proven match. Preserve candidate-useful source provenance without exposing connector operations. Keywords are comma-separated; show this helper text.

## R02 — Job Pool

Show already processed, current viable candidate opportunities first, newest first. Initially show a bounded set and append more vertically; the opportunity list must not collapse to nothing. Show truthful viable/Punt counts and a link to Punts. Each job has facts, fit strengths, gaps and career-evidence basis. Non-Punts support Review, Watch, Apply and Reject; applying does not automatically make one a Punt.

Local pool search finds records already in the candidate pool. Collapse the search panel behind a consistently styled arrow button. Filters cover recency, career pathway, source, arrangement, employment type and candidate choice. Clear filters sits beside Filters; Search pool is the sole primary submit action at the bottom when expanded. There is no Apply filters button. Counts/filtering must cover the full dataset.

## R03 — First-time and returning journeys

First search → review results → add/upload or create CV → approve career source → match retained results → prepare selected application. Do not run a new search just because a CV was approved. Before CV/evidence exists, personal fit remains pending. Users can review job facts/application instructions, but cannot receive invented tailored documents. Keep the selected opportunity visible through an expandable View this job's details control while CV work is pending.

Explain next steps gradually in compact cards: search/review/match, CV and cover letter preparation, package review, manual submission and tracking. Returning users receive concise continuation language. Do not repeat first-time instructions on every visit. Home supplies truthful stats, next-action banner, attention/update summaries, pipeline/support links, recent activity and quick-access cards.

## R04 — Career evidence, pathways and CVs

Support CV upload, multiple supporting documents and guided creation covering personal details, eligibility, experience, projects, achievements, education, skills and links. Mark required fields with exactly one asterisk, keep optional labels explicit and dates understandable. Expandable sections use visible button/arrow styling. Review extracted facts and resolve conflicts before treating them as approved evidence.

Master Career Profile is the factual source. Generate a Master CV and evidence-supported Career Pathways/CV Variants; do not force four pathways. Candidate can edit and approve generated content. Insufficient-evidence risk is distinct from deterministic eligibility blockers. Preserve evidence/provenance and exact versions; changes invalidate dependent assessments as appropriate.

## R05 — Preparation and documents

Tailor an approved CV to the selected job using supported evidence and relevant terminology, with no fabricated claims or promised ATS success. Offer an optional cover letter and contextual application-answer assistance. Keep source CV/JD/evidence versions and candidate approval. Answers are editable with evidence, confidence and unsupported-claim warnings.

Use an editable rich document model with A4 preview and mobile reading. Preserve formatting through saving and DOCX/PDF export. Save and approve should shorten the visible flow while reporting partial failures truthfully. Retain older approved versions. Candidate reviews the exact package before manual employer submission; approval is not submission.

## R06 — Punts and watch history

Punts is a distinct premium recommendation workspace, not a copy of Job Pool. Show a timezone-correct daily caption (e.g. You have 4 new Punts today) and strongest-match cards with Review, Apply, Watch and Reject. Provide new/all/watched/applied/rejected history without deleting original recommendations/evidence. Applied means actual submission recorded by the candidate.

Watch saves a Punt. At fresh login aggregate eligible watched Punts into one reminder. Each Punt stops contributing after 14 days without meaningful action; retain the saved record. Login or merely viewing the reminder does not reset inactivity. Unwatch/reject/submission stops reminders immediately. Persist and deduplicate across sessions/devices.

## R07 — Pipeline and interviews

Track each application's actual events separately. Distinguish submitted, interview invited, interview, offer and terminal outcomes; reconcile Screening/Archived and the backend enums under CUI-004. The stage header/count expands to show opportunities; the Choose a stage control inside an opportunity moves that opportunity. Every transition records actor, time, old/new state and reason.

Mailbox monitoring requires separate consent from sign-in; suggested employer events need candidate review before acceptance. Interview buttons read Open interview preparation and Begin preparation. Practice ends with Check your score → percentage and interpretation → Repeat the test / End preparation. Ending saves results. Unfinished practice receives up to two fresh-login reminders offering Finish or End preparation, then becomes abandoned if unresolved. Exact post-second-reminder timing must be agreed and recorded; do not invent it silently. Demo self-review percentages are not live AI scoring.

## R08 — Visual and responsive rules

Mobile-first black/charcoal surfaces, brand yellow #e8ff00, tinted yellow eyebrows and pill actions. Small card clusters ALWAYS remain two columns, even at 320px: optimize padding/type/wrapping. Each small card has a glowing yellow border, tinted background, yellow icon, title and subtitle. Remove outer cluster containers. Three Home statistic cards have no icons. Home notification/pipeline/support/activity action buttons have no redundant icons; section icons can remain.

Use full bordered/tinted or glowing cards to separate sections; do not introduce single-left-border cards. Keep normal word wrapping and visible expand/collapse controls. Footer is one horizontally swipeable row: Home, Career, Review, Job Pool, Discover, Punts, Pipeline, More. Avoid hiding tabs in a second row. Preserve the approved logo and coherent action hierarchy.

## R09 — Production acceptance

Use authenticated persisted state, ownership checks, authoritative counts, immutable approval history, revision conflict handling and recoverable loading/empty/error states. Do not port fixture scoring or global single-application state. Validate two independent applications, retained results after CV approval, a no-CV user, stale evidence and second-device resume. Preserve the existing frontend stack; live provider/deployment claims require separate evidence.
