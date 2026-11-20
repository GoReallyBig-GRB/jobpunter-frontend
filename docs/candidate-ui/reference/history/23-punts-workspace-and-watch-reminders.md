# Punts workspace and watched-Punt reminders

Punts is a dedicated recommendation workspace, not another Job Pool view. Show the truthful daily count (candidate timezone), premium recommendation cards and a record filter for new/all/watched/applied/rejected. Preserve the recommendation identity and original evidence after Watch/Reject or submission; candidate disposition must not erase history.

Watch saves a Punt. On a fresh authenticated login, aggregate eligible watched Punts into one notification: You are watching N Punts. Use per-candidate, per-Punt watch activity timestamps. Stop including a Punt after 14 days without meaningful action. Viewing the notification or simply signing in does not reset the clock. Reviewing the Punt or deliberately watching again may reset it. Stop reminders immediately on unwatch, rejection or recorded submission. Expiry suppresses reminders, not the saved record. Deduplicate notification per login/session, respect timezone and use server timestamps in production.

Applied means the candidate recorded actual employer submission; opening preparation or approving a package is not Applied. Backend must persist recommendation ID, job ID/version, candidate ID, recommendation time, original fit/evidence version, disposition events, watch activity time and submission link. Historical stale/expired matches remain identifiable and must not be presented as current actionable fits.

Prototype scope: local records and simulated sign-in demonstrate the filter and reminder behavior. Real login delivery, persistence, multi-device history and backend notifications are not connected. Existing central-pool architecture remains internal; no architecture details enter candidate copy.

Visual refinements: warm yellow eyebrows, tinted Home quick actions and section cards, icon cards for Career navigation. Required labels use one shared marker. Keywords display a comma-separation hint. Clear filters sits beside Filters when expanded; Search pool remains below the fields.
