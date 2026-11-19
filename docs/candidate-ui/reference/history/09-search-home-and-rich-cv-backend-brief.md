> Correction: [Optional-CV first application](10-first-application-optional-cv.md) supersedes any CV upload gate below. Continue searching or proceed to risk-aware handoff without a CV; guided CV creation is an alternative. Current preview: 116 views.

# Candidate search, Home activity and rich CV generation

Decision update — 16 November 2026. This supplements the PRD and supersedes earlier prototype shortcuts. Preserve the existing frontend architecture and technology. These are required contracts, not claims that backend endpoints already exist.

## First-search progression

Global search acquires jobs outside the candidate’s already processed, curated Job Pool. It is an external discovery operation, not a database filter presented as internet search. Job Pool search only filters existing candidate opportunities.

After a first filtered global search produces opportunities, the first-time candidate’s next action is Add your CV for better matching. Do not offer another global run from Pool, Punts or Home until the CV is reviewed. Apply the same rule at execution time so another route cannot bypass it. If the first run yields no results, allow filter correction and retry. After reviewed-CV matching, global discovery remains available separately from local Pool search.

Search input contract: position, optional keywords, location, employment type, work arrangement, optional selected Career Pathway, candidate ID, consent/run ID and source coverage. Keep position and keywords as distinct fields. Specify keyword semantics rather than silently ignoring terms: the preview requires every entered keyword; production should support explicit must-have terms and optional terms with understandable matching explanations. Preserve the exact query and filter snapshot for each discovery and schedule. Return queued/running/partial/completed/failed states, source coverage, viable discoveries, duplicate links and genuine exceptions. Do not claim internet-wide coverage when only a subset of sources was searched.

Persist reviewed-CV version and first-search progression server-side. New jobs flow through canonical deduplication and candidate viability assessment before entering the appropriate provisional/curated collection. The first-upload gate does not imply approval of the Master Career Profile.

## Functional Home

Home is an action hub: current search or CV-matching next step, dated recent activity, application state, pending approvals, career setup progress, latest recommendation update, schedule controls and contextual shortcuts. Empty states explain what will appear; counts must derive from real candidate records.

Activity contract: stable event ID, candidate ID, event type, human-readable title, UTC occurred-at timestamp, entity type/ID/version, actor category, status, deep-link target and correlation ID. Display local dates using the candidate’s timezone; newest first, cursor-paginated and idempotent. Relevant events include Application submitted, Master CV generated, Master CV updated, Master CV approved, CV Variant approved, interview invitation reviewed and scheduled search completed. Draft edits and approvals are different events. Do not use future example dates as actual activity. Clicking an event opens its relevant record/version; older versions remain accessible.

## Master CV is generated, not the uploaded CV renamed

Reviewed Master Career Profile and supporting evidence → explicit generation action → structured professional Master CV draft → candidate WYSIWYG edit/review → approval of that exact version → suggested Career Pathways → pathway approval → generated supporting CV Variants → separate review and approval of each variant.

The early uploaded CV supports initial discovery/matching only. It is not the generated Master CV. The Master CV uses all reviewed career details, including personal details, education, experience, previous work, achievements, projects, skills, links and evidence. Relevant facts may be professionally summarized but unsupported claims must never be invented. Career Pathways may be suggested concurrently as drafts, but do not mark them approved or make the Master CV review disappear. Four pathways remain optional.

Profile changes make dependent documents stale. Generation, editing, external upload and regeneration create revisions; they do not overwrite approved versions. Each approved CV Variant records its approved source profile, Master CV where applicable, Career Pathway, evidence and risk-acceptance versions. Each tailored CV additionally binds to the actual JD version. Earlier career drafts and approval history remain available.

## Rich-document contract

AI generation must return a validated, versioned structured rich-document tree compatible with the chosen frontend editor. Plain text or Markdown is not the document source of truth. Keep a derived plain-text projection only for search, matching, diffing and ATS analysis. HTML may be a sanitized rendering/export representation; never render arbitrary model-produced markup directly.

Supported nodes: document, sections/headings, paragraphs, text runs, hard breaks, ordered/bulleted lists and list items. Supported marks/attributes: standard font family, size, weight/bold, italic, underline, text colour, safe links, indentation and paragraph alignment/spacing. Define one schema shared by generation, validation, editor, persistence, import and export. Restrict fonts to an agreed standard set with fallbacks and embed or substitute consistently in exported files. Dynamic fields and repeating experience/education entries require stable IDs and editable resolved values, not brittle text substitution.

Document envelope: document ID, candidate ID, document kind (Master CV/CV Variant/tailored CV), schema version, revision, source-reference versions, structured content, validation results, status, generation task ID, created/updated timestamps and exact-version approval record. Save with expected revision to prevent lost updates. On conflict, offer reconciliation without discarding either draft. Persist autosaved drafts separately from approved snapshots.

Generation is asynchronous: queued → generating → validating → draft ready, or actionable failure. Validate schema, prohibited active content, source/evidence grounding, unsupported claims and required sections before publishing a draft. Approval must reject stale revisions. Editing or importing removes approval from the new revision only.

## Editor and import/export acceptance criteria

- Generation → edit → save → reopen preserves semantic structure and typography, lists, links and indentation.
- Mobile selection, keyboard navigation, undo/redo, clipboard normalization and accessible formatting controls work without flattening content.
- Export DOCX/PDF from the same approved structured document; verify layout/pagination and selectable text. Do not equate attractive formatting with guaranteed ATS results.
- Reworked uploads are parsed into the same schema and compared with the existing document. For a tailored CV, include the actual JD and keyword coverage in that comparison. Reject or flag unsupported constructs visibly; never silently strip meaningful formatting or claims.
- External links accept safe schemes only; sanitize imports and rendered HTML. Preserve known marks and reject unsupported schema nodes with explicit validation errors.
- Test mixed fonts/weights/colours, nested lists, multi-paragraph selections, link edits, headings, long experience sections, pasted office content, revision conflicts and export round trips.

The current interactive preview illustrates these controls and approval steps with local examples. Its contenteditable/range formatting is not a production editor implementation. Choose or extend a schema-based WYSIWYG editor within the retained frontend stack, and require the round-trip tests above before integration is considered complete.
