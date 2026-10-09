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

export async function getCandidatePreferences(): Promise<CandidatePreferencesSnapshot> {
  const snapshot = await apiRequest<CandidatePreferencesSnapshot>(
    '/api/v1/candidate/preferences'
  );
  if (!Number.isInteger(snapshot.revision) || snapshot.revision < 0 || !snapshot.preferences) {
    throw new Error('The backend returned an invalid candidate-preferences response.');
  }
  return snapshot;
}

export async function saveCandidatePreferences(
  preferences: JobPreferences,
  expectedRevision: number
): Promise<CandidatePreferencesSnapshot> {
  if (!Number.isInteger(expectedRevision) || expectedRevision < 0) {
    throw new Error('A valid preference revision is required before saving.');
  }
  const snapshot = await apiRequest<CandidatePreferencesSnapshot>(
    '/api/v1/candidate/preferences',
    {
      method: 'PUT',
      body: JSON.stringify({ expectedRevision, preferences })
    }
  );
  if (!Number.isInteger(snapshot.revision) || snapshot.revision <= expectedRevision || !snapshot.preferences) {
    throw new Error('The backend returned an invalid saved-preferences response.');
  }
  return snapshot;
}