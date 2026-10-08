import { IAIProvider, AIResponse, GenerateTextOptions, ProviderCredentials, AIProviderId } from '../../types/ai';

export class AnthropicProvider implements IAIProvider {
  public readonly id: AIProviderId = 'anthropic';
  public readonly name = 'Anthropic Claude';
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
    if (credentials.anthropicApiKey) {
      this.apiKey = credentials.anthropicApiKey.trim();
    }
  }

  public async generateText(prompt: string, options?: GenerateTextOptions): Promise<AIResponse<string>> {
    if (!this.isConfigured()) {
      throw new Error('AnthropicProvider is not configured with an API key.');
    }

    const startTime = Date.now();
    const model = options?.modelId || 'claude-3-5-haiku-20241022';

    const payload: Record<string, any> = {
      model,
      max_tokens: options?.maxTokens || 4096,
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature !== undefined ? options?.temperature : 0.2
    };

    if (options?.systemInstruction) {
      payload.system = options.systemInstruction;
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API error [${res.status}]: ${errText}`);
    }

    const data = await res.json();
    const content = data.content?.[0]?.text || '';
    const latencyMs = Date.now() - startTime;

    return {
      rawText: content,
      modelUsed: model,
      providerUsed: 'anthropic',
      latencyMs,
      isFallback: false,
      confidence: 'HIGH',
      promptTokens: data.usage?.input_tokens,
      completionTokens: data.usage?.output_tokens
    };
  }

  public async generateStructuredJSON<T>(
    prompt: string, 
    schemaDescription: string, 
    options?: GenerateTextOptions
  ): Promise<AIResponse<T>> {
    const fullPrompt = `${prompt}\n\nSTRICT JSON OUTPUT REQUIREMENT:\nReturn ONLY valid JSON matching this schema with no conversational preamble:\n${schemaDescription}`;
    const res = await this.generateText(fullPrompt, options);

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
      throw new Error(`Failed to parse structured JSON from Anthropic: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
