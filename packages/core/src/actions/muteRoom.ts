import { composeContext } from "../core/context.ts";
import { generateTrueOrFalse } from "../core/generation.ts";
import {
    Action,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "../core/types.ts";
import { shouldMuteTemplate, muteRoomExamples } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { shouldMuteTemplate };

export const muteRoom: Action = {
    name: "MUTE_ROOM",
    similes: [
        "MUTE_CHAT",
        "MUTE_CONVERSATION",
        "MUTE_ROOM",
        "MUTE_THREAD",
        "MUTE_CHANNEL",
    ],
    description:
        "Mutes a room, ignoring all messages unless explicitly mentioned. Only do this if explicitly asked to, or if you're annoying people.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const roomId = message.roomId;
        const userState = await runtime.databaseAdapter.getParticipantUserState(
            roomId,
            runtime.agentId
        );
        return userState !== "MUTED";
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        async function _shouldMute(state: State): Promise<boolean> {
            const shouldMuteContext = composeContext({
                state,
                template: shouldMuteTemplate,
            });

            const response = await generateTrueOrFalse({
                runtime,
                context: shouldMuteContext,
                modelClass: ModelClass.SMALL,
            });

            return response;
        }

        const state = await runtime.composeState(message);

        if (await _shouldMute(state)) {
            await runtime.databaseAdapter.setParticipantUserState(
                message.roomId,
                runtime.agentId,
                "MUTED"
            );
        }
    },
    examples: muteRoomExamples,
} as Action;
