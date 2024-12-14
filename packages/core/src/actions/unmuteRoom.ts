import { composeContext } from "../core/context.ts";
import { generateTrueOrFalse } from "../core/generation.ts";
import {
    Action,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "../core/types.ts";
import { shouldUnmuteTemplate, unmuteRoomExamples } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { shouldUnmuteTemplate };

export const unmuteRoom: Action = {
    name: "UNMUTE_ROOM",
    similes: [
        "UNMUTE_CHAT",
        "UNMUTE_CONVERSATION",
        "UNMUTE_ROOM",
        "UNMUTE_THREAD",
    ],
    description:
        "Unmutes a room, allowing the agent to consider responding to messages again.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const roomId = message.roomId;
        const userState = await runtime.databaseAdapter.getParticipantUserState(
            roomId,
            runtime.agentId
        );
        return userState === "MUTED";
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        async function _shouldUnmute(state: State): Promise<boolean> {
            const shouldUnmuteContext = composeContext({
                state,
                template: shouldUnmuteTemplate,
            });

            const response = generateTrueOrFalse({
                context: shouldUnmuteContext,
                runtime,
                modelClass: ModelClass.SMALL,
            });

            return response;
        }

        const state = await runtime.composeState(message);

        if (await _shouldUnmute(state)) {
            await runtime.databaseAdapter.setParticipantUserState(
                message.roomId,
                runtime.agentId,
                null
            );
        }
    },
    examples: unmuteRoomExamples,
} as Action;
