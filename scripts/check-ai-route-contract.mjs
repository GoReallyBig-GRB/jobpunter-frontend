import { existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const client = readFileSync('src/engine/providers/providerManager.ts', 'utf8');
const apiClient = readFileSync('src/services/apiClient.ts', 'utf8');
const envExample = readFileSync('.env.example', 'utf8');
const authService = readFileSync('src/services/firebase.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

assert.match(client, /NEXT_PUBLIC_JOBPUNTER_API_BASE_URL/, 'Frontend must require a configured backend URL');
assert.match(client, /\/api\/v1\/ai\/generate/, 'Frontend must call the versioned backend AI endpoint');
assert.match(client, /Authorization:[\s\S]{0,80}idToken/, 'AI requests must authenticate with the application identity token');
assert.doesNotMatch(client, /options\?\.systemInstruction/, 'Client system instructions must not be sent');
assert.doesNotMatch(client, /options\?\.model(?:Id)?\b/, 'Client model choices must not be sent');
assert.doesNotMatch(client, /options\?\.provider(?:Id)?\b/, 'Client provider choices must not be sent');
assert.doesNotMatch(client, /DEFAULT_ROUTES|DEFAULT_MODEL_REGISTRY|primaryModelId/, 'AI task routing and model registry must remain server-managed');
assert.equal(existsSync('src/engine/providers/modelRegistry.ts'), false, 'Client-side AI model registry must be removed');
const settings = readFileSync('src/components/SettingsView.tsx', 'utf8');
assert.doesNotMatch(settings, /providerManager|model routing|Temperature Parameter|useAIInterpretation/, 'Candidate settings must not expose system AI configuration');
const aiFacade = readFileSync('src/engine/aiProvider.ts', 'utf8');
assert.doesNotMatch(aiFacade, /providerManager\.setCredentials|googleApiKey/, 'Frontend AI facade must not accept or store provider credentials');
assert.doesNotMatch(client, /localStorage\.(?:getItem|setItem).*zc_ai_(?:credentials|model_registry|task_routes)_v1/, 'Legacy provider settings must not be read or written');
assert.match(apiClient, /Authorization/, 'General API requests must carry application authentication');
assert.match(envExample, /NEXT_PUBLIC_JOBPUNTER_API_BASE_URL/, 'Frontend env example must define only the public API origin');
for (const file of ['src/engine/providers/googleProvider.ts', 'src/engine/providers/anthropicProvider.ts', 'src/engine/providers/openAIProvider.ts', 'src/engine/providers/openAICompatibleProvider.ts']) {
  assert.equal(existsSync(file), false, `Direct client-side provider implementation must be removed: ${file}`);
}
assert.doesNotMatch(envExample, /(?:DATABASE_URL|API_KEY|SECRET|CREDENTIALS)/i, 'Backend secrets and database settings must not appear in frontend environment examples');
assert.doesNotMatch(authService, /firebase\/firestore|getFirestore|syncProfileToFirestore|syncJobsToFirestore|syncPreferencesToFirestore|loadProfileFromFirestore|loadJobsFromFirestore|loadPreferencesFromFirestore/, 'Frontend authentication service must not implement application database persistence');
assert.equal(existsSync('firestore.rules'), false, 'Retired Firestore rules must not be kept in the frontend repository');
assert.equal(existsSync('backend'), false, 'Backend implementation must live only in the backend repository');
assert.equal(existsSync('src/components/AdminPanelView.tsx'), false, 'Unprotected browser-only admin controls must not ship in the candidate app');
const appSource = readFileSync('src/App.tsx', 'utf8');
assert.doesNotMatch(appSource, /AdminPanelView|activeTab === 'admin'|case 'admin'/, 'Admin control plane must remain unavailable until backend authorization exists');
assert.equal(existsSync('infrastructure/docker/docker-compose.yml'), false, 'Backend infrastructure files must not be kept in the frontend repository');
const frontendWorkflow = readFileSync('.github/workflows/frontend-ci.yml', 'utf8');
assert.doesNotMatch(frontendWorkflow, /setup-python|pytest|alembic|backend\//i, 'Frontend CI must not build or test backend implementation');
for (const dependency of ['@google/genai', 'firebase-admin', 'express', 'dotenv']) {
  assert.equal(
    Object.hasOwn(packageJson.dependencies ?? {}, dependency) || Object.hasOwn(packageJson.devDependencies ?? {}, dependency),
    false,
    `Backend-only dependency must not be declared in the frontend: ${dependency}`
  );
}

const signInImplementation = authService.slice(authService.indexOf('export const googleSignIn'), authService.indexOf('export const connectGoogleWorkspace'));
assert.doesNotMatch(signInImplementation, /addScope/, 'Google sign-in must not request Workspace scopes');
assert.match(authService, /connectGoogleWorkspace/, 'Workspace scopes must be requested only through explicit integration connection');
assert.match(authService, /accessTokens\[integration\]/, 'Workspace tokens must be isolated by integration');
for (const [file, integration] of [
  ['src/services/googleDriveService.ts', 'drive'],
  ['src/services/gmailService.ts', 'gmail'],
  ['src/services/googleCalendarService.ts', 'calendar'],
  ['src/services/googleTasksService.ts', 'tasks']
]) {
  assert.ok(readFileSync(file, 'utf8').includes(`getAccessToken('${integration}')`), `Workspace service must use only its ${integration} token`);
}

console.log('Frontend AI API-boundary contract checks passed.');
