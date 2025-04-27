import { GeminiProvider } from '../providers/gemini.js';
import { setupMockServer, createGeminiMockHandlers } from './server-setup.js';

// Set up the mock server
const { url: mockServerUrl } = setupMockServer(createGeminiMockHandlers('http://localhost:8080'));

describe('GeminiProvider', () => {
  const dummyApiKey = 'dummy-gemini-api-key';
  
  test('should initialize with API key and baseURL', () => {
    const provider = new GeminiProvider({
      apiKey: dummyApiKey,
      baseURL: mockServerUrl
    });
    
    expect(provider).toBeDefined();
  });
  
  test('should get response from mock server', async () => {
    const provider = new GeminiProvider({
      apiKey: dummyApiKey,
      baseURL: mockServerUrl
    });
    
    let response = '';
    
    await provider.getResponse(
      'Test prompt',
      'gemini-1.5-pro',
      (result) => {
        if ('response' in result) {
          response = result.response;
        }
      }
    );
    
    expect(response).toContain('This is a test Gemini response.');
  });
}); 