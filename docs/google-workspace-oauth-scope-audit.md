# Google Workspace OAuth Scope Audit

**Status:** per-integration consent implemented in the frontend branch; automated CI contract checks are being added. Real Google-account consent and API-operation tests remain required before production release.

## Consent boundary

Google sign-in authenticates the JobPunter user and does not request Drive, Gmail, Calendar, or Tasks access. The user must separately choose each Workspace integration to authorize. Tokens are cached in memory per integration and cleared on sign-out or page reload. They are not stored in browser storage and must not be sent as backend API credentials.

| Integration | Requested scopes | Observed operations |
|---|---|---|
| Google Drive | `drive.readonly`, `drive.file` | List/read files, create the JobPunter folder, upload app files, download/export content, delete selected files |
| Gmail | `gmail.readonly`, `gmail.send` | Search and read messages; send email after explicit user confirmation |
| Google Calendar | `calendar.events` | List, create, and delete calendar events |
| Google Tasks | `tasks` | List task lists/tasks, create task lists/tasks, update task status, delete tasks |

## Security constraints

- No Workspace scopes are requested during ordinary Google sign-in.
- Each integration uses its own access-token cache entry.
- The backend API continues to use the application identity token, never a Workspace access token.
- Workspace tokens are memory-only; refresh/reload requires the user to reconnect the relevant integration.
- Sign-out clears all in-memory integration tokens.
- UI actions that send email or modify remote resources must retain explicit user confirmation where required.
- Google OAuth consent revocation remains available through the user's Google Account settings; the app's sign-out clears its local in-memory tokens but is not represented as remote revocation.

## Verification still required

- Test first-time consent, denied consent, revoked access, reconnect after page reload, and token isolation between integrations with a real test account.
- Verify that the selected scopes support each listed API operation in the configured Google Cloud project.
- Confirm Drive file deletion behavior is consistent with the product's least-privilege policy.
- Confirm integration errors are visible and do not silently drop user data.
