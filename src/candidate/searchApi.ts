import { apiRequest } from '../services/apiClient';

// Contract read at deployed backend revision 304673112c4892e56649615e66733c75f063545b.
// This adapter is not enabled by its existence. The action registry stays gated
// until authenticated runtime, processed-record admission and pagination pass.
export interface SearchJob {
  id: string;
  title: string;
  company_name: string | null;
  location_country: string | null;
  work_mode: string | null;
  employment_type: string | null;
  application_url: string | null;
  first_discovered_at: string;
  description: { preview: string; completeness_status: string } | null;
}
export interface SearchPage {
  data: SearchJob[];
  pagination: { limit: number; offset: number; total: number };
}
export interface SearchFilters {
  query?: string; location_country?: string; work_mode?: string; employment_type?: string;
}
export async function searchProcessedJobs(filters: SearchFilters, signal?: AbortSignal): Promise<SearchPage> {
  const query = new URLSearchParams({ limit: '5', offset: '0', lifecycle_status: 'ACTIVE' });
  for (const key of ['query', 'location_country', 'work_mode', 'employment_type'] as const) {
    const value = filters[key]?.trim();
    if (value) query.set(key, value);
  }
  const page = await apiRequest<SearchPage>(`/api/v1/candidate/jobs/pool?${query}`, { signal: signal ?? AbortSignal.timeout(30000) });
  if (!Array.isArray(page.data) || !Number.isInteger(page.pagination?.total) || page.pagination.total < 0 || page.data.some(job => typeof job.id !== 'string' || typeof job.title !== 'string')) {
    throw new Error('The job search response could not be read. Please retry.');
  }
  return page;
}
