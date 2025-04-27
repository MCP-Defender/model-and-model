import { AnthropicProvider } from '../providers/anthropic.js';
import { setupMockServer, createAnthropicMockHandlers } from './server-setup.js';

// Set up the mock server
const { url: mockServerUrl } = setupMockServer(createAnthropicMockHandlers('http://localhost:8080'));

describe('AnthropicProvider', () => {
  const dummyApiKey = 'dummy-anthropic-api-key';
  
  test('should initialize with API key and baseURL', () => {
    const provider = new AnthropicProvider({
      apiKey: dummyApiKey,
      baseURL: mockServerUrl
    });
    
    expect(provider).toBeDefined();
  });
  
  test('should get response from mock server', async () => {
    const provider = new AnthropicProvider({
      apiKey: dummyApiKey,
      baseURL: mockServerUrl
    });
    
    let response = '';
    
    await provider.getResponse(
      'Test prompt',
      'claude-3-5-sonnet-20240620',
      (result) => {
        if ('response' in result) {
          response = result.response;
        }
      }
    );
    
    expect(response).toContain('This is a test Anthropic response.');
  });
}); 