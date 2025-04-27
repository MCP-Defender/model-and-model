import { OpenAIProvider } from '../providers/openai.js';
import { setupMockServer, createOpenAIMockHandlers } from './server-setup.js';

// Set up the mock server
const { url: mockServerUrl } = setupMockServer(createOpenAIMockHandlers('http://localhost:8080'));

describe('OpenAIProvider', () => {
  const dummyApiKey = 'dummy-openai-api-key';
  
  test('should initialize with API key and baseURL', () => {
    const provider = new OpenAIProvider({
      apiKey: dummyApiKey,
      baseURL: mockServerUrl
    });
    
    expect(provider).toBeDefined();
  });
  
  test('should get response from mock server', async () => {
    const provider = new OpenAIProvider({
      apiKey: dummyApiKey,
      baseURL: mockServerUrl
    });
    
    let response = '';
    
    await provider.getResponse(
      'Test prompt',
      'gpt-4-turbo',
      (result) => {
        if ('response' in result) {
          response = result.response;
        }
      }
    );
    
    expect(response).toContain('This is a test OpenAI response.');
  });
}); 