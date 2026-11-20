# jobpunter assisted candidate workflow

16 November 2026 · Product-owner workflow clarification · Governs earlier candidate interaction proposals

Additional visual direction, recorded during this work: use pill-shaped action buttons where appropriate. Apply this to primary/secondary actions and compact action groups, while preserving restrained cards, readable forms and the supplied brand. It does not change the assisted-workflow objective or the retained technical architecture.

## Product purpose

JobPunter does the job-search and preparation work and brings informed decisions to the candidate for approval. Its main value is reducing effort, repetition and stress, with a path toward increasingly handsfree assistance. A collection of forms, generators and search tools does not achieve that objective merely because all features exist.

The candidate provides source materials, corrects exceptions, sets direction, accepts or declines disclosed uncertainty, reviews/amends output and approves actions. The system structures, interprets, drafts, optimizes, discovers, ranks, recommends, prepares, monitors and coaches. The candidate personally submits through the employer's application portal. Optional manual controls remain available; they are not the normal route through the product.

This clarification takes precedence over earlier UI flow proposals and over any earlier PRD interpretation that treated interview preparation as excluded generic coaching. Interview practice here is tied to an actual opportunity, the candidate's career facts and the job requirements. The full 20-area PRD scope remains; existing architecture/technology, supplied branding, discipline neutrality and desktop-first admin boundary remain unchanged. Backend discrepancies remain explicit integration work rather than grounds for removing the clarified behavior.

## End to end journey

**Upload materials → approve assembled Master Career Profile → approve/amend Career Pathways → review and approve AI-generated CV Variants → approve matching work → receive ranked pathway-linked Punts with an appropriate CV ready → optionally adapt to the actual JD → approve documents/package → submit manually → receive contextual Q&A assistance → approve recorded monitoring updates → prepare and practise for interviews → track Won/Lost outcomes.**

Manual application submission is the external task the platform deliberately does not perform on the candidate's behalf. Approvals and truthful event confirmations remain candidate decisions. The phrase “handsfree” must never imply unapproved actions or invented real-world events.

## 1 Upload first

The first primary action after authentication is uploading a CV and Master Profile materials. Accept multiple source documents, supplementary details and links containing personal details, education, experience, previous work, achievements, evidence, projects/other work and relevant context. Provide optional ways to add missing facts without requiring the candidate to reconstruct everything in long forms.

Show a clear preparation plan and obtain approval to process the named materials. Parsing, extraction, source attribution and conflict identification are internal steps of that approved bounded operation, not repeated approval dialogs for each technical substep. Do not silently fetch every linked service or private source: accessing a link or account needs the appropriate disclosed authorization and implemented retrieval behavior.

AI assembles a structured Master Career Profile draft with evidence and source links. Present a concise review summary, complete section access, conflicting values, uncertainty and targeted questions for critical missing facts. Candidate amendments are optional except where a truthful required fact is missing. Approval commits the reviewed profile version through the actual supported operations; an import's evidence-confirmation result must not be mislabelled as a profile commit.

## 2 Career Pathways

Career Pathways are the candidate-facing expression of Career Pathways. The default assistance aims to suggest **four plausible pathways**, derived from the approved Master Career Profile and evidence, to broaden application coverage. Four is a recommendation, not a minimum, forced quota or artificial limit. The candidate may proceed with fewer, amend suggestions or create custom pathways. Do not invent weak pathways to fill four slots.

Each pathway contains a role family/target roles, relevant level and domains where applicable, supporting evidence, transferable capability, gaps, rationale, uncertainty and provenance. AI proposes; the candidate approves, amends, rejects or defines a custom pathway. Custom pathways undergo the same support analysis against the Master Profile, including candidate-directed risk acceptance where allowed.

### Insufficient evidence and risk acceptance

An insufficient-evidence flag can be overridden by the candidate through **explicit, reasoned risk acceptance**. Show the exact gap, relevant source/requirement, why the system flagged it and practical consequences. Record the candidate, reason, time, pathway/Punt or decision scope, input versions and accepted risk. Keep the flag and original reasoning visible after acceptance.

Acceptance changes the candidate's decision to pursue a direction or opportunity despite uncertainty. It does not turn missing evidence into verified evidence, authorize fabricated achievements or grant an absent legal/professional credential. When the candidate supplies a new factual assertion, record it with its real provenance/verification state rather than treating the waiver as proof. The current backend's blocker policy must be reconciled with this explicit product requirement, including which uncertainty flags are overridable and how they affect qualification, generation and readiness.

No blanket waiver or silent inherited consent: material input changes require re-evaluation and, when the accepted risk changes, renewed acceptance. Routine “insufficient evidence” should not force a candidate to abandon a plausible pathway or repeatedly re-enter facts.

## 3 CV Variants generated for the pathways

After pathway approval, the system proposes a bounded drafting action for the selected pathways and approved profile snapshot. AI produces a structured, professional CV variant for each selected pathway, choosing appropriate evidence, ordering, emphasis and terminology. The candidate should not have to create a variant from a blank template or write an evidence-emphasis specification to get a useful draft.

Each CV Variant receives full preview, sources, changes/rationale and outstanding warnings. The candidate can review, amend, request a revision or approve its exact version. Each approved pathway has its own accepted CV Variant; four approved pathways normally yield four CV Variants. Do not require four to unlock the service. Show which pathways have a draft, an approved frontline version, outdated support or a pending review.

Version and approval relationships are explicit: profile snapshot → pathway version → CV version → candidate acceptance. Master CV support remains part of CV Studio, but generating and manually managing a Master CV must not become an unnecessary extra prerequisite if the intended CV Variant workflow can use the approved factual profile directly. Resolve any current backend dependency rather than making the user perform extra work to accommodate it.

## 4 Discovery ranking and Punts

The system prepares a matching plan from approved pathways, constraints, permitted sources and selected run/schedule. Candidate approval authorizes that defined operation. Do not assume a recurring schedule authorizes unrelated future actions; recurring consent must explicitly define what may repeat. Where no applicable approval exists, queue the operation for a decision.

The system performs discovery, deduplication, JD retrieval, eligibility/evidence matching and opportunity ranking. Candidates review a ranked shortlist with source/freshness, rationale and separate fit dimensions. Manual search and intake remain useful exceptions, not required repetitive work.

Every Punt carries its pathway or justified adjacent-pathway relationship, why it is relevant, the most suitable approved CV Variant version and its readiness. Recommend that CV automatically; allow a deliberate override without asking the candidate to repeat selection every time. A merely adjacent pathway must be labelled and explained, not silently treated as an approved new pathway.

If the CV Variant or source facts become stale, prepare a proposed refresh for approval and preserve the last accepted version and its history. Clearly distinguish system-ranked recommendation from candidate choice and application stage.

## 5 Optional clean adaptation and package

The candidate can use the approved CV Variant as it stands or ask for further tailoring to the actual Punt's JD. Adaptation is optional, not a mandatory rewrite on every application. The system proposes the exact source CV/JD/evidence scope, obtains approval to run it and returns a clean draft with an explanation of changes. It can reorder, emphasize and use truthful terminology; it cannot invent evidence or alter the original CV Variant.

Candidate review/amendment/approval binds to the adapted version. A later edit creates a new draft. Accepted evidence risks remain disclosed where relevant. The system can generate a tailored cover letter through the same approval-controlled process. Q&A can be prepared when useful, but actual questions encountered at the portal must be supported separately in the same Punt context.

The package presents accepted CV choice, approved optional cover letter, relevant answers, sources, warnings/waivers and exact version history. Review/approval should concentrate on actual content changes and exceptions; do not force repeated reading of unchanged already-approved documents. A final package approval binds the materials that will be delivered. Generating/downloading real files and checking application readiness remain distinct persisted operations.

## 6 Manual submission and contextual application questions

The candidate opens the employer's application portal and manually submits. JobPunter assists without directly applying, impersonating the candidate on the portal or equating a link click with submission.

At any point in that portal session, the candidate can return to the same Punt, paste one or more actual application questions and request curated answers. Answers use the approved Master Profile, relevant evidence, pathway, JD and accepted materials. Show the answer with evidence basis, uncertainty and unsupported-claim warnings. Candidate can amend, approve and copy it back to the portal. Unknown facts trigger a focused question or truthful limitation; accepted risk is not permission to invent credentials or experience.

Retain Q&A revisions with the Punt/application, rather than creating a generic disconnected chat. Submission is recorded only after an actual candidate confirmation or separately verified and approved integration event under an implemented policy. Candidate confirmation and verified employer receipt remain distinct.

## 7 Monitoring and pipeline

After submission, the system assists with monitoring through authorized integrations and available recorded data. It surfaces proposed updates and relevant evidence for candidate approval. Candidate-controlled confirmations remain available when an external source is absent. Monitoring must not mean the candidate is expected to move every card manually to discover what happened.

The opportunity record spans Punt → preparation/ready → Applied → screening/interview invitation/interview → offer → Won or Lost, with specific reasons and side outcomes retained. Provide Kanban-style grouping and a multi-step opportunity record. On phones use a readable stage-filtered list/record or vertically reflowed board; desktop can display parallel columns. Reuse useful old-UI concepts without copying its layouts or making its states authoritative.

The current backend's detailed states and the requested product progression need an explicit stage/activity mapping. Do not silently invent production enum values, erase Screening/Interview Invited, collapse withdrawn/closed/rejected into an unexplained loss, or claim a system-observed event without evidence. Candidate-approved monitoring transitions record the source observation, decision actor, previous/new state, time and reason.

## 8 Interview preparation and training

An interview invitation opens an opportunity-specific preparation plan. Use the current JD, pathway, Master Profile, evidence, accepted CV/package, known invitation details and identified gaps to prepare likely questions and grounded answer strategies. Candidate approves the practice plan, including the questions/feedback activity and any recording/persistence permissions.

Offer practice with typed answers initially; voice/video requires actual supported capture, consent and privacy behavior. Evaluate against an explicit rubric such as relevance to the question, evidence grounding, clarity/structure and specificity. Give reasons, actionable improvements and an opportunity to retry. Scores/rankings describe practice performance and progression, not a probability of hiring or a fabricated comparison with other candidates.

Separate hypothetical question, candidate answer, AI feedback, rubric/version and session history. Unsupported details should be flagged and corrected rather than coached into a false claim. Personal performance history can compare sessions under comparable rubrics. Live AI evaluation, storage and permissions require backend task/session contracts; prototype sample scores must be labelled illustrative.

## 9 Approval model and low effort interaction

Approval is a core product object, not an alert bolted onto each screen. For each action proposal show purpose, inputs/versions, scope, expected output, uncertainty/risk, relevant external access and the exact decision being requested. Record pending/approved/rejected/expired/revoked/superseded as appropriate and bind execution to the approved scope. A timeout, notification or open page is not approval.

Allow one explicit approval to authorize a clearly named operation or bounded batch, such as drafting CVs for selected pathways. Each resulting CV still requires its own content acceptance. Low-level execution steps of the approved operation do not need redundant prompts. Batch approval cannot silently include unreviewed facts, different pathways, new external permissions or unrelated real-world events.

Use an **Approval Desk** as the daily landing experience: what the system prepared, what changed, what needs a decision and what happens after approval. Career/Evidence tools remain accessible for exceptions and editing. Notifications deep-link to a concrete proposal or review item. This reduces form-filling without hiding evidence, provenance or meaningful control.

Suggested primary navigation for validation: **Approvals, Punts, Pipeline, Career, System**. Evidence Library/Health, pathways and CV Studio remain clearly named within Career and cross-linked from affected work; full Job Pool/discovery/manual intake remain available within Punts. This supersedes v2's form/tool-first emphasis, not its scope coverage.

## 10 Workflow ownership

| Stage | System work | Candidate decision or exception |
|---|---|---|
| Setup | Assemble profile and evidence from uploaded materials | Provide materials; correct/approve draft facts and conflicts |
| Direction | Suggest approximately four supported pathways | Amend/approve/reject; add custom pathway; explicitly accept eligible evidence risk |
| CV Variants | Generate professional pathway-specific drafts | Review/amend/approve each accepted CV version |
| Search | Discover, deduplicate, evaluate and rank | Approve matching scope; adjust intent or review exceptions |
| Punt | Attach pathway and recommend approved source CV | Decide to pursue; approve optional adaptation/cover-letter work |
| Package | Prepare accepted materials and checks | Review changes/risks and approve exact delivery package |
| Submission | Assist with materials and contextual Q&A | Submit manually; approve/copy answers; confirm actual submission |
| Monitoring | Detect supported signals and propose updates | Approve observed event or correct/record actual outcome |
| Interview | Propose targeted practice, questions and rubric-based feedback | Approve session; practise; review/retry |

## 11 Backend and implementation dependencies

Retain the current frontend architecture/technology and reuse appropriate technical code. Add or reconcile contracts for: upload-to-profile assembly and reviewed commit; pathway suggestions and scoped evidence-risk acceptance; custom-pathway support analysis; pathway-to-CV Variant generation and durable linkage; approvals/action proposals and execution provenance; ranked Punt-to-pathway/CV recommendation; clean JD adaptation; optional cover-letter/package assembly; Punt-scoped actual application Q&A; authorized monitoring observations and approved transitions; interview plans/sessions/answers/rubrics/feedback/history.

Current presence of an AI generate endpoint or approval button does not establish these workflows. Do not implement approval gates or risk waivers solely in browser state. Preserve current production enums/data until explicit contract changes and migrations are verified. No backend or production frontend changes are performed by this design revision.

## 12 Acceptance criteria

1. Uploading source materials starts the primary setup journey; manual profile entry is an exception path, and repeated facts are not requested unnecessarily.
2. The system proposes up to the useful default of four pathways, with fewer permitted and custom pathways supported; no mandatory four-pathway gate exists.
3. Evidence uncertainty can receive versioned, reasoned candidate risk acceptance without erasing flags or turning them into factual proof.
4. AI produces a professional CV Variant for each approved requested pathway; each has independent review/edit/version/approval. Drafting is not delegated back to the candidate.
5. Each Punt has an explained pathway relationship and recommended approved CV already available; stale inputs lead to a proposed refresh.
6. Optional JD adaptation preserves the source CV; cover letters and contextual actual-question answers are grounded, editable and approval-controlled.
7. Only the candidate submits at the employer portal. Opening a link, copying an answer or generating a file never reports submission.
8. Monitoring proposes evidence-backed updates for approval; the pipeline preserves opportunity context from Punt to Won/Lost and detailed outcome reasons.
9. Interview practice is linked to the invitation/opportunity and uses a disclosed rubric. Scores and comparisons reflect actual supported evaluation, never invented hiring predictions.
10. Every consequential system operation runs only within recorded candidate approval; individual output acceptance, external consent and real-world event confirmation remain distinct.
11. Measure candidate effort: repeated input, manual search time, decisions needed, amendment burden, approval clarity and time from upload to useful CV Variants/Punts. Reduced effort, not a large screen count, is the product test.
# Current vocabulary and candidate opportunity scope

Use **Career Pathways** and **CV Variant** throughout the candidate interface. The candidate **Job Pool** contains viable opportunities within selected Career Pathways; **Punts** are its strongest matches recommended for application. Review-pending discoveries are not yet viable pool entries. The PRD's shared canonical repository remains the underlying deduplicated source, not an unfiltered candidate screen. See `05-product-vocabulary-and-opportunity-model.md` for the governing relationship and source reconciliation.

