import { 
  AIProviderId, 
  TaskType, 
  AIModelDefinition, 
  TaskModelRoute, 
  ProviderCredentials, 
  IAIProvider, 
  AIResponse, 
  GenerateTextOptions 
} from '../../types/ai';
import { AITaskLogEntry } from '../../types/job';
import { DEFAULT_MODEL_REGISTRY } from './modelRegistry';
import { GoogleProvider } from './googleProvider';
import { OpenAIProvider } from './openAIProvider';
import { AnthropicProvider } from './anthropicProvider';
import { OpenAICompatibleProvider } from './openAICompatibleProvider';

const STORAGE_KEYS = {
  CREDENTIALS: 'zc_ai_credentials_v1',
  MODELS: 'zc_ai_model_registry_v1',
  ROUTES: 'zc_ai_task_routes_v1'
};

const DEFAULT_ROUTES: TaskModelRoute[] = [
  { task: 'document_parsing', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.1 },
  { task: 'profile_extraction', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.1 },
  { task: 'jd_extraction', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.1 },
  { task: 'requirement_classification', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.1 },
  { task: 'evidence_matching', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.1 },
  { task: 'career_pathway_discovery', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.2 },
  { task: 'cv_generation', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.2 },
  { task: 'cover_letter', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.2 },
  { task: 'application_questions', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.2 },
  { task: 'suggested_answers', primaryModelId: 'google-gemini-2.5-flash', temperature: 0.2 }
];

export class ProviderManager {
  private providers: Map<AIProviderId, IAIProvider> = new Map();
  private models: AIModelDefinition[] = [];
  private routes: Map<TaskType, TaskModelRoute> = new Map();
  private credentials: ProviderCredentials = {};
  private taskLogs: AITaskLogEntry[] = [];
  private cache: Map<string, any> = new Map();

  constructor() {
    this.initProviders();
    this.loadState();
  }

  private initProviders(): void {
    // 1. Google Direct
    const google = new GoogleProvider();
    this.providers.set('google', google);

    // 2. OpenAI Direct
    const openai = new OpenAIProvider();
    this.providers.set('openai', openai);

    // 3. Anthropic Direct
    const anthropic = new AnthropicProvider();
    this.providers.set('anthropic', anthropic);

    // 4. OpenAI Compatible / Local
    const local = new OpenAICompatibleProvider('openai_compatible', 'Local LLM / OpenAI Compatible');
    this.providers.set('openai_compatible', local);

    // 5. Gateway / Aggregator (OpenRouter)
    const gateway = new OpenAICompatibleProvider('gateway', 'Gateway / Aggregator', 'https://openrouter.ai/api/v1');
    this.providers.set('gateway', gateway);
  }

  private loadState(): void {
    // Load Credentials
    try {
      const savedCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (savedCreds) {
        this.credentials = JSON.parse(savedCreds);
        this.applyCredentials();
      }
    } catch {
      this.credentials = {};
    }

    // Load Model Registry
    try {
      const savedModels = localStorage.getItem(STORAGE_KEYS.MODELS);
      if (savedModels) {
        const parsed = JSON.parse(savedModels);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.models = parsed;
        } else {
          this.models = [...DEFAULT_MODEL_REGISTRY];
        }
      } else {
        this.models = [...DEFAULT_MODEL_REGISTRY];
      }
    } catch {
      this.models = [...DEFAULT_MODEL_REGISTRY];
    }

    // Update availability based on configured providers
    this.refreshModelAvailability();

    // Load Routes
    try {
      const savedRoutes = localStorage.getItem(STORAGE_KEYS.ROUTES);
      if (savedRoutes) {
        const parsed: TaskModelRoute[] = JSON.parse(savedRoutes);
        parsed.forEach(r => this.routes.set(r.task, r));
      } else {
        DEFAULT_ROUTES.forEach(r => this.routes.set(r.task, r));
      }
    } catch {
      DEFAULT_ROUTES.forEach(r => this.routes.set(r.task, r));
    }
  }

  private applyCredentials(): void {
    this.providers.forEach(p => p.setCredentials(this.credentials));
    this.refreshModelAvailability();
  }

  public refreshModelAvailability(): void {
    this.models = this.models.map(m => {
      const provider = this.providers.get(m.provider);
      return {
        ...m,
        isAvailable: provider ? provider.isConfigured() : false
      };
    });
  }

  public getModels(): AIModelDefinition[] {
    return [...this.models];
  }

  public addCustomModel(model: AIModelDefinition): void {
    this.models.push(model);
    this.refreshModelAvailability();
    this.saveModels();
  }

  public updateModel(id: string, updates: Partial<AIModelDefinition>): void {
    this.models = this.models.map(m => m.id === id ? { ...m, ...updates } : m);
    this.saveModels();
  }

  private saveModels(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(this.models));
    } catch (e) {
      console.error(e);
    }
  }

  public getCredentials(): ProviderCredentials {
    return { ...this.credentials };
  }

  public setCredentials(credentials: ProviderCredentials): void {
    this.credentials = { ...this.credentials, ...credentials };
    try {
      localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(this.credentials));
    } catch (e) {
      console.error(e);
    }
    this.applyCredentials();
  }

  public getRoutes(): TaskModelRoute[] {
    return Array.from(this.routes.values());
  }

  public setRoute(route: TaskModelRoute): void {
    this.routes.set(route.task, route);
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(Array.from(this.routes.values())));
    } catch (e) {
      console.error(e);
    }
  }

  public getRouteForTask(task: TaskType): TaskModelRoute {
    return this.routes.get(task) || {
      task,
      primaryModelId: 'google-gemini-2.5-flash',
      temperature: 0.1
    };
  }

  public logTask(task: string, model: string, latencyMs: number, status: 'SUCCESS' | 'FALLBACK' | 'ERROR', details?: string): void {
    const entry: AITaskLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      task,
      model,
      latencyMs,
      status,
      details
    };
    this.taskLogs.unshift(entry);
    if (this.taskLogs.length > 50) this.taskLogs.pop();
  }

  public getTaskLogs(): AITaskLogEntry[] {
    return [...this.taskLogs];
  }

  public isAIAvailable(): boolean {
    const google = this.providers.get('google');
    if (google && google.isConfigured()) return true;
    for (const p of this.providers.values()) {
      if (p.isConfigured()) return true;
    }
    return false;
  }

  /**
   * Execute an AI task with automatic model routing, provider dispatch, fallback, and structured error handling.
   */
  public async executeTask<T = string>(
    task: TaskType,
    prompt: string,
    schemaDescription?: string,
    options?: GenerateTextOptions
  ): Promise<AIResponse<T>> {
    const startTime = Date.now();
    const route = this.getRouteForTask(task);

    // Resolve primary model
    let targetModel = this.models.find(m => m.id === route.primaryModelId || m.modelId === route.primaryModelId);
    if (!targetModel || !targetModel.isAvailable) {
      // Find any available enabled model
      targetModel = this.models.find(m => m.isAvailable && m.isEnabled) || this.models[0];
    }

    if (!targetModel) {
      throw new Error(`No AI models registered for task: ${task}`);
    }

    const provider = this.providers.get(targetModel.provider);
    if (!provider || !provider.isConfigured()) {
      // Try fallback model if defined in route
      if (route.fallbackModelId) {
        const fallbackModel = this.models.find(m => m.id === route.fallbackModelId || m.modelId === route.fallbackModelId);
        if (fallbackModel && fallbackModel.isAvailable) {
          const fallbackProvider = this.providers.get(fallbackModel.provider);
          if (fallbackProvider && fallbackProvider.isConfigured()) {
            return this.runOnProvider<T>(fallbackProvider, fallbackModel.modelId, prompt, schemaDescription, {
              ...options,
              temperature: route.temperature
            }, task);
          }
        }
      }
      throw new Error(`Provider [${targetModel.provider}] for model [${targetModel.displayName}] is not configured with an API key.`);
    }

    try {
      const response = await this.runOnProvider<T>(provider, targetModel.modelId, prompt, schemaDescription, {
        ...options,
        temperature: options?.temperature !== undefined ? options?.temperature : route.temperature
      }, task);
      this.logTask(task, targetModel.modelId, Date.now() - startTime, 'SUCCESS');
      return response;
    } catch (err) {
      // Check for fallback route
      if (route.fallbackModelId) {
        const fallbackModel = this.models.find(m => m.id === route.fallbackModelId);
        if (fallbackModel && fallbackModel.isAvailable) {
          const fallbackProvider = this.providers.get(fallbackModel.provider);
          if (fallbackProvider && fallbackProvider.isConfigured()) {
            try {
              const fbResponse = await this.runOnProvider<T>(fallbackProvider, fallbackModel.modelId, prompt, schemaDescription, {
                ...options,
                temperature: route.temperature
              }, task);
              fbResponse.isFallback = true;
              this.logTask(task, fallbackModel.modelId, Date.now() - startTime, 'FALLBACK', `Primary failed: ${err instanceof Error ? err.message : String(err)}`);
              return fbResponse;
            } catch (fbErr) {
              this.logTask(task, targetModel.modelId, Date.now() - startTime, 'ERROR', `Both primary & fallback failed`);
              throw fbErr;
            }
          }
        }
      }
      this.logTask(task, targetModel.modelId, Date.now() - startTime, 'ERROR', String(err));
      throw err;
    }
  }

  private async runOnProvider<T>(
    provider: IAIProvider,
    modelId: string,
    prompt: string,
    schemaDescription?: string,
    options?: GenerateTextOptions,
    _task?: TaskType
  ): Promise<AIResponse<T>> {
    if (schemaDescription) {
      return provider.generateStructuredJSON<T>(prompt, schemaDescription, {
        ...options,
        modelId
      });
    } else {
      const res = await provider.generateText(prompt, {
        ...options,
        modelId
      });
      return res as unknown as AIResponse<T>;
    }
  }
}

export const providerManager = new ProviderManager();
