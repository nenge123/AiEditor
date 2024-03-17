import {AiModelConfig} from "../core/AiModelConfig.ts";
import {AiMessage} from "../core/AiMessage.ts";

export interface CustomAiModelConfig extends AiModelConfig {
    url: (() => string) | string,
    messageWrapper: (message: string) => string,
    messageParser: (message: string) => AiMessage | undefined,
    protocol: "sse" | "websocket"
}
