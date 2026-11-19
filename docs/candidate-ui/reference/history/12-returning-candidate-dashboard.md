# Returning candidate dashboard

16 November 2026. Home is the returning workspace. The first-time search welcome is a separate onboarding screen shown after account creation, not the normal sign-in destination.

Lead with a high-level view of available jobs, supported Punts and applications; show actionable updates before optional discovery. Group outstanding document approvals and packages awaiting manual submission under Needs your attention. Show new recommendations, notification links, application stages and dated activity. Support conversations and quick actions remain accessible. Global search is a secondary action that opens its own dedicated screen.

Use actual candidate records, never decorative or invented totals. New since last visit is distinct from total available; persist a last-seen cursor and read state to support that distinction. Link cards to the relevant filtered list or exact opportunity/document/ticket. Return navigation retains the dashboard context.

Pipeline attention requires last-meaningful-update timestamps, stage-specific inactivity thresholds and candidate timezone. A stale record is a prompt to check, not evidence of rejection or employer silence. The preview uses a seven-day example threshold for active records; production should configure thresholds per stage and exclude terminal records, planned future interviews and snoozed reminders. Never advance stages automatically on age alone.

Ticket summaries need unread inbound-reply counts, author/direction, last-reply timestamp and ticket deep links. Do not treat candidate-sent messages as unread support replies. The preview shows recorded conversation activity without claiming unread status.

Backend support: candidate-scoped dashboard projection with counts, outstanding approvals, approved packages awaiting submission, latest discovery outcomes, pipeline attention, ticket replies, schedule/source health and recent audit events. Include freshness, partial-error and empty states for each section so a failed query is not displayed as zero. Provide pagination/cursors and actionable entity IDs; enforce candidate authorization on every linked resource.

Incomplete setup remains one contextual Continue career setup action; it must not dominate a returning candidate’s workspace or replace their application progress. Fully configured users see ongoing outcomes and exceptions. Recurring discovery and Gmail access retain separate approval and health states.

Current prototype separates first-time welcome from Home and derives dashboard sections from local example state. It does not persist real accounts or retrieve live dashboard data.
