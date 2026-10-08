export type AIProviderId = 'google' | 'openai' | 'anthropic' | 'openai_compatible' | 'gateway';

export type TaskType = 
  | 'document_parsing'
  | 'profile_extraction'
  | 'jd_extraction'
  | 'requirement_classification'
  | 'evidence_matching'
  | 'career_pathway_discovery'
  | 'cv_generation'
  | 'cover_letter'
  | 'application_questions'
  | 'suggested_answers';

export interface AIModelDefinition {
  id: string;
  provider: AIProviderId;
  modelId: string;
  displayName: string;
  capabilities: ('text_generation' | 'structured_json' | 'code' | 'reasoning')[];
  inputSupport: ('text' | 'document' | 'image')[];
  outputSupport: ('text' | 'json')[];
  contextCapacity?: number; // tokens, e.g. 1000000
  isFreeTier: boolean;
  costCategory: 'free' | 'low' | 'medium' | 'high';
  isAvailable: boolean;
  isEnabled: boolean;
  isDefault: boolean;
  description: string;
}

export interface TaskModelRoute {
  task: TaskType;
  primaryModelId: string;
  fallbackModelId?: string;
  temperature: number;
}

export interface ProviderCredentials {
  googleApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  customBaseUrl?: string;
  customApiKey?: string;
}

export interface GenerateTextOptions {
  modelId?: string;
  temperature?: number;
  jsonMode?: boolean;
  maxTokens?: number;
  systemInstruction?: string;
}

export interface AIResponse<T = string> {
  rawText: string;
  parsedData?: T;
  modelUsed: string;
  providerUsed: AIProviderId;
  latencyMs: number;
  isFallback: boolean;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  promptTokens?: number;
  completionTokens?: number;
}

export interface IAIProvider {
  readonly id: AIProviderId;
  readonly name: string;
  isConfigured(): boolean;
  setCredentials(credentials: ProviderCredentials): void;
  generateText(prompt: string, options?: GenerateTextOptions): Promise<AIResponse<string>>;
  generateStructuredJSON<T>(prompt: string, schemaDescription: string, options?: GenerateTextOptions): Promise<AIResponse<T>>;
}
