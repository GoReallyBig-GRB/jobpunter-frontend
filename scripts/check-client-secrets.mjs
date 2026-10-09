import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const config = readFileSync('next.config.ts', 'utf8');
const sourceRoots = ['app', 'src'];
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const failures = [];

const deploymentKeyReadPatterns = [
  /process\s*\.\s*env\s*\.\s*GEMINI_API_KEY/,
  /process\s*\.\s*env\s*\[\s*['"`]GEMINI_API_KEY['"`]\s*\]/
];

function readsDeploymentKey(source) {
  return deploymentKeyReadPatterns.some(pattern => pattern.test(source));
}

function exposesDeploymentKey(configSource) {
  return /\benv\s*:\s*\{[\s\S]*?\bGEMINI_API_KEY\b/.test(configSource);
}

function isApprovedServerRoute(filePath, source) {
  const normalized = filePath.replaceAll('\\\\', '/');
  return normalized.startsWith('app/api/') &&
    normalized.endsWith('/route.ts') &&
    !/^\s*['"]use client['"]/m.test(source);
}

if (process.argv.includes('--self-test')) {
  const cases = [
    ['dot notation', 'process.env.GEMINI_API_KEY', true],
    ['whitespace dot notation', 'process . env . GEMINI_API_KEY', true],
    ['single-quoted bracket notation', "process.env['GEMINI_API_KEY']", true],
    ['double-quoted bracket notation', 'process.env["GEMINI_API_KEY"]', true],
    ['template-literal bracket notation', 'process.env[`GEMINI_API_KEY`]', true],
    ['different environment key', 'process.env.OPENAI_API_KEY', false],
    ['key name as a string only', "const label = 'GEMINI_API_KEY';", false]
  ];

  for (const [label, source, expected] of cases) {
    const actual = readsDeploymentKey(source);
    if (actual !== expected) failures.push(`Self-test failed for ${label}: expected ${expected}, got ${actual}.`);
  }

  if (isApprovedServerRoute('app/api/ai/generate/route.ts', 'export async function POST() { return process.env.GEMINI_API_KEY; }') !== true) {
    failures.push('Self-test failed: approved server route was not recognized.');
  }
  if (isApprovedServerRoute('src/components/AIProvidersView.tsx', 'const key = process.env.GEMINI_API_KEY;') !== false) {
    failures.push('Self-test failed: client component was treated as an approved server route.');
  }
  if (isApprovedServerRoute('app/api/ai/generate/route.ts', "'use client'; const key = process.env.GEMINI_API_KEY;") !== false) {
    failures.push('Self-test failed: a client-marked route was treated as server-only.');
  }

  if (exposesDeploymentKey('const config = {};')) {
    failures.push('Self-test failed: an empty config was treated as exposing the key.');
  }
  if (!exposesDeploymentKey('const config = { env: { GEMINI_API_KEY: process.env.GEMINI_API_KEY } };')) {
    failures.push('Self-test failed: Next.js env mapping was not detected.');
  }

  if (failures.length) {
    console.error('Client-secret guard self-test failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Client-secret guard self-test passed (${cases.length + 5} checks).`);
  process.exit(0);
}

if (exposesDeploymentKey(config)) {
  failures.push('next.config.ts exposes GEMINI_API_KEY through Next.js env configuration.');
}

function inspectDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      inspectDirectory(fullPath);
      continue;
    }

    if (!entry.isFile() || !sourceExtensions.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
      continue;
    }

    const source = readFileSync(fullPath, 'utf8');
    if (readsDeploymentKey(source) && !isApprovedServerRoute(fullPath, source)) {
      failures.push(`${relative('.', fullPath)} reads the deployment GEMINI_API_KEY outside an approved server-only API route.`);
    }
  }
}

for (const root of sourceRoots) {
  try {
    inspectDirectory(root);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      continue;
    }
    throw error;
  }
}

if (failures.length) {
  console.error('Client-secret guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Client-secret guard passed: no deployment Gemini key is mapped into client configuration or read outside an approved server-only API route.');
