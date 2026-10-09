import type { AIResponse, GenerateTextOptions, TaskType } from '../../types/ai';
import type { AITaskLogEntry } from '../../types/job';
import { auth } from '../../services/firebase';

function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_JOBPUNTER_API_BASE_URL?.trim();
  if (!configured) {
    throw new Error('JobPunter API is not configured. Set NEXT_PUBLIC_JOBPUNTER_API_BASE_URL.');
  }
  return configured.replace(/\/$/, '');
}

/** Candidate-facing client. Provider configuration and execution remain server-owned. */
export class ProviderManager {
  private taskLogs: AITaskLogEntry[] = [];

  public logTask(
    task: string, model: string, latencyMs: number,
    status: 'SUCCESS' | 'FALLBACK' | 'ERROR', details?: string
  ): void {
    this.taskLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(), task, model, latencyMs, status, details
    });
    if (this.taskLogs.length > 50) this.taskLogs.pop();
  }

  public getTaskLogs(): AITaskLogEntry[] { return [...this.taskLogs]; }
  public isAIAvailable(): boolean { return Boolean(auth.currentUser); }

  public async executeTask<T = string>(
    task: TaskType, prompt: string, schemaDescription?: string, options?: GenerateTextOptions
  ): Promise<AIResponse<T>> {
    const startedAt = Date.now();
    const user = auth.currentUser;
    if (!user) throw new Error('Sign in before using JobPunter AI.');

    let response: Response;
    try {
      const idToken = await user.getIdToken();
      response = await fetch(`${getApiBaseUrl()}/api/v1/ai/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify({
          task, prompt, schemaDescription,
          options: { jsonMode: options?.jsonMode, maxTokens: options?.maxTokens }
        })
      });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('JobPunter API is not configured')) throw error;
      throw new Error('JobPunter API could not be reached. Please try again.');
    }

    const payload = await response.json().catch(() => ({})) as Record<string, unknown>;
    if (!response.ok) {
      const detail = payload.detail && typeof payload.detail === 'object'
        ? payload.detail as Record<string, unknown> : payload;
      const message = typeof detail.message === 'string' ? detail.message
        : typeof payload.error === 'string' ? payload.error : 'JobPunter AI request failed.';
      this.logTask(task, 'system-managed', Date.now() - startedAt, 'ERROR', `HTTP ${response.status}`);
      throw new Error(message);
    }

    const result = { ...payload, latencyMs: Date.now() - startedAt } as unknown as AIResponse<T>;
    this.logTask(task, result.modelUsed || 'system-managed', result.latencyMs, 'SUCCESS');
    return result;
  }
}

export const providerManager = new ProviderManager();
