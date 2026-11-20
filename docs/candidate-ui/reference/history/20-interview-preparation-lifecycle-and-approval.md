# Interview completion, reminders and document approval

18 November 2026. Implements the latest browser review in the prototype and specifies backend support. These are application requirements, not instructions for autonomous employer contact or real reminder delivery. No production repository was changed.

## Interview workflow

Opportunity → **Open interview preparation** → preparation scope and JD requirements → **Begin preparation** → questions and answer feedback → **Check your score** → percentage and performance interpretation → **Repeat the test** or **End preparation**.

Beginning preparation authorizes the disclosed question generation/practice/scoring scope. The candidate can revise questions and answers. Reopening a running preparation resumes it instead of silently replacing the attempt.

The score screen contains one prominent percentage, a plain-language interpretation, scorer identity and practical improvement advice. The prototype calculates a self-review result from candidate-entered ratings and explicitly says live AI assessment is not connected. Production must use the versioned AI scoring contract in document 19, including per-criterion evidence and explanations. Never present self-review or a static demonstration score as AI assessment.

For the existing four-criterion, five-point rubric, percentage = sum of all question criterion scores ÷ (question count × 20) × 100, rounded once for display. A final score requires every planned question to be answered and assessed. Incomplete or unavailable assessment is not zero. Retain the unrounded score and criterion values. Proposed interpretation bands in the prototype: 80–100% “Strong preparation”; 60–79% “A useful foundation”; below 60% “More practice would help”. These are coaching bands, not predicted hiring probabilities or population rankings; calibrate the production bands with evaluated examples.

**Repeat the test** archives the completed attempt as `REPEATED`, preserves its score, and creates a new attempt. It must not overwrite prior answers or results. **End preparation** records `ENDED`, persists results and closes the preparation flow back to the opportunity. Ending an incomplete session preserves completed work with an incomplete marker and no final percentage.

## Unfinished preparation and the two-reminder limit

States: `IN_PROGRESS` → `AWAITING_END` after the completed result is opened → `ENDED`, `REPEATED` or `ABANDONED`. Only `IN_PROGRESS` and `AWAITING_END` are eligible for login reminders. A completed test awaiting the candidate’s End decision is still unresolved preparation.

1. At the next successful login, surface an in-app notification for unresolved preparation with **Finish preparation** and **End preparation**. Persist that this is reminder 1.
2. If unresolved at a later distinct login, show reminder 2, explicitly labelled as the final reminder, with the same actions.
3. Give the candidate the opportunity to act on that second reminder. If it is dismissed without resolving the session, mark the preparation `ABANDONED`. If the app is closed instead, mark it abandoned at the next login reconciliation; do not create reminder 3.

This defines “after two notifications” without abandoning the session while the second notification is still awaiting a decision. **Finish preparation** restores the saved question/answer position or opens the completed score. If the candidate resumes but leaves it unfinished again after the second reminder, the next login reconciliation abandons it. End and Repeat resolve the old attempt and stop its reminders. An abandoned attempt retains its progress and history, and a future Begin creates a new attempt.

There is no invented expiry duration or background email notification in this rule. Reminders are in-app and tied to distinct authenticated login events, not ordinary Home navigation, rerender, page reload or opening a second tab in the same login session.

## Backend model and operations

Persist per candidate and opportunity:

- Preparation/attempt IDs, parent attempt ID for repeats, status, expected revision, started/updated/ended/abandoned timestamps and completion reason.
- Immutable JD, profile, CV, question, rubric and AI task/model versions; candidate-approved scope.
- Questions, edited revisions, answer drafts, submitted answers, feedback, scorer type, raw scores, final percentage and interpretation version.
- Reminder count, delivered/acknowledged timestamps, login-session IDs, notification IDs and resolution decision.
- Append-only audit events for begin, answer save, assessment, score opening, repeat, end, reminder delivery/dismissal and abandonment.

Proposed operations (contract additions, not existing endpoints): begin/resume preparation; save answer draft; request assessment; read final result; repeat attempt; end attempt; reconcile login reminder; acknowledge/dismiss reminder. Each mutation requires candidate authorization, expected revision and idempotency key. Store score/terminal state and the associated audit event transactionally.

Deduplicate reminders by preparation ID + authenticated login-session ID. Increment the counter only after successful in-app delivery acknowledgement, not after a failed fetch. At most two deliveries per unresolved attempt. Multi-tab activity must not consume both reminders. Concurrent Finish/End/abandon operations must use revision checks; a completed End wins over a stale abandonment request. Return the current state on conflict and preserve the candidate’s unsaved answer for recovery.

Persist answer drafts before navigation where possible; surface save failures with retry. A provider timeout keeps the answer and the attempt active, allows idempotent retry and produces no fabricated score. Offline login notification delivery does not consume a reminder. A closed or corrected application should retain preparation history; clarify whether new practice is relevant before resuming it.

The demo simulates this state machine within the current preview session using its sign-in flow. It does not persist real account data across refreshes, deliver real notifications or run AI scoring. Production requires durable storage and authenticated login events.

## Save and approve; combined package screen

**Save and approve** is an explicit candidate action that creates and approves the edited document revision atomically. Bind approval to the document content/version, source profile/CV revisions, pathway and JD where applicable. Preserve older versions. Empty documents, stale sources or revision conflicts must not be approved.

Application CV/cover-letter edits are available inside the final package screen alongside the paper document preview. Saving returns to the same package, with the edited revision already approved; no extra document-approval screen is required. The final package approval remains a distinct decision about the exact chosen documents and destination. Editing the application CV invalidates an already prepared cover letter if it references the earlier CV; refresh and approve that letter before approving the package. A package edit must not invalidate unrelated approved matching or silently change the selected source CV.

The standalone document editor includes an expandable paper preview and the same Save and approve action. For the initial CV, disclose that approval authorizes matching the collected results and background profile drafting. Generated profile facts and suggested Career Pathways still need their own later approval.

## Layout decisions from this review

- Job results precede recommendations/upload guidance; guidance follows the results.
- Next-step cards use full glowing yellow borders. Supporting forms/content use tinted surfaces with thin complete borders. Do not introduce left-border-only cards.
- Preserve the explicitly approved, unfilled informational highlight under “Not ready to add your details?”; it is the user’s stated exception, not the discontinued card style.
- The selected opportunity remains available through **View this job’s details** during CV preparation. The copy states that the application is pending CV completion.
- Stage strips show stage names and opportunity counts. Their dropdowns contain opportunities. Stage movement stays within the opportunity’s card.

## Verification scope

Targeted browser checks cover results-before-guidance ordering, preservation of the approved highlight, selected-job disclosure, in-package editing and explicit approval, opportunity dropdown contents, score calculation (three questions rated 4/5 yields 80%), repeat, saved-answer restoration, two reminders, end/abandon behavior, and widths 320, 390, 430 and 1241 pixels. Real service calls, notification delivery and account persistence are outside the prototype.
