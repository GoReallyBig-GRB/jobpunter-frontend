# Next.js Migration Regression Checklist

Use this checklist against a deployed preview for `migration/vite-to-nextjs`. A green type-check/build/HTTP smoke test is not a substitute for browser regression testing.

## Environment and startup

- [ ] Open the preview in a clean browser profile; confirm the home screen renders without a blank page or uncaught console errors.
- [ ] Reload the page and confirm the app returns to a usable state.
- [ ] Confirm no Vite assets, Vite dev-server assumptions, or Vite environment-variable names remain in the runtime path.
- [ ] Confirm the configured backend base URL is available only through `NEXT_PUBLIC_JOBPUNTER_API_BASE_URL`.

## Google sign-in and application API authentication

- [ ] Sign in with Google using a test account; verify the user becomes authenticated.
- [ ] Reload after sign-in; verify application session restoration behaves as designed.
- [ ] Sign out; verify protected backend requests stop and the user state clears.
- [ ] Test popup cancellation and denied permissions; verify the app displays a recoverable error.
- [ ] Verify backend requests use the application identity ID token as `Authorization: Bearer …`.
- [ ] Verify Google Workspace OAuth access tokens are never sent as backend API credentials and are not written to localStorage/sessionStorage.

## Google Workspace

- [ ] Complete the Workspace consent flow with a test account.
- [ ] Verify Drive, Gmail, Calendar, and Tasks actions required by the current UI.
- [ ] Reload the app and verify the expected re-consent/refresh path when the in-memory Workspace token is absent.
- [ ] Verify revoked consent, missing scopes, and API failures show actionable errors rather than breaking the app.

## Existing state and product workflows

- [ ] Confirm previously saved jobs, source emails, settings, active candidate preset, master profile, preferences, career pathways, CV variants, master CV, AI task settings, and integration settings remain present.
- [ ] Create/edit/delete a test job and verify state survives a reload.
- [ ] Update profile and preferences; reload and verify values persist.
- [ ] Create/update/delete a career pathway and CV variant.
- [ ] Run the built-in job evaluation diagnostics and compare results with the pre-migration build.
- [ ] Test manual job-description entry, CSV import/export, JSON import/export, and email-alert parsing.
- [ ] Test PDF/DOCX/TXT profile import and CV generation/export workflows supported by the current UI.
- [ ] Verify empty, loading, offline, malformed-file, permission-denied, and API-error states.

## Release hygiene

- [x] Commit the npm-generated `package-lock.json` and use `npm ci` in CI.
- [ ] Verify provider credentials are absent from client-side JavaScript in a deployed build. Source guards do not replace bundle inspection and runtime verification.
- [ ] Verify the backend origin, Google sign-in authorized domains, Workspace consent configuration, and redirect/popup behavior for preview and production domains.
- [ ] Record test date, browser, environment, tester, and defects before marking the migration release-ready.

## Known code-level considerations

- `JobContext` initializes state from localStorage; this legacy client-side boundary is retained temporarily and is not proof of backend persistence.
- Google sign-in and Workspace API authorization are distinct. Request only the Workspace scopes required by tested features.
- Candidate AI settings must not expose API-key entry or provider/model/task-routing controls. AI requests should go to the separate backend API, which must enforce authentication, input bounds, system-managed provider settings, safe errors, and usage controls.
- The AI task API is under review in the backend repository. Do not mark end-to-end AI integration complete until that API is available in the target environment and every supported task is tested.
- Existing client state must not be deleted or replaced as part of the framework migration. Domain migration requires a separate verified plan.

## Automated CI evidence

Previous green runs documented on this branch validate dependency installation, source guards, type-check, production build, and HTTP smoke tests for the commits listed in the original history. They do not validate the repository cleanup commit or complete browser-level regression. Re-run CI on the current branch head and complete the unchecked browser tests before treating the migration as release-ready.
