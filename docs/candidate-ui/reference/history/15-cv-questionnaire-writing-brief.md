# Short questionnaire → professional CV writing brief

17 November 2026. Target roles and career intent are separate facts. Never put a bare job title under Career Objective, infer ambition from a role name, or present a desired role as an employment history fact.

## Essential prompts

| Question | Use in the CV / system |
|---|---|
| What role are you looking for? You can add more than one. | Ordered target roles. First role is the CV headline; alternatives inform proposed Career Pathways. Preserve previous actual job titles. |
| What do you intend to achieve in this role? | Explicit career intent for the first target role. Ask who/what they want to help and what they want to improve or deliver. One sentence is enough; optional when unsure. |
| What did you do in this role? | Two or three responsibilities, people served, tools/methods and scope, attached to the correct experience record. |
| What improved because of your work? | Optional result, problem solved or feedback for that record. Quantify only from supplied, supportable figures. Qualitative outcomes are valid. |
| Which skills, tools or methods would help you succeed in these roles? | Three to five confident capabilities, grounded where possible in the examples provided. |

Keep the existing structured identity, dated experience and education fields. Do not ask the candidate to write their own professional summary. Do not repeat the same achievement in several mandatory sections. Additional achievements, projects and evidence sit in an optional collapsed section; they remain repeatable. No work experience is a valid state.

## Churn controls

The required core stays target role(s), basic contact/location and skills; experience and education can be omitted when not applicable. A short intent answer improves targeting but is not a generation gate. One experience entry appears initially, with additional entries on request. Responsibilities and results are short prompts within each entry, not separate essays. Preserve answers when adding/removing entries or navigating away within the preview. Production needs autosaved resumable drafts and a clear saved indicator.

Use one primary headline per CV, not a long list of unrelated job titles. Additional target roles can lead to separate variants only after evidence review and candidate approval. Do not force four Career Pathways or claim that naming a target establishes qualification for it.

## AI input and writing rules

Pass `targetRoles[]`, `primaryRole`, `careerIntent { text, role } | null`, structured experience with responsibilities and optional results, education, skills and linked evidence IDs/status. Keep questionnaire answers and approved facts versioned and attributable. The demo captures these separately in its writing brief.

The writing agent may combine the primary role and explicit intent into a concise objective; it must not invent outcomes, seniority, years of experience, numerical achievements or career motivations. If intent is absent, omit Career Objective. An evidence-grounded professional summary may be proposed from supplied experience instead; if that is insufficient, omit the summary rather than fill it with generic claims. Intent is an aspiration, not proof of a past achievement.

For experienced candidates, prioritize a concise professional summary grounded in their work; use an explicit objective when useful for entry-level candidates or career changes. These are draft editorial choices requiring candidate review, not automatic claims. Ask a targeted follow-up only when a missing answer materially changes accuracy or usefulness.

Generate the same versioned rich-document schema used by the WYSIWYG editor and A4 export. Starter CV approval retains it as the Master CV baseline and career source; full profile/pathway processing stays reviewable. Entry context still determines whether approval returns to collected-result matching or the selected application.

## Example distinction

Target roles: **Service coordinator; Operations assistant**. Intent: **Help service teams keep appointments reliable and maintain clear records.**

CV headline: **Service coordinator**. A possible objective draft: **Seeking a service coordinator role focused on reliable appointments and clear service records.** The draft restates the supplied aim; it does not claim the candidate has already achieved those outcomes. The second role remains an alternative target, not a second simultaneous CV headline.

Validation: multiple targets remain separate; only the first is the headline; intent is stored separately and scoped to that role; omitted intent produces no objective; responsibility/result text retains its experience association; dates and existing job titles remain unchanged; source and approval versions survive edits.
