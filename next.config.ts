import type { NextConfig } from 'next';

// Deployment secrets must remain server-side. The current browser-based
// Gemini provider therefore uses only an explicitly user-supplied API key.
// A shared deployment key can be reintroduced only through an authenticated,
// rate-limited server-side AI endpoint.
// App Router has a single static entry point; authenticated reads and writes
// run in the browser against the separately deployed API.
const nextConfig: NextConfig = { output: 'export' };

export default nextConfig;
