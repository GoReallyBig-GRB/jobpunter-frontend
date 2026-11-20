# Shared career and CV structure — AI handoff

18 November 2026. Governs the candidate prototype and proposed production integration. The attached design review and the candidate’s explicit decisions govern this design; existing UI conventions do not define product behavior. No production repository or API was changed.

## One structure, distinct sources and approvals

Use `career-cv-v1` for questionnaire mapping, Master Career Profile, generated Master CV, CV Variants and job-tailored CVs. Keep these sections in this order. Omit empty sections from exported documents, while retaining their fields in the profile. A missing Career Objective is omitted, never guessed.

1. Job Title (Career Pathway)
2. Career Objective
3. Personal details
4. Experience
5. Education & qualifications
6. Projects & other work
7. Skills, methods & resources
8. Links & supporting evidence

Repeated jobs, qualifications and projects are entries within their section, not repeated section headings. Contributions and achievements belong to the experience/project they support. An independent achievement can be a project/other-work entry. The CV headline is the chosen target role; it never replaces a historical employment title.

## Question → profile → document mapping

`*` means required for the short initial CV questionnaire. Optional follow-up information can be added later. Required experience fields apply only when an experience entry is used.

| Candidate question / input | Canonical profile field | CV section / use | Source and generation rule |
|---|---|---|---|
| What role are you looking for? You can add more than one. * | `careerIntent.targetRoles[]`, `primaryRole` | Job Title (Career Pathway) | First role supplies the headline. Other roles are unapproved pathway suggestions, not established competencies. |
| What do you intend to achieve in this role? | `careerIntent.objective`, `objectiveRole` | Career Objective | Use explicit intent with its role context. Improve clarity without inventing motivation, seniority, claims or goals. Omit when blank. |
| Name * | `personal.name` | Personal details | Candidate-entered or extracted source, with provenance and review. |
| Location * | `personal.location.{city,region,country}` | Personal details | Capture a readable location; production normalization must preserve the original input. Do not infer nationality or authorization. |
| Email * / Phone | `personal.email`, `personal.phone` | Personal details | Validate format; never infer missing contact details. Phone remains optional. |
| Nationality / Languages and proficiency | `personal.nationality`, `personal.languages[]` | Optional Personal details | No inference from name, location or writing style. Store separately from permission to print. |
| Work authorization / jurisdiction | `personal.workAuthorizations[]` | Optional Personal details | Candidate statement, including restrictions. Work preferences and residence are not evidence of legal authorization. |
| Include these additional details in this CV | `documentDisclosure.personalFields[]` | Publication control | Off by default. Stored profile data does not imply consent to include it in a CV. Production requires field-specific disclosure controls. |
| Role / work performed; Organisation / client; Start; End or Still work here | `experience[].{role,organisation,startMonth,endMonth,isCurrent}` | Experience | Required together when an entry is used. Keep dates at the supplied precision; current role has no fabricated end date. Validate chronology. |
| What did you do in this role? | `experience[].responsibilities[]` | Experience | Extract action, subject, context and tools from the answer. Keep role scope and ownership accurate. |
| What improved because of your work? | `experience[].achievements[]` | Experience | Use supplied result or feedback. Never add a numerical impact, causal claim or leadership claim unsupported by the source. |
| Field of study; Institution; Certification / degree; Year | `education[].{field,institution,award,year}` | Education & qualifications | Preserve distinctions between completed, current and unfinished study when supplied. Do not upgrade qualification level. |
| Achievement; Work / project name; Date; What did you contribute? | `projects[].{achievement,title,date,contribution}` | Projects & other work | Repeatable across sectors: employment, volunteering, practice, research, craft and independent work. No product-management assumptions. |
| Evidence link / Upload evidence | `evidence[].{sourceId,uri,assetId,claimIds}` | Links & supporting evidence; claim provenance | Keep the relation to the project or experience. A filename is not parsed evidence and a link is not verified merely because it was entered. |
| Which skills, tools or methods would help you succeed in these roles? * | `skills[].{name,kind,experienceIds,evidenceIds}` | Skills, methods & resources | Candidate-stated skills may be unverified. Do not manufacture years of use or proficiency. |
| Relevant links / Supporting documents | `evidence[]`, `professionalLinks[]` | Links & supporting evidence | Optional. Production must parse, classify and verify uploaded material before using it as factual support. Show only candidate-selected public links in exported CVs. |
| Review, edit and approve generated output | `documentVersions[]`, `approval` | All sections | Approval binds the exact document revision, source profile revision, chosen pathway and JD revision where applicable. Editing makes the new version a draft. |

## Generation request

Provide the AI agent a structured request, not concatenated UI prose:

- `schemaVersion`, `documentKind` (`MASTER`, `VARIANT`, `TAILORED`) and requested language.
- Immutable source snapshot: profile revision, source CV revision, provenance per field, evidence references, conflict/gap flags and candidate risk acceptances.
- Chosen target role; approved pathway ID/version for a CV Variant; actual JD ID/version and approved base CV version for tailoring.
- Candidate-supplied career intent, disclosure choices, desired paper size and a versioned layout template.
- Permitted task: improve professional expression, select supported relevant content and use applicable JD terminology without altering meaning.
- Forbidden output: invented facts, education, employment, evidence, metrics, proficiency, authorization, responsibilities or unsupported keywords presented as experience.

For a tailored CV, preserve the base CV. Return the keyword-to-source mapping and proposed changes separately for candidate review. A keyword with no supporting source is a visible gap, not an instruction to fabricate a claim. Risk acceptance does not convert a gap into evidence or remove an employer requirement.

## Generation response and document model

Return a structured rich-document tree with stable section and entry IDs. Each factual block references source fields/evidence. Return a change summary, unresolved gaps, source-version identifiers and a new draft revision alongside the document. Plain text or Markdown alone is not a sufficient editor contract.

The production document service should render the same tree as editable rich text, A4 paper preview, PDF and DOCX. Support paragraphs, headings, fonts, sizes, weight, colour, underline, emphasis, links, alignment, indentation and ordered/unordered lists. Sanitize imported markup and allowed URL schemes. A mobile reading view must not rewrite the canonical page dimensions or discard layout.

The prototype uses sanitized HTML and ordered sections to demonstrate this contract. It is not a production document engine: export is HTML with A4 print settings; PDF/DOCX fidelity, pagination and provider-generated documents remain backend/editor integration work.

## Profile feedback and revision policy

An approved uploaded or guided CV is a source baseline for the first application and background career drafting. The CV’s approval does not approve inferred profile facts or pathways. Transfer data by canonical field IDs, retain missing values, and require review of background drafts. Never parse section headings as the production integration contract.

Profile edits invalidate dependent drafts and matching where their source revision changes. Career Pathways reflect experience breadth, not a mandatory count of four. Generated CV Variants need individual review and acceptance. Tailoring retains source versions and the actual JD snapshot; off-app uploads require a source/variant/JD comparison before approval.

## Prototype coverage

The active guided questionnaire, assembled profile, Master CV generation and CV Variant generation use the shared section order. Application CVs inherit the approved base document structure. Main candidate navigation points to these current flows. Older overlapping screens remain in the review picker as historical design references, not additional routes to implement. Arbitrary manual rich-text edits remain possible; production should warn about structural changes without silently rewriting candidate edits.
