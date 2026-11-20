# CV editing, discovery, pipeline and email readiness

16 November 2026 · Upgrade to the existing candidate design

## Preserved design and navigation

Keep the approved visual treatment and existing screens. Footer order is **Career → Review → Punts → Pipeline → More**. “More” contains the remaining candidate settings and tools, not an admin control plane.

## Tailoring a CV Variant

The principal purpose is to align a CV Variant with the **actual job description's language and keywords** and improve document readability for ATS parsing. Reordering content is one technique, not the whole purpose. Use relevant terminology only where supported by approved evidence. Avoid keyword stuffing, invisible text, invented credentials and unsupported achievement claims. Do not promise an ATS score, shortlist or hiring result.

Bind each tailoring operation to candidate, Career Pathway, approved source CV Variant/version, actual job/JD version and approved factual/evidence versions. Show supported keywords, terminology requiring review, factual changes and document-structure findings separately. Changes to any source invalidate the comparison where applicable.

### WYSIWYG and external rework

- The candidate edits a readable, formatted document with headings, paragraphs, emphasis and lists; a plain textarea is not the primary CV editor.
- Save creates a draft revision with document structure and prior versions retained. Approval remains a separate candidate decision.
- Production must use a maintained structured editor compatible with the existing frontend stack, with schema validation, paste sanitization, accessible keyboard operation, mobile selection/IME support, undo/redo and reliable export parity. The preview's formatting interaction is not a production editor-library selection.
- External rework follows download → off-app edit → upload → parse → compare → resolve → draft → approval. Preserve the original uploaded file and a safe parsed representation.
- Every upload comparison is bound to the **existing CV Variant and the actual target JD**, not just a generic profile or a filename. Do not overwrite an approved variant on upload.
- Show added/removed/changed content, changed dates/employers/credentials/metrics, evidence discrepancies, relevant JD terms, parse failures, reading order and formatting issues. Keep factual consistency separate from keyword coverage and presentation.
- Unsupported claims need removal or reviewed supporting evidence. A disclosed risk override does not fabricate a fact. Low-confidence extraction or incomplete scanning remains pending, not “passed”.
- Production acceptance requires real DOCX/PDF parsing and checks against persisted version identifiers/checksums. The current upload preview explicitly does not read or scan selected files; its sample comparison is labelled separately and cannot certify an uploaded file.

## Search scopes

**Search Job Pool** searches the candidate's existing curated viable collection. It does not acquire jobs from outside that collection.

**Global opportunity search** discovers jobs beyond that collection through available permitted sources. It has query, location, Career Pathway and source/run scope. Quick Match is a saved-preferences discovery/evaluation run; scheduled discovery is a separately approved recurring action.

Every viable, selected-pathway-relevant global discovery enters the candidate Job Pool, with processing/recommendation state visible. Only the strongest qualifying recommendations become Punts. Incomplete discoveries remain in review; duplicates add provenance to the existing job. Report partial source failure without discarding useful results. A global search is not a promise to search every site on the internet.

## Pipeline board and list

Use a true stage board: **Applied → Interview invited → Interview → Offer → Won / Lost**. The last two are alternative outcomes, not a mandatory sequence. Preserve Screening and Withdrawn where required by the product/state model.

On mobile, stage columns scroll horizontally and stage buttons jump to a column. On desktop, cards can be dragged between columns. Every card also offers **Move**, which works by touch and keyboard. A move opens a confirmation with the current stage, target stage and event reason. Dropping a card does not silently commit a lifecycle change.

The alternative List shows each opportunity and its stages, with an explicit action to mark a stage. Both views operate on the same record and history. An email proposal uses the same confirmation/transition contract.

Manual employer submission is required before an application enters Applied. Stage corrections require a reason and preserve the earlier event; no drag gesture may silently rewrite history, repeat submission or imply that an employer interaction occurred. The preview models deliberate correction as a product requirement; the reviewed backend does not currently support arbitrary backward/terminal corrections.

The reviewed backend lifecycle supports PLANNED, APPROVED, SUBMITTED, INTERVIEW, OFFER, ACCEPTED, REJECTED, WITHDRAWN and CLOSED. Interview invited and Screening need an explicit activity/substage contract; Won maps to accepted-offer outcome and Lost needs a specific outcome reason. These display requirements must not be implemented by silently changing enums in the browser. See `jobpunter-backend/docs/application-lifecycle.md` and the candidate transition service before implementation.

## Email: observed backend capability

This review inspected the local backend checkout at `c984af5ee30348dcd3b64309eb9e79fa0a84279d`, not a deployed mailbox runtime. No backend files were changed; existing worker-related changes were preserved.

| Evidence | What it establishes | What it does not establish |
|---|---|---|
| `app/api/v1/email_parser.py:26` — `/email/parse-job-alert` | Authenticated parsing of supplied subject/content/sender/message ID | Gmail OAuth, mailbox retrieval, continuous sync or lifecycle-message classification |
| `app/api/v1/manual_ingestion.py:244` and `:344` | Manual URL/JD/email input through shared ingestion, including multiple parsed records and provenance | An authorized connected mailbox or event monitoring |
| `app/application/jobs/email_parser.py` | Job-alert identification and extraction logic | A robust interview/offer/rejection/reschedule classifier with application correlation |
| `app/api/v1/router.py` and targeted searches of API/application/infrastructure code | No Gmail mailbox OAuth/watch/history adapter found in these reviewed paths | An assertion about undisclosed or separately deployed services |
| `docs/application-lifecycle.md` | Candidate-owned status transitions and audit; no verified integration-originated transition path | Automatic employer-event recognition and safe candidate approval of persisted event proposals |

The previous local “Connect” toggle is not evidence of a working integration. The updated connection view shows **not available in this build**, provides manual email intake, and keeps sample email activity visibly separate from any claimed live connection. This is an implementation gate, not an acceptable permanent substitute for the required feature.

## Required production Gmail flow

1. Explicit candidate OAuth, approved scopes, account binding and encrypted server-managed token lifecycle; separate Google sign-in from mailbox access. Revocation, expiry and denied consent must have recoverable states. No browser-held long-lived mailbox credential as the processing foundation.
2. Prove access by retrieving actual authorized messages and recording bounded success/failure observations. Display connected account, granted permissions, approved collection scope, last successful sync, last processing result, lag and actionable failures. Configured, authorized, retrieved and processed are separate facts.
3. Bounded initial collection and incremental history processing, persisted cursor/checkpoint, pagination, retries/backoff and replay-safe deduplication. Gmail can return 404 when a history cursor is no longer available; recover through a bounded full resynchronization. [Google synchronization guide](https://developers.google.com/workspace/gmail/api/guides/sync).
4. Durable watch renewal and Pub/Sub processing if using server push. Gmail watch must be renewed at least every seven days; Google recommends daily renewal. Push signals trigger history retrieval, not an assumed message outcome. Include recovery for missed/delayed events. [Google push-notification guide](https://developers.google.com/workspace/gmail/api/guides/push).
5. Reading message bodies requires a body-capable permission; metadata access alone does not provide bodies. `gmail.readonly` is a restricted scope, and Google's verification/security-assessment requirements must be resolved for the actual deployment. Collection filters do not narrow the granted OAuth permission. Avoid requesting send/modify access for a read-only use case. [Google Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes).
6. MIME/HTML/plain-text normalization, stable account/message/thread identifiers, duplicate/changed-message handling, digest splitting, bounded attachment handling, safe link processing and source retention. Treat message content as untrusted data, never instructions to the system.
7. Separate classifications for job alert, recruiter message, submission acknowledgement, interview invitation, reschedule/cancellation, assessment request, offer, rejection and unrelated/uncertain content. Resolve negation, quoted old replies, dates/timezones and missing details. Do not infer an interview solely from a keyword.
8. Match updates to candidate-owned applications using multiple signals: stable references where present, role, employer, thread and known submission context. Ambiguous matches require candidate selection. A company-only match must not update an unrelated application.
9. Persist an editable event proposal with message reference/excerpt, extracted fields, proposed stage, matching rationale, confidence, parser/model version and deduplication identity. Candidate edits preserve the original extraction. Only approval commits the event, with expected application revision and idempotency. Approval does not send a reply, accept an offer or confirm attendance.
10. Pause/revoke collection, recover failed work and reauthorize without silently extending scope. Scoped recurring approval needs explicit duration/revocation behavior; an authorization checkbox alone is insufficient.

### Release evidence

Require a consented test mailbox and real provider tests for authorization/revocation, body retrieval, incremental sync, watch renewal, expired-cursor recovery, duplicate push delivery, provider outage and worker restart. Evaluate the parser on representative alerts and lifecycle messages, including ambiguous matches, multiple roles, forwarded mail, timezone changes and negation. Validate that incorrect/uncertain classifications cannot auto-move an opportunity.

Measure false stage proposals, missed actionable messages, correlation mistakes and duplicate-event rate against reviewed fixtures and live canaries. Set acceptance thresholds explicitly before launch; do not invent a “top-notch” readiness claim from a settings screen or passing happy-path test.

## Preview verification boundary

The existing candidate design is retained and extended with visual CV editing, a clearly labelled sample upload comparison, external-search scope, draggable/confirmable stage-board interactions and email event review. These interactions do not implement live ATS analysis, document parsing, global acquisition or Gmail access. Backend implementation and real end-to-end evidence are required before enabling those capabilities in the app.

Browser checks exercised 103 views at 320, 390 and 736 CSS pixels, without document-level horizontal overflow. The board deliberately scrolls within its stage track. The original connected application journey passed. Additional checks cover footer order; saved rich formatting; preserving drafts when returning to the editor; explicit separation of selected files from sample scans; unsupported-claim resolution; global results entering the Job Pool; local pool filtering; desktop drag followed by confirmation; List-stage changes; ambiguous email matches; approved event proposals; and explicit stage corrections. Board and editor screenshots were visually reviewed. These are prototype checks, not production Gmail, parsing or ATS validation.
