// Read-only hosting diagnostic. This never sends identity tokens or candidate data.
// A pass proves liveness/CORS only, not authenticated candidate acceptance.
const api = new URL(process.env.CANDIDATE_API_ORIGIN);
const frontend = new URL(process.env.CANDIDATE_PREVIEW_ORIGIN);
for (const url of [api, frontend]) {
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Runtime diagnostic requires HTTPS origins without credentials or paths.');
  }
}
const report = { api: api.origin, frontend: frontend.origin, authenticatedJourneyVerified: false };
let passed = true;
try {
  const response = await fetch(new URL('/api/v1/health', api), { signal: AbortSignal.timeout(45000) });
  const body = await response.json();
  report.health = { status: response.status, deploymentRevision: body?.data?.deployment_revision ?? 'unknown' };
  passed &&= response.ok && body?.data?.status === 'ok';
} catch (error) {
  report.health = { error: error.name === 'TimeoutError' ? 'Health request timed out' : 'Health request failed' };
  passed = false;
}
report.preflights = [];
for (const [path, method] of [['/api/v1/candidate/jobs/pool', 'GET'], ['/api/v1/candidate/preferences', 'PUT']]) {
  try {
    const response = await fetch(new URL(path, api), {
      method: 'OPTIONS',
      headers: { Origin: frontend.origin, 'Access-Control-Request-Method': method, 'Access-Control-Request-Headers': 'authorization,content-type' },
      signal: AbortSignal.timeout(15000),
    });
    const allowOrigin = response.headers.get('access-control-allow-origin');
    const methods = response.headers.get('access-control-allow-methods') || '';
    const headers = (response.headers.get('access-control-allow-headers') || '').toLowerCase();
    const okay = response.ok && allowOrigin === frontend.origin && methods.split(',').map(s => s.trim()).includes(method) && headers.includes('authorization') && headers.includes('content-type');
    report.preflights.push({ path, method, status: response.status, allowOrigin, passed: okay });
    passed &&= okay;
  } catch {
    report.preflights.push({ path, method, passed: false, error: 'Preflight request failed' });
    passed = false;
  }
}
report.livenessAndCorsPassed = passed;
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
