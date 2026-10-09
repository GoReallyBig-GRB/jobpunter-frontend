import { auth } from './firebase';
import type { JobPreferences } from '../types/job';

const API_BASE_URL = (process.env.NEXT_PUBLIC_JOBPUNTER_API_BASE_URL || '')
  .trim()
  .replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Backend API is not configured. Set NEXT_PUBLIC_JOBPUNTER_API_BASE_URL.');
  }
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('API path must be a same-origin-style path beginning with one slash.');
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sign in before calling the JobPunter API.');
  }

  const idToken = await user.getIdToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${idToken}`);
  if (init.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') || '';
  const payload: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === 'object' && payload !== null && 'detail' in payload
        ? String((payload as { detail: unknown }).detail)
        : typeof payload === 'string' && payload.trim()
          ? payload
          : `JobPunter API request failed with status ${response.status}`;
    throw new ApiError(detail, response.status, payload);
  }
  return payload as T;
}

export interface CandidatePreferencesSnapshot {
  revision: number;
  preferences: JobPreferences;
}

type BackendPreferences = Omit<Partial<JobPreferences>, 'remotePreference' | 'transferabilityPolicy'> & {
  remotePreference?: string;
  transferabilityPolicy?: string;
};

function normalizePreferencesSnapshot(value: unknown, minimumRevision: number): CandidatePreferencesSnapshot {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('revision' in value) ||
    !('preferences' in value)
  ) {
    throw new Error('The backend returned an invalid candidate-preferences response.');
  }

  const snapshot = value as { revision: unknown; preferences: unknown };
  if (
    !Number.isInteger(snapshot.revision) ||
    (snapshot.revision as number) < minimumRevision ||
    typeof snapshot.preferences !== 'object' ||
    snapshot.preferences === null
  ) {
    throw new Error('The backend returned an invalid candidate-preferences response.');
  }

  const backendPreferences = snapshot.preferences as BackendPreferences;
  const remotePreference =
    backendPreferences.remotePreference === 'FLEXIBLE'
      ? 'REMOTE_OK'
      : backendPreferences.remotePreference;
  const transferabilityPolicy =
    backendPreferences.transferabilityPolicy === 'MODERATE'
      ? 'BALANCED'
      : backendPreferences.transferabilityPolicy;

  const validRemotePreferences = ['REMOTE_ONLY', 'REMOTE_OK', 'HYBRID_OK', 'ONSITE_OK'];
  const validTransferabilityPolicies = ['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'];
  if (
    (remotePreference !== undefined && !validRemotePreferences.includes(remotePreference)) ||
    (transferabilityPolicy !== undefined && !validTransferabilityPolicies.includes(transferabilityPolicy))
  ) {
    throw new Error('The backend returned an unsupported candidate-preference option.');
  }

  return {
    revision: snapshot.revision as number,
    preferences: {
      ...backendPreferences,
      ...(remotePreference ? { remotePreference: remotePreference as JobPreferences['remotePreference'] } : {}),
      ...(transferabilityPolicy
        ? { transferabilityPolicy: transferabilityPolicy as JobPreferences['transferabilityPolicy'] }
        : {})
    } as JobPreferences
  };
}

export async function getCandidatePreferences(): Promise<CandidatePreferencesSnapshot> {
  const snapshot = await apiRequest<unknown>('/api/v1/candidate/preferences');
  return normalizePreferencesSnapshot(snapshot, 0);
}

export async function saveCandidatePreferences(
  preferences: JobPreferences,
  expectedRevision: number
): Promise<CandidatePreferencesSnapshot> {
  if (!Number.isInteger(expectedRevision) || expectedRevision < 0) {
    throw new Error('A valid preference revision is required before saving.');
  }
  const snapshot = await apiRequest<unknown>(
    '/api/v1/candidate/preferences',
    {
      method: 'PUT',
      body: JSON.stringify({ expectedRevision, preferences })
    }
  );
  return normalizePreferencesSnapshot(snapshot, expectedRevision + 1);
}