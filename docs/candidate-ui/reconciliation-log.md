# Reconciliation log

## 2026-11-19 — Baseline handoff

All CUI-001–009 remain Open. Packaging does not implement or verify the gaps. The central-pool product decision supersedes PRD candidate-triggered external search. Backend pipeline mapping and exact interview abandonment timing remain unresolved. Current backend/frontend baselines are in manifest.json. No production code or deployment is changed by this handoff.

## 2026-11-20 — Owner correction and visible integration gaps

Owner reports backend deployed and central acquisition complete at approximately 20 runs daily; candidate searches/daily updates draw from the pool. CUI-001 now requires locating/verifying that implementation and integration, not presumed reimplementation. Status remains Open pending evidence. Added action-level connection policy/registry and Pages preview-first integration plan.


## 20 November 2026 - initial candidate implementation (Codex)

R01/R08/R09/R10; CUI-001 through CUI-009 remain Open. Owner claimed in the gap register. See implementation-progress.md for code, deployed backend revision 3046731, provider evidence, passed gate checks and outstanding build/runtime acceptance. Candidate search targets the pool GET, never the connector-dispatching mission path. No backend files changed. No gap is promoted based on scaffolding or service deployment.


## 20 November 2026 - direct search entry (owner browser comment)

R01/R03: the Home Find opportunities CTA must open Discover with the search panel and filters already expanded, so the candidate can start entering criteria immediately. Apply the same direct-entry behavior to the Job Pool Find opportunities CTA. Ordinary Discover tab navigation retains the collapsed default. No API action runs on navigation, and connection gates remain unchanged. Implementation: src/candidate/CandidateApp.tsx, existing frontend PR #8.
