import { GoogleGenAI } from '@google/genai';
import { IAIProvider, AIResponse, GenerateTextOptions, ProviderCredentials, AIProviderId } from '../../types/ai';

export class GoogleProvider implements IAIProvider {
  public readonly id: AIProviderId = 'google';
  public readonly name = 'Google Gemini Direct';
  private client: GoogleGenAI | null = null;
  private apiKey: string = '';

  constructor(apiKey?: string) {
    const key = apiKey || (typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '');
    if (key && key.trim().length > 5) {
      this.apiKey = key.trim();
      this.initClient();
    }
  }

  private initClient(): void {
    try {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    } catch (err) {
      console.warn('GoogleGenAI initialization failed:', err);
      this.client = null;
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.client && this.apiKey.length > 5);
  }

  public setCredentials(credentials: ProviderCredentials): void {
    if (credentials.googleApiKey) {
      this.apiKey = credentials.googleApiKey.trim();
      this.initClient();
    }
  }

  public async generateText(prompt: string, options?: GenerateTextOptions): Promise<AIResponse<string>> {
    if (!this.client) {
      throw new Error('GoogleProvider is not configured with an API key.');
    }

    const startTime = Date.now();
    const model = options?.modelId || 'gemini-2.5-flash';
    
    const config: Record<string, any> = {
      temperature: options?.temperature !== undefined ? options?.temperature : 0.2
    };

    if (options?.jsonMode) {
      config.responseMimeType = 'application/json';
    }

    if (options?.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }

    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config
    });

    const latencyMs = Date.now() - startTime;
    const text = response.text || '';

    return {
      rawText: text,
      modelUsed: model,
      providerUsed: 'google',
      latencyMs,
      isFallback: false,
      confidence: 'HIGH'
    };
  }

  public async generateStructuredJSON<T>(
    prompt: string, 
    schemaDescription: string, 
    options?: GenerateTextOptions
  ): Promise<AIResponse<T>> {
    const fullPrompt = `${prompt}\n\nSTRICT JSON OUTPUT REQUIREMENT:\nReturn ONLY valid JSON matching this schema:\n${schemaDescription}`;
    const res = await this.generateText(fullPrompt, {
      ...options,
      jsonMode: true
    });

    try {
      let cleaned = res.rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      const parsedData = JSON.parse(cleaned) as T;
      return {
        ...res,
        parsedData
      };
    } catch (err) {
      throw new Error(`Failed to parse structured JSON from GoogleProvider: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
