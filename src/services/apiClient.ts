import { auth } from './firebase';

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

/**
 * Send an authenticated request to the JobPunter backend.
 *
 * Firebase ID tokens are fetched from the current Firebase user for each request.
 * Google Workspace OAuth access tokens are intentionally not used as API credentials.
 */
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  if (response.status === 204) {
    return undefined as T;
  }

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