# model-and-model

A TypeScript/JavaScript library for getting responses from multiple LLM providers simultaneously.

## Features

- Get responses from multiple LLMs concurrently
- Support for OpenAI, Anthropic (Claude), and Google (Gemini) models
- TypeScript support
- Error handling with automatic cancellation of pending requests
- Configurable base URLs for API endpoints

## Installation

```bash
npm install model-and-model
```

## Usage

```typescript
import { ModelAndModel } from 'model-and-model';

// Initialize with your API keys
const modelAndModel = new ModelAndModel({
  anthropic: {
    apiKey: 'your-anthropic-api-key',
    baseURL: 'your-anthropic-base-url' // Optional
  },
  openai: {
    apiKey: 'your-openai-api-key',
    baseURL: 'your-openai-base-url' // Optional
  },
  gemini: {
    apiKey: 'your-gemini-api-key',
    // Currently model-and-model uses the OpenAI SDK to talk to Gemini 
    // because it supports overriding the base URL. So for now, we must
    // pass an OpenAI compatible URL to the baseURL here to make it work.
    // One example is https://generativelanguage.googleapis.com/v1beta/openai/
    // Once the official google/genai package supports base URLs, this will
    // no longer be optional.
    baseURL: 'your-gemini-base-url' // Required
  }
});

// Get responses from multiple models
await modelAndModel.getResponses(
  'What is the meaning of life?',
  {
    openai: ['gpt-4.1'],
    gemini: ['gemini-2.0-flash'],
    anthropic: ['claude-3-7-sonnet-latest']
  },
  (result) => {
    if ('error' in result) {
      console.error(`${result.model_name} error:`, result.error);
    } else {
      console.log(`${result.model_name}:`, result.response);
    }
  },
  (error) => {
    console.error('Fatal error:', error);
  }
);
```

## Supported Models

This library works with any model offered by the supported providers, including new models released after this library. There's no need to update the library when new models are released.

For the latest available models, see:
- [OpenAI Models documentation](https://platform.openai.com/docs/models)
- [Anthropic Claude documentation](https://docs.anthropic.com/claude/docs/models-overview)
- [Google Gemini API documentation](https://ai.google.dev/models/gemini)

## Error Handling

If any model returns an error, all pending requests will be cancelled and the error callback will be invoked. The error callback receives an Error object with details about which model failed and why.

## Testing

This library includes a test suite that uses a fake server to simulate API responses. This allows testing without requiring actual API keys.

Run the tests with:

```bash
npm test
```

The tests use MSW (Mock Service Worker) to intercept API requests and return simulated responses for each provider.

## License

MIT
