# Candidate UI implementation handoff

Version: 2026-11-19. Status: approved design reference with open reconciliation gaps; not production-ready code.

## Start here

1. Read [agent instructions](AGENTS.md) and [approved requirements](requirements.md).
2. Open [the runnable demo](demo/index.html), then use its screen picker to inspect the candidate journeys.
3. Read the [gap register](gap-register.json), [review evidence](review.md), and [workflow/API map](workflow-map.md).
4. Implement one repository at a time. Record evidence using [the reconciliation procedure](reconciliation.md).

The runnable demo is bundled with its icon library and requires no account, API key, package installation or network access. Open `docs/candidate-ui/demo/index.html` directly in a browser. Alternatively run `python -m http.server 8765 --bind 127.0.0.1 --directory docs/candidate-ui/demo` from the repository root and visit http://127.0.0.1:8765. All data and actions are simulated. Reloading may reset state. Never enter real personal data.

[Hosted preview](https://jobpunter-candidate-demo.endearingkiwi4.chatgpt.site/) is supplementary and may require its owner's access permissions. Repository access is sufficient for the local demo and all handoff documents.

## Authority and boundaries

Latest explicit product decisions → consolidated requirements here → PRD where still applicable. The demo specifies presentation and interaction intent, not API contracts or production algorithms. Existing backend code proves current capabilities, not automatic compliance with the desired product. Log unresolved conflicts instead of inventing behavior.

The original 23 design briefs are retained in [reference/history](reference/history) for context. They contain superseded proposals. Start with requirements.md, not an old numbered brief. The [PRD text snapshot](reference/prd-v1.6.txt) is a read-only reference copy; original document layout is not retained.

The authoritative gap status lives only in this repository's gap-register.json. Backend work references those IDs through its `docs/candidate-ui-contracts/README.md`; it must not maintain a competing status list. [Source manifest](manifest.json) records baselines and checksums. [Cross-repository backend handoff](https://github.com/GoReallyBig-GRB/jobpunter-backend/tree/docs/candidate-ui-contracts-2026-11-19/docs/candidate-ui-contracts).

Application implementation belongs in the existing Next.js/React/TypeScript architecture. Do not embed this prototype as the production application, copy fixture matching, or claim real submission from a preparation click.
