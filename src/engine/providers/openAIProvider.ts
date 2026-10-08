import { IAIProvider, AIResponse, GenerateTextOptions, ProviderCredentials, AIProviderId } from '../../types/ai';

export class OpenAIProvider implements IAIProvider {
  public readonly id: AIProviderId = 'openai';
  public readonly name = 'OpenAI Direct';
  private apiKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey.trim();
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  public setCredentials(credentials: ProviderCredentials): void {
    if (credentials.openaiApiKey) {
      this.apiKey = credentials.openaiApiKey.trim();
    }
  }

  public async generateText(prompt: string, options?: GenerateTextOptions): Promise<AIResponse<string>> {
    if (!this.isConfigured()) {
      throw new Error('OpenAIProvider is not configured with an API key.');
    }

    const startTime = Date.now();
    const model = options?.modelId || 'gpt-4o-mini';

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

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error [${res.status}]: ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    return {
      rawText: content,
      modelUsed: model,
      providerUsed: 'openai',
      latencyMs,
      isFallback: false,
      confidence: 'HIGH',
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens
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
      throw new Error(`Failed to parse structured JSON from OpenAI: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
