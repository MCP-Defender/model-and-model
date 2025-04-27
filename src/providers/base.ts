import { ModelResult, ProviderConfig, StreamCallback, SupportedModel } from '../types.js';

export abstract class BaseProvider {
    protected config: ProviderConfig;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    abstract getResponse(
        prompt: string,
        model: string,
        onData: StreamCallback
    ): Promise<void>;
} 