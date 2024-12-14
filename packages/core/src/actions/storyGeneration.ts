import { Action, IAgentRuntime, Memory, State } from "../core/types.ts";
import { generateText } from "../core/generation.ts";
import { ModelClass } from "../core/types.ts";
import { composeContext } from "../core/context.ts";
import { storyTemplate } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { storyTemplate };

export const STORY_GENERATION: Action = {
    name: "GENERATE_STORY",
    similes: ["STORY_GENERATION", "STORY_GEN", "CREATE_STORY", "MAKE_STORY"],
    description: "Generate a story post with media for Twitter.",
    examples: [],
    handler: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        return { success: true };
    },
    validate: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        return true;
    }
} 