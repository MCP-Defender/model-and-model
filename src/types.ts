export type ModelResponse = {
    model_name: string;
    response: string;
};

export type ModelError = {
    model_name: string;
    error: string;
};

export type ModelResult = ModelResponse | ModelError;

export type ProviderConfig = {
    apiKey: string;
    baseURL?: string;
};

export type ModelConfig = {
    anthropic?: ProviderConfig;
    openai?: ProviderConfig;
    gemini?: ProviderConfig;
};

// Generic string type for model names
export type SupportedModel = string;

// Provider-specific model configuration
export type ProviderModels = {
    anthropic?: SupportedModel[];
    openai?: SupportedModel[];
    gemini?: SupportedModel[];
};

export type StreamResult = ModelResponse | ModelError;
export type StreamCallback = (result: StreamResult) => void;
export type ErrorCallback = (error: Error) => void; 