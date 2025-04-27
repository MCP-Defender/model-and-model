import { OpenAI } from 'openai';
import { BaseProvider } from './base.js';
import { StreamCallback } from '../types.js';

export class GeminiProvider extends BaseProvider {
    private client: OpenAI | null = null;

    getClient(): OpenAI {
        if (!this.client) {
            this.client = new OpenAI({
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
            // Use the OpenAI API
            const openai = this.getClient();
            const response = await openai.chat.completions.create({
                model,
                messages: [{ role: 'user', content: prompt }],
                stream: false
            });

            const content = response.choices[0]?.message?.content || '';
            if (content) {
                onData({
                    model_name: model,
                    response: content
                });
            } else {
                throw new Error(`No content received from Gemini model '${model}'`);
            }
        } catch (error) {
            // Provide more detailed error information
            let errorMessage = 'Unknown Gemini error';
            
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