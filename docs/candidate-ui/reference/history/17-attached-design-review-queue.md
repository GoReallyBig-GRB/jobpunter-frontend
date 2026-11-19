# Attached design review — completed design refinements

Source: `C:/Users/user/Downloads/Jobpunter UI Design Work.docx`, read 17 November 2026. The source document remains unchanged. The requested design/prototype refinements below were completed on 18 November. Production services, persistence, AI scoring and document export integration are explicitly separate implementation dependencies.

| Requested refinement | Delivered |
|---|---|
| First-search filter layout | Employment type now shares the compact two-column filter grid. Required markers sit beside their labels. |
| Mobile editor and links | Compact primary formatting row; expandable typography/layout and link tools; safe link insertion with or without a selection, updating, removal and save/reopen retention. |
| Single CV structure and mapping | Shared active questionnaire/profile/Master CV/CV Variant section order; application CVs inherit approved source structure. Dedicated mapping and AI contract in `18-canonical-career-cv-ai-handoff.md`. |
| Project/achievement affordance | Highlighted pill, disclosure chevron and retained answers; adding another entry keeps the section open. |
| Final package loop | Paper documents remain in the final package; editing returns to it and invalidates the relevant approval. Existing package-flow checks still pass. |
| Pipeline moves | Board Move disclosure → same-page reason/confirmation modal; list stage → same modal; mobile stage columns and retained history. |
| Interview follow-through | Invitation surfaces preparation; candidate-approved, JD-mapped sample questions, editable questions, answers and explicit self-review rubric. Production AI scoring contract documented. |
| Won/Lost follow-through | Closed record with history, reasons, actual recorded practice reviews and editable reflection. Corrections retain earlier snapshots. |

Validation: targeted interaction journeys passed, plus 252 view/width checks across all 126 retained views at 320 and 430 pixels; affected flows additionally checked at 390 and 736 pixels. A reduced-height editor viewport was checked, but this is not a physical-phone keyboard test. Actual backend AI calls, Gmail connections and PDF/DOCX services were not implemented or claimed. Prototype changes remain session-local.

## Incorporated into the current application-package work

- Keep document review within the final package context; do not send users through CV/cover-letter selection again.
- Present the selected CV and optional letter in standard paper views on the package screen. Editing returns to that package; changed revisions need approval.
- Provide download, optional copy and the verified external application channel after package approval. Preserve the distinction between handoff and submission.

## Completed: mobile layout and rich-text editor

- Compact the first-search employment-type control into the available filter grid. Apply the same spatial review to other forms and editor controls without shrinking touch targets or labels.
- Repair and test link insertion: selection retention, explicit link target, inserted text/link feedback, editing/removing links, safe schemes and save/reopen persistence. The link field/button must visibly change the selected document content.
- Rework oversized editor controls/cards into a structured mobile toolbar; check 320–430 px layouts, keyboard opening and selected-text actions.

## Completed: canonical career/CV schema and AI handoff mapping

Use the supplied section order consistently across profile, questionnaire, Master CV, CV Variants, tailored CVs and AI generation:

1. Job Title (Career Pathway)
2. Career Objective
3. Personal details: name, location, nationality, languages, work authorization/jurisdiction, email, phone
4. Experience: role/work, organisation/client, dates/current role, contributions and achievements
5. Education & qualifications
6. Projects & other work
7. Skills, methods & resources
8. Links & supporting evidence

Produce a dedicated question → profile field → document section → evidence/source → generation-rule mapping for AI-agent handoff. Preserve missing values as missing; Career Objective may remain omitted when intent is not supplied, per the explicit earlier decision. Sensitive or irrelevant personal details should not be silently inferred or automatically printed merely because the schema can store them; candidate review controls what appears.

Project inclusion is discoverable through the highlighted **Add a project or achievement (optional)** control. Optional no longer means an unmarked text heading.

## Completed: mobile pipeline interaction

- Keep board moves on the same page: Move arrow opens stage choices; selecting a stage opens a reason/confirmation modal; **OK** applies the move and returns focus to the card.
- On the list view, remove the redundant Move button. Selecting a stage opens the same modal.
- Optimize board columns and stage navigation for phones, retaining an accessible alternative to drag-and-drop.
- Preserve transition validation, reasons, confirmation, history and correction rules. UI smoothing must not bypass backend lifecycle constraints.

## Completed: interview and outcome follow-through design

- Interview invited surfaces job-description-grounded interview preparation and likely questions. Generation/practice remains within candidate-approved scope; performance uses a defined rubric and explainable feedback.
- Won/Lost closes the active pipeline record and stores a retrospective containing movement history/reasons and available interview practice feedback. Do not invent missing interview scores or automatically equate outcome with candidate performance.
- Reconcile Interview invited display/event mapping and terminal-state behavior with backend contracts before implementation. Preserve audit history and deliberate correction rules.

The five-question acceptance obligations for the new interactions, backend state mapping and remaining production contracts are recorded in `19-pipeline-interview-and-outcome-contract.md`. Existing design, brand and frontend technology are retained. Older overlapping screens remain available in the review picker for reference, while main candidate links use the current flows.

### Achievement control — completed 18 November 2026
The optional achievement/project disclosure now uses a branded tinted pill with a visible border and expand/collapse chevron. Verified touch and keyboard activation, retention of entered answers, and layouts at 320, 390 and 736 pixels.
