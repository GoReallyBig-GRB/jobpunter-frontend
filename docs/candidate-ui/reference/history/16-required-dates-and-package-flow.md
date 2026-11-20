# Required fields, confirmed dates and application packaging

18 November verification: required markers, calendar Cancel/OK, conditional end dates, optional-letter progression, in-place package editing, dependent-letter refresh and returning CV Variant selection pass targeted checks at 320/390/736 px. Generated A4 HTML export content is verified. Browser download transfer could not be verified in the local environment: it cancelled the transfer and denied/suspended loopback networking. The hosted wrapper explicitly enables downloads; this is not a claim that a phone download was observed. Document review/editing now returns to the same final package screen, following the attached review.

17 November 2026. Shared flow for first-time CVs and returning candidates’ approved CV Variants.

## Required fields and dates

Every required input has a visible asterisk in its label, alongside native required semantics and a “* Required” explanation. Conditional experience fields become mandatory only when an entry is started; an end date is not required while “I still work here” is selected. Optional fields retain optional wording.

Dates open a labelled calendar dialog. A selection remains provisional until **OK**; Cancel/Escape preserves the existing value. Month-only employment/project dates show a month/year calendar without inventing a day. Interview or other full dates show the days of the selected month. Validate chronological ranges as well as required values. Production must retain keyboard navigation, focus return, screen-reader labels, minimum/maximum constraints and mobile target sizes.

## One progression, three visible steps

1. **CV:** select the approved document already on file or request tailoring to the actual JD. Returning candidates start from the suitable approved CV Variant. Explain that supported JD terminology and relevant emphasis can improve recruiter relevance and ATS readability, without promising a pass or inventing keywords/claims. A tailored draft remains editable and needs approval. Selecting an approved source or approving the tailored CV advances immediately.
2. **Cover letter:** offer a short, relevant letter or Continue without a cover letter. A letter draft remains editable and separately approved. Approval advances to package review. Skipping a previously drafted letter retains its history but excludes it from this package.
3. **Package:** show exactly which CV and optional letter versions are selected. Allow document review; approve the package and present downloads/copy actions plus the application channel. Link/email destinations come from the verified job record. Handoff does not mean submitted. Record manual submission only after candidate confirmation.

Back navigation follows these steps. Returning to edit the CV invalidates its approval and any letter tied to that CV revision. Replaced documents preserve history. Reopening preparation must not reset an already submitted opportunity to Ready.

## Document delivery

The demo downloads actual HTML documents with A4 print settings and copies plain document text where clipboard access is allowed. If copying is blocked, it presents selectable text; it never falsely reports a successful copy. HTML files can be opened and printed/saved as PDF in a browser. The UI identifies the format explicitly.

Production requires actual generated PDF/DOCX exports from the approved rich-document snapshot, export readiness/failure states, safe filenames and expiring authenticated download URLs. Plain-text copy is a deliberate alternative for portals; formatting must remain intact in rich exports. Do not rename HTML as DOCX or claim a successful PDF export without an actual file.

A final package binds candidate, job/JD revision, source kind/ID/version, application CV revision, optional letter revision and exact approval revision. Approval and export reject stale or mismatched bindings. A real application email should be visible/copyable and a verified URL should open the employer portal; neither action sends or submits an application automatically.

Acceptance: existing CV → skip letter → package → download/copy; tailored CV → edit/approve → draft/edit/approve letter → package; change CV after letter approval and require renewed review; same sequence from an approved returning-user CV Variant; date Cancel versus OK; conditional required markers; manual submission remains separate.
