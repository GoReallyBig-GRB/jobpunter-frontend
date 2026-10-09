import { apiRequest } from './apiClient';

export interface ApiEnvelope<T> {
  data: T;
}

export interface CandidateProfileResponse {
  id: string;
  user_id: string;
  status: string;
  revision: number;
}

export interface EvidenceCreate {
  evidence_type: string;
  content: Record<string, unknown>;
  source_type: string;
  source_reference: string;
  source_metadata?: Record<string, unknown>;
}

export interface EvidenceResponse {
  id: string;
  candidate_profile_id: string;
  evidence_type: string;
  status: string;
  content: Record<string, unknown>;
  revision: number;
  verified_at: string | null;
}

export interface EvidenceTransitionRequest {
  expected_revision: number;
}

export interface EvaluationResponse {
  id: string;
  job_id: string;
  target_role_key: string;
  evaluation_version: number;
  validity_status: string;
  outcome: string;
  score: number | null;
  hard_blockers: unknown[];
  evidence_summary: Record<string, unknown>;
  explanation: Record<string, unknown>;
  policy_version: string;
  evaluated_at: string;
}

export interface PuntResponse {
  id: string;
  job_id: string;
  status: string;
  qualified_at: string;
  revision: number;
}

export interface ApplicationResponse {
  id: string;
  job_id: string;
  punt_id: string | null;
  status: string;
  submitted_at: string | null;
  revision: number;
  created_at: string;
  updated_at: string;
}

export interface ApplicationTransitionRequest {
  target_status: string;
  expected_revision: number;
}

async function getData<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiRequest<ApiEnvelope<T>>(path, init);
  return response.data;
}

/**
 * Typed wrappers for backend routes that currently exist.
 *
 * These wrappers define an API integration boundary. A screen is migrated only after its backend contract, ownership checks, data migration, and failure states are verified.
 */
export const backendApi = {
  getCandidateProfile: () =>
    getData<CandidateProfileResponse>('/api/v1/candidate/profile'),

  createEvidence: (payload: EvidenceCreate) =>
    getData<EvidenceResponse>('/api/v1/candidate/evidence', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  submitEvidence: (evidenceId: string, payload: EvidenceTransitionRequest) =>
    getData<EvidenceResponse>(`/api/v1/candidate/evidence/${encodeURIComponent(evidenceId)}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  approveEvidence: (evidenceId: string, payload: EvidenceTransitionRequest) =>
    getData<EvidenceResponse>(`/api/v1/candidate/evidence/${encodeURIComponent(evidenceId)}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  rejectEvidence: (evidenceId: string, payload: EvidenceTransitionRequest) =>
    getData<EvidenceResponse>(`/api/v1/candidate/evidence/${encodeURIComponent(evidenceId)}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  archiveEvidence: (evidenceId: string, payload: EvidenceTransitionRequest) =>
    getData<EvidenceResponse>(`/api/v1/candidate/evidence/${encodeURIComponent(evidenceId)}/archive`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  listEvaluations: () =>
    getData<EvaluationResponse[]>('/api/v1/candidate/evaluations'),

  createPunt: (evaluationId: string) =>
    getData<PuntResponse>('/api/v1/candidate/punts', {
      method: 'POST',
      body: JSON.stringify({ evaluation_id: evaluationId })
    }),

  listPunts: () =>
    getData<PuntResponse[]>('/api/v1/candidate/punts'),

  createApplication: (puntId: string) =>
    getData<ApplicationResponse>('/api/v1/candidate/applications', {
      method: 'POST',
      body: JSON.stringify({ punt_id: puntId })
    }),

  listApplications: () =>
    getData<ApplicationResponse[]>('/api/v1/candidate/applications'),

  transitionApplication: (applicationId: string, payload: ApplicationTransitionRequest) =>
    getData<ApplicationResponse>(
      `/api/v1/candidate/applications/${encodeURIComponent(applicationId)}/transition`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )
};
