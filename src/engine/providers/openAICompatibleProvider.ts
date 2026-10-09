import { IAIProvider, AIResponse, GenerateTextOptions, ProviderCredentials, AIProviderId } from '../../types/ai';

export class OpenAICompatibleProvider implements IAIProvider {
  public readonly id: AIProviderId;
  public readonly name: string;
  private baseUrl: string = 'http://localhost:11434/v1';
  private apiKey: string = '';

  constructor(id: AIProviderId = 'openai_compatible', name = 'OpenAI Compatible / Local', baseUrl?: string, apiKey?: string) {
    this.id = id;
    this.name = name;
    if (baseUrl) this.baseUrl = baseUrl.replace(/\/+$/, '');
    if (apiKey) this.apiKey = apiKey.trim();
  }

  public isConfigured(): boolean {
    return Boolean(this.baseUrl.length > 5);
  }

  public setCredentials(credentials: ProviderCredentials): void {
    if (credentials.customBaseUrl) {
      this.baseUrl = credentials.customBaseUrl.replace(/\/+$/, '');
    }
    if (credentials.customApiKey !== undefined) {
      this.apiKey = credentials.customApiKey.trim();
    }
  }

  public async generateText(prompt: string, options?: GenerateTextOptions): Promise<AIResponse<string>> {
    if (!this.isConfigured()) {
      throw new Error(`${this.name} provider is not configured with a valid baseUrl.`);
    }

    const startTime = Date.now();
    const model = options?.modelId || 'mistral-nemo:latest';

    const messages: Array<{ role: string; content: string }> = [];
    if (options?.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const payload: Record<string, any> = {
      model,
      messages,
      temperature: options?.temperature !== undefined ? options?.temperature : 0.2
    };

    if (options?.jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const endpoint = `${this.baseUrl}/chat/completions`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`${this.name} API error [${res.status}]: ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    return {
      rawText: content,
      modelUsed: model,
      providerUsed: this.id,
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
    const fullPrompt = `${prompt}\n\nSTRICT JSON OUTPUT REQUIREMENT:\nReturn a valid JSON object matching this schema:\n${schemaDescription}`;
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
      throw new Error(`Failed to parse structured JSON from ${this.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
