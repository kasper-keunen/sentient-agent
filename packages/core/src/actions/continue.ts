import { composeContext } from "../core/context.ts";
import {
    generateMessageResponse,
    generateTrueOrFalse,
} from "../core/generation.ts";
import {
    Action,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
} from "../core/types.ts";
import { 
    messageHandlerTemplate, 
    shouldContinueTemplate, 
    continueExamples 
} from "../promptsTexts.ts";

// Re-export for backward compatibility
export { messageHandlerTemplate, shouldContinueTemplate };

const maxContinuesInARow = 3;

export const continueAction: Action = {
    name: "CONTINUE",
    similes: ["ELABORATE", "KEEP_TALKING"],
    description:
        "ONLY use this action when the message necessitates a follow up. Do not use this action when the conversation is finished or the user does not wish to speak (use IGNORE instead). If the last message action was CONTINUE, and the user has not responded. Use sparingly.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const recentMessagesData = await runtime.messageManager.getMemories({
            roomId: message.roomId,
            agentId: runtime.agentId,
            count: 10,
            unique: false,
        });
        const agentMessages = recentMessagesData.filter(
            (m: { userId: any }) => m.userId === runtime.agentId
        );

        // check if the last messages were all continues=
        if (agentMessages) {
            const lastMessages = agentMessages.slice(0, maxContinuesInARow);
            if (lastMessages.length >= maxContinuesInARow) {
                const allContinues = lastMessages.every(
                    (m: { content: any }) =>
                        (m.content as Content).action === "CONTINUE"
                );
                if (allContinues) {
                    return false;
                }
            }
        }

        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        if (
            message.content.text.endsWith("?") ||
            message.content.text.endsWith("!")
        ) {
            return;
        }

        if (!state) {
            state = (await runtime.composeState(message)) as State;
        }

        state = await runtime.updateRecentMessageState(state);

        async function _shouldContinue(state: State): Promise<boolean> {
            // If none of the above conditions are met, use the generateText to decide
            const shouldRespondContext = composeContext({
                state,
                template: shouldContinueTemplate,
            });

            const response = await generateTrueOrFalse({
                context: shouldRespondContext,
                modelClass: ModelClass.SMALL,
                runtime,
            });

            return response;
        }

        const shouldContinue = await _shouldContinue(state);
        if (!shouldContinue) {
            console.log("Not elaborating");
            return;
        }

        const context = composeContext({
            state,
            template:
                runtime.character.templates?.continueMessageHandlerTemplate ||
                runtime.character.templates?.messageHandlerTemplate ||
                messageHandlerTemplate,
        });
        const { userId, roomId } = message;

        const response = await generateMessageResponse({
            runtime,
            context,
            modelClass: ModelClass.LARGE,
        });

        response.inReplyTo = message.id;

        runtime.databaseAdapter.log({
            body: { message, context, response },
            userId,
            roomId,
            type: "continue",
        });

        // prevent repetition
        const messageExists = state.recentMessagesData
            .filter((m: { userId: any }) => m.userId === runtime.agentId)
            .slice(0, maxContinuesInARow + 1)
            .some((m: { content: any }) => m.content === message.content);

        if (messageExists) {
            return;
        }

        await callback(response);

        // if the action is CONTINUE, check if we are over maxContinuesInARow
        if (response.action === "CONTINUE") {
            const agentMessages = state.recentMessagesData
                .filter((m: { userId: any }) => m.userId === runtime.agentId)
                .map((m: { content: any }) => (m.content as Content).action);

            const lastMessages = agentMessages.slice(0, maxContinuesInARow);
            if (lastMessages.length >= maxContinuesInARow) {
                const allContinues = lastMessages.every(
                    (m: string | undefined) => m === "CONTINUE"
                );
                if (allContinues) {
                    response.action = null;
                }
            }
        }

        return response;
    },
    examples: continueExamples,
} as Action;
