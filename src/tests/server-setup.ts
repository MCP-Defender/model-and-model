import { setupServer } from 'msw/node';
import { HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';

// Mock server setup function that returns the server instance and URL
export function setupMockServer(handlers: HttpHandler[]) {
  const server = setupServer(...handlers);
  
  // Start the server before all tests
  beforeAll(() => server.listen());
  
  // Reset any request handlers between tests
  afterEach(() => server.resetHandlers());
  
  // Close server after all tests
  afterAll(() => server.close());
  
  return { url: 'http://localhost:8080' };
}

// Helper functions for specific provider mock responses

// OpenAI mock chat completion response
export function createOpenAIMockHandlers(baseUrl: string) {
  return [
    http.post(`${baseUrl}/chat/completions`, async () => {
      // Mock OpenAI non-streaming response
      return HttpResponse.json({
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'This is a test OpenAI response.'
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      });
    })
  ];
}

// Anthropic mock completion response
export function createAnthropicMockHandlers(baseUrl: string) {
  return [
    http.post(`${baseUrl}/v1/messages`, async () => {
      // Mock Anthropic non-streaming response
      return HttpResponse.json({
        id: 'msg_123456',
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'This is a test Anthropic response.'
          }
        ],
        model: 'claude-3-opus-20240229',
        stop_reason: 'end_turn',
        stop_sequence: null,
        usage: {
          input_tokens: 10,
          output_tokens: 20
        }
      });
    })
  ];
}

// Gemini mock response
export function createGeminiMockHandlers(baseUrl: string) {
  return [
    // Match any Gemini API endpoint
    http.post(`${baseUrl}/chat/completions`, async () => {
      // Mock Gemini non-streaming response
      return HttpResponse.json({
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gemini-1.5-pro',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'This is a test Gemini response.'
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      });
    })
  ];
} 