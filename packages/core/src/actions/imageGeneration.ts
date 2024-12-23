import {
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    Action,
} from "../core/types.ts";
import { elizaLogger } from "../index.ts";
import { generateCaption, generateImage } from "./imageGenerationUtils.ts";
import { imageGenerationExamples } from "../promptsTexts.ts";

// Re-export for backward compatibility
export { imageGenerationExamples };

export const imageGeneration: Action = {
    name: "GENERATE_IMAGE",
    similes: ["IMAGE_GENERATION", "IMAGE_GEN", "CREATE_IMAGE", "MAKE_PICTURE"],
    description: "Generate an image to go along with the message.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // TODO: Abstract this to an image provider thing
        const anthropicApiKeyOk = !!runtime.getSetting("ANTHROPIC_API_KEY");
        const togetherApiKeyOk = !!runtime.getSetting("TOGETHER_API_KEY");
        return anthropicApiKeyOk && togetherApiKeyOk;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Composing state for message:", message);
        state = (await runtime.composeState(message)) as State;
        const userId = runtime.agentId;
        elizaLogger.log("User ID:", userId);

        const imagePrompt = message.content.text;
        elizaLogger.log("Image prompt received:", imagePrompt);

        // TODO: Generate a prompt for the image

        const res: { image: string; caption: string }[] = [];

        elizaLogger.log("Generating image with prompt:", imagePrompt);
        const images = await generateImage(
            {
                prompt: imagePrompt,
                width: 1024,
                height: 1024,
                count: 1,
            },
            runtime
        );

        if (images.success && images.data && images.data.length > 0) {
            elizaLogger.log(
                "Image generation successful, number of images:",
                images.data.length
            );
            for (let i = 0; i < images.data.length; i++) {
                const image = images.data[i];
                elizaLogger.log(`Processing image ${i + 1}:`, image);

                const caption = await generateCaption(
                    {
                        imageUrl: image,
                    },
                    runtime
                );

                elizaLogger.log(
                    `Generated caption for image ${i + 1}:`,
                    caption.title
                );
                res.push({ image: image, caption: caption.title });

                callback(
                    {
                        text: caption.description,
                        attachments: [
                            {
                                id: crypto.randomUUID(),
                                url: image,
                                title: "Generated image",
                                source: "imageGeneration",
                                description: caption.title,
                                text: caption.description,
                            },
                        ],
                    },
                    []
                );
            }
        } else {
            elizaLogger.error("Image generation failed or returned no data.");
        }
    },
    examples: imageGenerationExamples,
} as Action;
