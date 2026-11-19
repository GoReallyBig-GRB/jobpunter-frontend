# Pipeline, interview preparation and outcome review

18 November 2026. Design contract and prototype behavior; backend reviewed read-only.

## Candidate flow

The board groups opportunities under stage-title strips with counts. Expanding a strip lists opportunities in that stage; its opportunity selector contains job titles, never stage destinations. **Choose a stage** inside the selected opportunity’s **Move to** control is the movement action. Selecting a destination opens a modal containing the current/next stage, reason, explicit confirmation, Cancel and OK. OK records the event and keeps the candidate in the pipeline. Cancel/Escape leaves the stage unchanged. The modal restores focus to the opportunity’s control after a successful move.

The list has no repeated Move button. Selecting a stage opens the same confirmation modal. Native selectors provide the complete mobile and keyboard interaction; any desktop drag implementation must use the same confirmation gate. No automatic submission is introduced.

An interview invitation reveals **Open interview preparation** in the opportunity record. **Begin preparation** starts the disclosed session. The candidate reviews editable likely questions grounded in the job description, practises real examples, and receives feedback against a defined rubric. After the final question, **Check your score** opens the percentage result and interpretation, followed by **Repeat the test** and **End preparation**. The prototype includes JD-mapped sample questions and candidate self-review; it does not present self-ratings as AI assessment. Full completion/reminder contracts are in `20-interview-preparation-lifecycle-and-approval.md`.

Won, Lost and Withdrawn close the active record. The retrospective stores the history snapshot, movement reasons, available practice sessions and an editable candidate reflection. Missing practice results remain explicitly missing. A later correction retains the closed snapshot and its history; it never erases an earlier outcome.

## Verified backend mapping and required additions

Read-only source: `jobpunter-backend/app/domain/opportunities/service.py`, `APPLICATION_TRANSITIONS` and `transition_application`.

| Candidate display | Existing backend representation | Integration decision |
|---|---|---|
| Applied | `SUBMITTED` | Requires authenticated candidate confirmation after manual submission. Package approval alone is insufficient. |
| Screening | No dedicated state | Model as an activity while canonical status remains `SUBMITTED`, or explicitly extend the contract. |
| Interview invited | No dedicated state | Use a versioned invitation event under `SUBMITTED` before the confirmed `INTERVIEW` transition. Do not send an unsupported enum to the API. |
| Interview | `INTERVIEW` | Preserve user-confirmed transitions and interview event metadata. |
| Offer | `OFFER` | Only use allowed transition paths from the existing state. |
| Won | `ACCEPTED` | Existing allowed entry is from `OFFER`; terminal. |
| Lost | `REJECTED` | Allowed from submitted/interview/offer states; terminal. |
| Withdrawn | `WITHDRAWN` | Preserve the existing state-dependent transition rules; terminal. |

Existing terminal states have no outgoing transitions. The prototype’s reasoned correction is a proposed dedicated append-only correction workflow, not permission to bypass this service. Production needs a correction endpoint with expected revision, actor authorization, original event reference and corrected effective state. Until supported, disable the production correction action with a clear explanation. Do not submit a backward transition through the current status endpoint.

Every mutation needs the expected application revision, idempotency key, authenticated candidate, reason and previous/next state. On conflict, preserve the entered reason, reload the latest record and request a new confirmation. On failure, keep the modal open with the input retained; do not move the card optimistically without rollback. Invite/email ingestion proposes an event; approval records it and never sends an employer reply or confirms attendance.

## Interview agent request

Use the actual JD snapshot, opportunity ID, invitation event, approved profile/CV revisions, evidence references and known gaps. Approval binds the scope and these revisions. Generate likely questions with a reference to each JD requirement and an explanation of what a useful answer should cover. The candidate can edit a proposed question before practice. Edited questions preserve the original and their revision.

Scoring uses `practice-v1`: relevance, evidence grounding, structure and specificity, each 1–5. Define anchors: 1 = criterion absent; 3 = clear but incomplete; 5 = specific, coherent and supported. Return per-criterion rationale, quotations from the candidate answer, source references where available, improvement advice, confidence/limitations, model/task version and timestamp. Unsupported claims must be flagged rather than rewarded. No hiring probability or fabricated benchmark ranking.

Store sessions by opportunity, question revision, JD/profile/CV versions and attempt. A retry creates a new attempt; it does not overwrite prior feedback. Voice capture needs its own consent and retention policy. Provider failure should preserve the answer and permit retry without inventing a score.

## Closed-record snapshot

Persist application and source versions, final outcome, closure timestamp/actor, immutable movement history, reasons, practice attempts and actual feedback provenance. Store the candidate’s reflection separately with revision history. Keep self-review distinguishable from AI or human coaching. Do not infer why an employer rejected a candidate or treat success/failure as proof of interview performance.

The prototype stores these interactions in the current preview session. Refresh-persistent storage, real account isolation, production AI scoring and provider integration are implementation dependencies, not completed backend features.

## Five-question acceptance

| Surface | Purpose/function | Intuitive use | Workflow value | Natural navigation | Product objective |
|---|---|---|---|---|---|
| Mobile board | Locate applications by stage | Stage counts plus readable column | See progress without tiny cards | Stage navigation stays on the board | Lower monitoring effort |
| Move modal | Confirm a real event | Named destination, reason, checkbox, OK | Preserve trustworthy application history | Cancel restores the card; OK stays in pipeline | Candidate retains control |
| List stages | Accessible move alternative | Stage itself is actionable | No duplicate movement controls | Uses the same modal and validation | Equally capable mobile interaction |
| Interview plan | Approve job-specific preparation | Actual requirement context and one next action | Connect invitation to useful practice | Pipeline → plan → questions | Reduce preparation effort without invented claims |
| Practice review | Improve a real answer | Explicit rubric and scorer identity | Actionable feedback, preserved attempts | Edit answer / next question / pipeline | Support credible interview preparation |
| Outcome review | Close and learn | Timeline, actual feedback, reflection | Retain useful context for future applications | Closed card → review → pipeline | Reduce repeated work and preserve learning |
