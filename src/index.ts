import { ModelConfig, SupportedModel, StreamCallback, ErrorCallback, ProviderModels } from './types.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { OpenAIProvider } from './providers/openai.js';
import { GeminiProvider } from './providers/gemini.js';

export class ModelAndModel {
    private providers: {
        anthropic?: AnthropicProvider;
        openai?: OpenAIProvider;
        gemini?: GeminiProvider;
    } = {};

    constructor(config: ModelConfig) {
        if (config.anthropic) {
            this.providers.anthropic = new AnthropicProvider(config.anthropic);
        }
        if (config.openai) {
            this.providers.openai = new OpenAIProvider(config.openai);
        }
        if (config.gemini) {
            this.providers.gemini = new GeminiProvider(config.gemini);
        }
    }

    async getResponses(
        prompt: string,
        providerModels: ProviderModels,
        onData: StreamCallback,
        onError?: ErrorCallback
    ): Promise<void> {
        const tasks: Promise<void>[] = [];
        
        // Process models for each configured provider
        for (const [providerName, provider] of Object.entries(this.providers)) {
            const models = providerModels[providerName as keyof ProviderModels];
            
            // Skip if no models specified for this provider
            if (!models || models.length === 0) {
                continue;
            }

            // Ensure the provider is configured
            if (!provider) {
                throw new Error(`Provider ${providerName} is not configured`);
            }

            // Start all model requests for this provider concurrently
            for (const model of models) {
                const task = provider.getResponse(prompt, model, (result) => {
                    if ('error' in result) {
                        // Just report the error for this specific model through the onData callback
                        // instead of canceling everything
                        onData(result);
                        
                        // Also call the error callback if provided, but don't let it stop other models
                        if (onError) {
                            onError(new Error(`${result.model_name}: ${result.error}`));
                        }
                    } else {
                        // Process normal response
                        onData(result);
                    }
                });

                tasks.push(task);
            }
        }

        // Wait for all requests to complete
        await Promise.all(tasks);
    }
}

// Re-export types
export * from './types.js'; 