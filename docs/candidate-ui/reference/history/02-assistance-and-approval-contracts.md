# jobpunter assistance and approval contract requirements

16 November 2026 · Product design integration register, not a claim of implemented APIs

The explicit product-owner clarification in `01-assisted-candidate-workflow.md` governs. Current routes must be inspected before implementation; paths below are deliberately not invented endpoints. The frontend architecture and technology stay.

| Capability | Required persisted relationship and behavior | Gap or verification task |
|---|---|---|
| Source-led profile setup | Uploaded documents/links → extraction/provenance → assembled profile draft → reviewed factual version | Existing import confirmation and profile update are separate. Define assembly, material-level outcomes, explicit mapping and commit approval |
| Action approval | Proposal type, purpose, input versions, bounded scope/batch, decision actor/time, result/execution, expiry/revocation/supersession | Establish shared approvals where missing; never a client-side boolean granting backend authority |
| Pathway suggestion/custom pathway | Approved profile snapshot → suggestions/support/gaps → amendments/custom targets → candidate decision | Four is an initial suggestion target, not a minimum/maximum contract; preserve support analysis |
| Evidence-risk acceptance | Exact flag/requirement, source/input versions, decision scope, risk explanation, candidate reason/time, preserved original state | Distinguish overridable uncertainty from contradiction and genuine hard eligibility. Define effect on qualification and material readiness explicitly |
| CV Variant generation | Approved pathway version + profile/evidence versions → task execution → structured CV draft/version → review/edit → exact acceptance | Remove unnecessary manual variant-creation burden. Current Master/variant contracts need pathway linkage and automated professional drafting verification |
| Punt recommendation | Canonical job/JD + candidate evaluation/rank + approved/adjacent pathway relation + recommended accepted CV version | Verify ranking metadata, relation reason, source readiness and candidate-safe returned projection |
| Clean adaptation | Accepted CV Variant + actual JD + approved evidence + approved action → draft/diff/execution → exact acceptance | Optional path; source variant unchanged; unsupported claims remain blocked/flagged under explicit policy |
| Cover letter/package | Job-specific content and evidence refs + optional selected artifacts + warnings/waivers + immutable approval snapshot | Generation, content acceptance, package approval, application readiness and actual file delivery remain separate operations |
| Portal-question assistance | Punt/application ID + actual pasted questions + relevant approved context → draft answers/evidence/confidence/warnings → edits/approval/copy | Verify actual-question input and structured output support; generated likely Q&A alone does not fulfill the portal workflow |
| Monitoring | Explicit integration consent and approved monitoring scope → observed signal/source → proposed event → candidate-approved canonical transition | Do not claim submitted/interview/offer from an unverified guess. Support corrections, event conflict handling and canonical enum mapping |
| Interview preparation | Opportunity/invitation/context → approved plan → question set → answer/session → rubric/version/scores/reasons → retry/history | No interview-specific complete session API/task implementation was established by this design pass. Add/verify orchestration and persistence; do not present the generic AI endpoint as proof |

## Risk boundary

Insufficient-evidence acceptance must be an executable product policy. It is not enough to display a warning and then let an unchanged backend reject every such pathway/Punt. Conversely, it is not acceptable to clear the original warning or pass fabricated evidence into generation. Requirements, rule categories and supported waiver outcomes need explicit backend tests.

Version binding matters: a risk accepted for a particular pathway/job context is not unlimited permission for later roles, different requirements, changed facts or stronger unsupported claims. Re-assess material changes and request renewed acceptance where the risk changes.

## Acceptance and effort tests

Verify upload → profile acceptance → one pathway or several → evidence waiver with reason → generated CV review/edit/approval → pathway-linked Punt/source CV → optional adaptation → optional cover letter → package acceptance → external manual submission → actual-question assistance in the same Punt → recorded/approved monitoring event → interview practice/feedback → outcome.

Negative cases: four pathways are not mandatory; inactive pathways do not quietly enter matching; a CV draft is not a frontline accepted CV; a new revision does not inherit acceptance; a waiver is not evidence; a matching approval is not mailbox consent; package approval is not submission; an observed message is not automatically an accepted outcome; practice scores are not hiring probabilities.

Measure the number of facts typed twice, redundant confirmations, unnecessary document selections and manual recovery steps. Preserve meaningful decisions while eliminating clerical work and technical-step approvals inside an already authorized bounded operation.
# Additional product requirement — universal generated-record editing

Every generated candidate datum must be reachable through an accessible pencil edit action, with approval of the resulting exact version. Preserve the original generated value and previous approved revisions. A candidate amendment is not automatic approval or independent verification. Profile/pathway changes invalidate dependent readiness; stale CVs require source review and versioned refresh. This applies to extracted profile fields, suggestions, candidate assessments, documents, answers, proposed application updates and interview feedback. Preserve evidence flags when editing their descriptions; retain scoped risk acceptance separately.

Candidate discovery must cover the PRD's Quick Match, daily/weekly schedules, URL, full JD, manual email, authorized email alerts and permitted API/feed paths. All converge on the canonical Job Pool and source provenance. See `04-application-refinement-and-work-queue.md` for the candidate routes and outstanding integration detail.

