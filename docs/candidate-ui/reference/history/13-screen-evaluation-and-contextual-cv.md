# Five-question screen standard and contextual CV workflow

17 November 2026. The user’s five questions govern every candidate screen, including inherited prototype views. A screen cannot be accepted solely because it renders or links somewhere.

## Mandatory acceptance rubric

1. **Purpose and functionality:** name the candidate’s task and provide a working action or useful decision information. Empty/missing prerequisites must offer a recovery action.
2. **Intuitiveness and ease:** use familiar language, structured inputs and readable mobile layouts. No unexplained assessment vocabulary or clipped status badges.
3. **Workflow value:** remove candidate effort or support a concrete decision. Repeated warnings alone are not a screen’s value.
4. **Natural navigation:** preserve selected job, document version, form draft and entry context. Back returns to the originating task; the primary action advances that task.
5. **Overall objective:** discovery → credible matches → approved application materials → candidate-owned submission → monitoring. Supporting screens must clearly enable or protect that journey.

The companion screen register covers every template and records its intended purpose, primary function, navigation and review gates. It is a design contract, not a claim that every legacy demonstration state has passed production acceptance. The five user-identified problem areas and their connected journeys are the focus of this revision.

## First-ever search

The separate first-time screen now says **Your very first job search!** and **Use filters and keywords to find credible listings that match your preferences.** It does not assume an existing Job Pool. Its quick links are Add your CV, Set up a career profile, Create a CV and Take a tour. Returning users still enter their dashboard.

Each collected result offers Review, Apply and Reject. Review opens concrete opportunity details. Apply expresses candidate intent and starts preparation; it never submits or fabricates an assessment. Reject asks for a reason, removes the item from active results and preserves its history with a restoration route. Source copy is **Found via**.

Backend verification: `app/api/v1/opportunities.py` defines APPLY/REVIEW/WATCH/REJECT, evaluation override reason and expected revision, and preservation of original decision. `app/domain/opportunities/service.py` requires a current APPLY evaluation, score, no hard blockers, supported mandatory requirements, deterministic eligibility, verified application route and freshness for Punt qualification. A candidate click on Apply is not equivalent to passing those checks. The pre-evaluation provisional collection needs an explicit candidate-disposition contract; do not falsely post an evaluation override when no evaluation exists. Review as a view action does not mutate backend disposition to REVIEW. Candidate REJECT must not delete a shared canonical job.

## Next steps without a CV

Show a concise job rundown: company, pay, location/arrangement, employment type, description highlights and application channel. State unknown values as unknown. Explain the cost of proceeding without career information once, then offer Upload your CV, Create a CV and Open application method. No fabricated package or repeated checklist pretending to be preparation.

## Guided CV structure

Separate name, location, email, optional phone and type of work sought. Experience is repeatable: role/work, organisation, start/end months, still employed and contributions. Achievements/projects are repeatable: achievement, work/project name, date, contribution, evidence links and document selection. Education is repeatable: field of study, institution, degree/certification and year. Preserve entered values while adding/removing entries. Starting without employment experience is valid; blank entries are omitted.

The more relevant detail supplied, the more specific the CV can be. Generation must use those structured answers and referenced evidence without inventing missing facts. File selection alone is not evidence verification. Preview files are not uploaded/read. Real uploads need type/size validation, storage, scanning, provenance and review states. Questionnaire dates and repeated records require independent validation, stable IDs, draft persistence and conflict handling.

## Entry context decides what happens after approval

**Created from initial results:** approve the CV, assess the existing result set and recommend supported Punts. Offer an optional refined global search separately; do not silently substitute acquisition for fit analysis.

**Created while preparing a selected job:** preserve that exact job and return directly to its application preparation. Offer the approved CV or job-specific tailoring, optional cover letter, version review and package handoff. Background assessment of prior results must not take over the active application. A selected job need not be falsely promoted to a Punt to preserve preparation intent; backend qualification/eligibility rules still apply before any claimed readiness.

The approved starter CV becomes the current Master CV baseline and retained career source. Comprehensive profile/Master CV processing and pathway suggestions proceed as drafts in the background. Baseline approval is not approval of the whole profile or a completed career setup. User edits/replacements preserve source history and invalidate dependent approvals as appropriate. Pathway count derives from supported experience depth and skill scope; do not pad the list to four.

Every application package binds job/JD, source CV, tailored CV and optional cover-letter versions. Edits invalidate affected approvals. Handoff-ready differs from submitted, and submission requires candidate confirmation. Export and live generation remain backend work in this preview.

## Assessment as a decision aid

Lead with **Is this worth applying for?** Explain what supports applying, what needs attention and what the candidate should do next. Keep deeper evidence available progressively. Without approved career information, label fit unassessed; do not show pass/supported labels. Mobile status labels occupy a non-wrapping column while descriptions wrap in the flexible column. The primary action prepares the selected application, with an opportunity-aware back route.

Production assessment must show actual current job-specific evidence, mandatory versus preferred gaps and freshness. Acknowledging a risk preserves the gap and cannot override legal eligibility or missing mandatory requirements. Sample UI checks are not live assessments.

### First-time journey guidance — 18 November
Preparation now leads with CV tailoring and cover-letter preparation, followed by the factual prerequisites. The no-CV route provides employer instructions only, never fabricated documents. Short next-step sections span first search, results, CV creation/review, Punts, opportunity review, packaging, application questions, submission and pipeline/interview follow-through. Guidance is limited to first-time onboarding, omitted from Home, disabled on returning sign-in and dismissible at the pipeline. Existing candidate review/approval and manual submission boundaries remain unchanged.

18 November browser review: applied all nine copy and presentation requests. Next-step sections use restrained yellow border glow; no-CV guidance is shortened; job facts use the active-navigation tint (#252915); expandable disclosures use tinted pill controls and chevrons. Pipeline stage navigation and card moves use compact native selectors. Board responsiveness follows the actual app container, avoiding two cramped columns inside a phone preview on a desktop viewport. Stage moves still require reason and explicit confirmation. Targeted interactions and copy/layout checks passed at 320, 390, 430 and 1241 px.
