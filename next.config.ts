import type { NextConfig } from 'next';

// Deployment secrets must remain server-side. The current browser-based
// Gemini provider therefore uses only an explicitly user-supplied API key.
// A shared deployment key can be reintroduced only through an authenticated,
// rate-limited server-side AI endpoint.
const nextConfig: NextConfig = {};

export default nextConfig;
