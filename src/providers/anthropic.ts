import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base.js';
import { StreamCallback } from '../types.js';

export class AnthropicProvider extends BaseProvider {
    private client: Anthropic | null = null;

    getClient(): Anthropic {
        if (!this.client) {
            this.client = new Anthropic({
                apiKey: this.config.apiKey,
                baseURL: this.config.baseURL
            });
        }
        return this.client;
    }

    async getResponse(
        prompt: string,
        model: string,
        onData: StreamCallback
    ): Promise<void> {
        try {
            // Use the Anthropic API
            const anthropic = this.getClient();
            const response = await anthropic.messages.create({
                model,
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
                stream: false
            });

            if (response.content && response.content.length > 0) {
                const textBlocks = response.content
                    .filter(block => block.type === 'text')
                    .map(block => block.text)
                    .join('');
                
                if (textBlocks) {
                    onData({
                        model_name: model,
                        response: textBlocks
                    });
                } else {
                    throw new Error(`No text content received from Anthropic model '${model}'`);
                }
            } else {
                throw new Error(`No content received from Anthropic model '${model}'`);
            }
        } catch (error) {
            // Provide more detailed error information
            let errorMessage = 'Unknown Anthropic error';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            onData({
                model_name: model,
                error: errorMessage
            });
        }
    }
} 