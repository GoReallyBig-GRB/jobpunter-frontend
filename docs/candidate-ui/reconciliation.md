# Implementation and reconciliation procedure

1. Select a gap, check current contracts and claim ownership in gap-register.json. Record the exact frontend/backend baselines. Treat the old review as a starting point, not current truth.
2. Record conflicts in reconciliation-log.md: requirement ID, old behavior, governing decision, proposed contract, affected journeys and evidence. Do not resolve product ambiguity by quietly changing UI semantics.
3. Work on one repository at a time. Backend contract changes precede dependent integration. Use stable gap IDs in branch/PR descriptions and tests.
4. Open → Implemented requires code/PR references and an explanation of all affected acceptance criteria. A stub or a simulated path does not qualify.
5. Implemented → Verified requires recorded commands/scenarios, outcome, date, exact commits and relevant failure/authorization checks. Separate local tests, cross-repository integration and deployed verification. A missing environment is a blocker, not a pass.
6. Verified → Closed requires all acceptance criteria satisfied and a recorded reviewer/agent reconciliation decision referencing the evidence. Never automatically close all gaps because a PR merged. Reopen if a test or contract regression invalidates the evidence.

## Minimum integration scenarios

- Empty account searches without CV: facts available, personal fit pending, no invented package.
- Upload or create/approve CV: same result IDs assessed, selected opportunity retained, no external search dispatch.
- Punt and viable non-Punt application paths preserve recommendation meaning.
- Two jobs have independent documents, Q&A, submissions, pipeline history and interviews.
- Edit then save/approve/export: exact evidence/version and A4 formatting round trip, including partial failure.
- Watch → fresh login → 14 days inactivity: deduplicated reminder expiry, saved history retained.
- Interview unfinished/repeat/end: durable results and agreed two-reminder behavior across devices.
- Revoked/foreign job visibility cannot be bypassed through saved jobs.
- Phone widths 320/360/390/412/430: two-column clusters, no clipping/word fragmentation; single-row swipeable footer.

## Evidence record template

Gap ID; owner; frontend commit; backend commit; PR links; requirement IDs; test command or manual steps; expected/actual result; fixture or live scope; screenshots/artifacts; remaining blockers; verification date; closure decision.

The frontend gap-register.json is authoritative. Backend agents can update it after finishing backend work, or submit the evidence in their PR and leave the gap Open until the register is reconciled. Do not create a divergent backend status register.
