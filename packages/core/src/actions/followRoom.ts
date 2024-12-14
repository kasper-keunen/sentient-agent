import { composeContext } from "../core/context.ts";
import { generateTrueOrFalse } from "../core/generation.ts";
import {
    Action,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "../core/types.ts";
import { shouldFollowTemplate, followRoomExamples } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { shouldFollowTemplate };

export const followRoom: Action = {
    name: "FOLLOW_ROOM",
    similes: [
        "FOLLOW_CHAT",
        "FOLLOW_CHANNEL",
        "FOLLOW_CONVERSATION",
        "FOLLOW_THREAD",
    ],
    description:
        "Start following this channel with great interest, chiming in without needing to be explicitly mentioned. Only do this if explicitly asked to.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const keywords = [
            "follow",
            "participate",
            "engage",
            "listen",
            "take interest",
            "join",
        ];
        if (
            !keywords.some((keyword) =>
                message.content.text.toLowerCase().includes(keyword)
            )
        ) {
            return false;
        }
        const roomId = message.roomId;
        const userState = await runtime.databaseAdapter.getParticipantUserState(
            roomId,
            runtime.agentId
        );
        return userState !== "FOLLOWED" && userState !== "MUTED";
    },
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        async function _shouldFollow(state: State): Promise<boolean> {
            const shouldFollowContext = composeContext({
                state,
                template: shouldFollowTemplate, // Define this template separately
            });

            const response = await generateTrueOrFalse({
                runtime,
                context: shouldFollowContext,
                modelClass: ModelClass.SMALL,
            });

            return response;
        }

        const state = await runtime.composeState(message);

        if (await _shouldFollow(state)) {
            await runtime.databaseAdapter.setParticipantUserState(
                message.roomId,
                runtime.agentId,
                "FOLLOWED"
            );
        }
    },
    examples: followRoomExamples,
} as Action;
