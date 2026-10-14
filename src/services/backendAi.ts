import { apiRequest } from './apiClient';

/**
 * Typed input contracts for the backend's server-owned AI input-contract v4.
 * Keep these fields aligned with app/application/ai/input_contracts.py.
 * The backend remains authoritative and rejects unknown or invalid fields.
 */
export interface BackendApprovedEvidenceInput {
  id: string;
  type: string;
  content: unknown;
  revision?: number;
}

export interface BackendMatchingRequirementInput {
  requirement_id: string;
  requirement_text: string;
  mandatory: boolean;
  dimension?: string | null;
  requirement_type?: string | null;
  importance?: string | null;
  hard_constraint?: boolean | null;
  source_excerpt?: string | null;
  extraction_version?: string | null;
}

export interface BackendClassifiableRequirementInput {
  requirement_id: string;
  requirement_text: string;
  source_excerpt: string;
}

export interface BackendCandidateMatchingPreferences {
  transferability_policy?: 'STRICT' | 'MODERATE' | 'FLEXIBLE' | 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  evidence_emphasis?: string[];
  preferred_terminology?: string[];
  avoided_terminology?: string[];
  other_search_constraints?: string[];
}

export interface BackendApplicationArtifactInput {
  artifact_type: 'tailored_cv' | 'cover_letter' | 'application_q_and_a';
  content: unknown;
  declared_evidence_refs: string[];
  declared_unsupported_claims: string[];
}

export interface BackendClaimEvidenceRecordInput {
  id: string;
  type: string;
  content: unknown;
  verified_at?: string | null;
}

export interface BackendAITaskInputMap {
  document_parsing: { document_text: string };
  profile_extraction: { source_text: string; existing_profile?: Record<string, unknown>; instruction?: string | null };
  jd_extraction: { job_title?: string | null; employer?: string | null; job_description: string };
  job_requirement_extraction: { job_title?: string | null; employer?: string | null; job_description: string };
  requirement_classification: { job_description: string; requirements: BackendClassifiableRequirementInput[]; instruction?: string | null };
  evidence_matching: { job_title?: string | null; employer?: string | null; job_description_version_id: string; requirements: BackendMatchingRequirementInput[]; approved_candidate_evidence: BackendApprovedEvidenceInput[]; candidate_preferences?: BackendCandidateMatchingPreferences; instruction: string };
  career_pathway_discovery: { candidate_profile?: Record<string, unknown>; approved_candidate_evidence: BackendApprovedEvidenceInput[]; current_target_roles?: string[]; instruction?: string | null };
  cv_generation: { candidate_profile?: Record<string, unknown>; approved_candidate_evidence: BackendApprovedEvidenceInput[]; target_role?: string | null; job_description?: string | null; instruction?: string | null };
  cover_letter: { job_title: string; employer: string; job_description: string; candidate_profile?: Record<string, unknown>; approved_candidate_evidence: BackendApprovedEvidenceInput[]; instruction?: string | null };
  application_questions: { job_title: string; employer: string; job_description: string; approved_candidate_evidence: BackendApprovedEvidenceInput[]; known_questions?: string[]; instruction?: string | null };
  suggested_answers: { questions: string[]; approved_candidate_evidence: BackendApprovedEvidenceInput[]; job_context?: Record<string, unknown>; instruction?: string | null };
  claim_evidence_validation: { artifacts: BackendApplicationArtifactInput[]; approved_candidate_evidence: BackendClaimEvidenceRecordInput[] };
}

export type BackendAITask = keyof BackendAITaskInputMap;

export interface BackendAIGenerateOptions {
  /** Maximum output tokens accepted by the backend (1–4096). */
  maxTokens?: number;
}

export interface BackendAIGenerateResponse<T = unknown> {
  rawText: string;
  parsedData?: T | null;
  modelUsed: string;
  providerUsed: string;
  latencyMs: number;
  isFallback: boolean;
  confidence: string;
}

/**
 * Execute a governed backend AI task.
 *
 * Input must be a structured object matching input-contract v4. It is serialized
 * into the legacy prompt transport field because that is the current backend wire
 * format. Do not pass natural-language prompts to this method.
 */
export async function generateBackendAITask<T = unknown, K extends BackendAITask = BackendAITask>(
  task: K,
  input: BackendAITaskInputMap[K],
  options: BackendAIGenerateOptions = {}
): Promise<BackendAIGenerateResponse<T>> {
  const maxTokens = options.maxTokens ?? 2048;
  if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > 4096) {
    throw new Error('maxTokens must be an integer between 1 and 4096.');
  }

  return apiRequest<BackendAIGenerateResponse<T>>('/api/v1/ai/generate', {
    method: 'POST',
    body: JSON.stringify({
      task,
      prompt: JSON.stringify(input),
      options: { jsonMode: true, maxTokens }
    })
  });
}
