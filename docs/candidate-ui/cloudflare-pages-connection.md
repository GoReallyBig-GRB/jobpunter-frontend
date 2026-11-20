# Frontend connection and Cloudflare Pages plan

## Current staging decision - 20 November 2026

Latest owner decision: main staging is `https://jobpuntertest.goreallybig.com/`; actual production is reserved at `https://jobpunter.goreallybig.com/`. The Pages root below is a fallback staging address. The custom staging domain is active on Cloudflare, with one proxied CNAME to `jobpunter-candidate.pages.dev`. No production DNS record was created or changed. The owner confirmed adding all three stable hostnames to Firebase authorized domains.

Use `https://jobpunter-candidate.pages.dev/` as the owner-requested stable staging address. This is a separate Pages project connected only to the candidate handoff work. Its Cloudflare root slot is labelled `production`, with `docs/candidate-ui-handoff-2026-11-19` as the configured branch, automatic production deployments disabled and integration-preview mode enabled. This does not authorize an actual JobPunter production release. GoReallyBig is a separate static site and was not changed.

Hosted CI has validated `output: 'export'`, `npm run build` and the `out` artifact at frontend commit `4c99c88`. Backend provider evidence identifies `https://jobpunter-api.onrender.com`, revision `3046731`. The first hashed preview deployed successfully; its sign-in attempt failed with Firebase `auth/unauthorized-domain`. The stable root domain must be authorized in the Firebase project trusted by the backend, and backend CORS must allow its exact HTTPS origin. These steps do not enable data actions without separate acceptance evidence. See implementation-progress.md for the build/runtime evidence and remaining blockers.

The original pre-implementation plan follows for context; its claims of unknown configuration are superseded by the evidence above.

Owner reports backend deployed, frontend not deployed (20 November 2026). This document does not claim an inspected Cloudflare project, verified backend URL or successful deployment.

## Sequence

Build the approved UI incrementally, connect one complete journey early, deploy a preview, then expand coverage. Do not wait until every screen is finished to discover authentication, CORS or build problems. Unconnected actions follow backend-connection-policy.md. Promote to production only with accepted scope and verified connected behavior.

## Existing repository wiring

- Next.js App Router wraps a browser-rendered React application.
- src/services/apiClient.ts reads NEXT_PUBLIC_JOBPUNTER_API_BASE_URL and adds Firebase identity bearer tokens. Its API paths already include /api/v1: configure the backend origin without adding that prefix again.
- next.config.ts currently has no output: 'export'. The repository is not yet proven Pages-ready.
- Backend CORS configuration uses JOBPUNTER_CORS_ALLOWED_ORIGINS with explicit origins. Authorize the exact intended preview/production frontend origins, not an unrestricted wildcard. Sign-in must also allow the frontend domains in the identity provider configuration.

## Pages setup once static export is validated

1. Verify the existing Cloudflare Pages project/repository linkage and production branch. Preserve that project rather than creating an accidental duplicate.
2. Confirm there are no server-only Next.js requirements; configure static export and run the full build. If server rendering becomes necessary, reassess hosting deliberately instead of uploading an incompatible build to Pages.
3. Use npm run build and output directory out for the validated static export. Use PR/branch previews before production.
4. Set NEXT_PUBLIC_JOBPUNTER_API_BASE_URL to the verified deployed backend HTTPS origin in the appropriate Pages environment. This public URL is build-time configuration; rebuild when it changes. Configure required public Firebase settings, but never backend credentials, provider secrets or database URLs in NEXT_PUBLIC variables.
5. Coordinate exact allowed origins and identity-provider authorized domains. Prefer a stable integration-preview hostname; do not silently open CORS to arbitrary previews. A preview using production APIs can change real data: use test identities/data or an appropriate backend test environment.
6. Verify sign-in, authenticated read/write, ownership denial, browser refresh, error states and no fixture fallback on the deployed preview. Verify one complete workflow before expanding all screens.
7. Promote the reviewed build with explicit production authorization; preserve rollback information.

Cloudflare hosts the frontend files; the browser calls the deployed backend over HTTPS. The backend does not need to move to Cloudflare merely because the frontend uses Pages.

Official reference checked 20 November 2026: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/ (static export, out directory and preview deployments).

Missing deployment inputs: verified backend origin/revision, existing Pages project name and domains, approved test identity/environment. These must be discovered/confirmed before changing service configuration; they do not prevent UI implementation.
