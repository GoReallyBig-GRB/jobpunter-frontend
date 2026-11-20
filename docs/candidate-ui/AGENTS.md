# Candidate implementation and reconciliation instructions

Read README.md, requirements.md, workflow-map.md, gap-register.json and review.md before implementing a candidate journey. These instructions concern this handoff; repository-level instructions still apply.

- Work on one repository at a time. Preserve unrelated changes. Use the existing frontend architecture and typed clients.
- Recheck current backend contracts before coding: the review is pinned to a historical commit and is not a live deployment guarantee.
- Latest product decisions outrank older briefs. Record contradictions and their resolution in reconciliation-log.md with a requirement/gap ID and evidence.
- Keep central-pool architecture, refresh cadence and connector administration out of candidate UI text. Candidate search must not launch external acquisition.
- Use per-candidate, per-job, per-application IDs and exact approved document revisions. Never port demo globals or fixture assessments as production state.
- Preserve approved mobile styling: two columns for small card clusters at every phone width; individual glowing borders; no outer cluster container; one horizontally scrollable footer row.
- Keep prototype state/data isolated from real accounts. Do not add credentials, access-bypass tokens or real candidate documents to the package.
- Pick a gap and record an actual owner before implementation. Follow Open → Implemented → Verified → Closed. Code existing is not verification. Failed evidence returns the item to Open with a reason; never silently erase prior evidence.
- Each implementation needs repository/commit or PR references, contract changes, affected requirements and test evidence. Record backend readiness separately from frontend integration and deployed availability.
- Do not mark a gap Closed until its acceptance criteria pass on recorded frontend/backend revisions and the reconciliation decision is recorded. Missing live dependencies remain explicit blockers.
- Use ../candidate-ui-contracts in the backend repository for backend mapping, not this path in the frontend repository. Shared IDs are CUI-001 through CUI-009.
