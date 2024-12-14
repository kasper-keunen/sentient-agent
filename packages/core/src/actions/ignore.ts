import {
    IAgentRuntime,
    Memory,
    type Action,
} from "../core/types.ts";
import { ignoreDescription, ignoreExamples } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { ignoreDescription };

export const ignore: Action = {
    name: "IGNORE",
    similes: ["STOP_TALKING", "STOP_CHATTING", "STOP_CONVERSATION"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: ignoreDescription,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        return true;
    },
    examples: ignoreExamples,
} as Action;
