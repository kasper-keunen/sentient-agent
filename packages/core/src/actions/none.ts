import {
    IAgentRuntime,
    Memory,
    type Action,
} from "../core/types.ts";
import { noneDescription, noneExamples } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { noneDescription };

export const none: Action = {
    name: "NONE",
    similes: [
        "NO_ACTION",
        "NO_RESPONSE",
        "NO_REACTION",
        "RESPONSE",
        "REPLY",
        "DEFAULT",
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description: noneDescription,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> => {
        return true;
    },
    examples: noneExamples,
} as Action;
