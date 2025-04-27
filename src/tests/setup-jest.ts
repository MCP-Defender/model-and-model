// Increase the default timeout for tests to handle mock API responses
jest.setTimeout(30000);

// Silence some warnings that might come from MSW
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};