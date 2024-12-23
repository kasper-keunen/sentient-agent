export * from "./config.ts";

import { defaultCharacter } from "../core/defaultCharacter.ts";
import settings from "../core/settings.ts";
import { Character, IAgentRuntime, ModelProvider } from "../core/types.ts";
import * as Action from "../actions/index.ts";
import * as Client from "../clients/index.ts";
import * as Adapter from "../adapters/index.ts";
import * as Provider from "../providers/index.ts";
import yargs from "yargs";
import { wait } from "../clients/twitter/utils.ts";

import fs from "fs";
import Database from "better-sqlite3";
import { AgentRuntime } from "../core/runtime.ts";
import { defaultActions } from "../core/actions.ts";
import { Arguments } from "../types/index.ts";
import { loadActionConfigs, loadCustomActions } from "./config.ts";
import { elizaLogger } from "../index.ts";
import { DiscordClient } from "../clients/discord/index.ts";
import { Worker } from 'worker_threads';
import path from 'path';

export async function initializeClients(
    character: Character,
    runtime: IAgentRuntime
) {
    const clients = [];
    const clientTypes = character.clients?.map((str) => str.toLowerCase()) || [];

    elizaLogger.log("Initializing clients:", clientTypes);
    
    // Start Discord and Twitter in parallel if they exist
    const startupPromises = [];

    if (clientTypes.includes("discord")) {
        startupPromises.push(
            (async () => {
                try {
                    elizaLogger.log("Starting Discord...");
                    const discordClient = await startDiscord(runtime);
                    clients.push(discordClient);
                    elizaLogger.log("Discord client initialized");
                } catch (error) {
                    elizaLogger.error("Error starting Discord:", error);
                }
            })()
        );
    }

    if (clientTypes.includes("twitter")) {
        startupPromises.push(
            (async () => {
                try {
                    elizaLogger.log("Starting Twitter clients...");
                    const twitterClients = await startTwitter(runtime);
                    clients.push(...twitterClients);
                    elizaLogger.log("Twitter clients initialized");
                } catch (error) {
                    elizaLogger.error("Error starting Twitter:", error);
                }
            })()
        );
    }

    // Wait for both Discord and Twitter to initialize
    await Promise.all(startupPromises);

    // Start Telegram last (since it's less critical)
    if (clientTypes.includes("telegram")) {
        try {
            elizaLogger.log("Starting Telegram client...");
            const telegramClient = await startTelegram(runtime, character);
            if (telegramClient) clients.push(telegramClient);
            elizaLogger.log("Telegram client initialized");
        } catch (error) {
            elizaLogger.error("Error starting Telegram:", error);
        }
    }

    return clients;
}

export function parseArguments(): Arguments {
    try {
        return yargs(process.argv.slice(2))
            .option("character", {
                type: "string",
                description: "Path to the character JSON file",
            })
            .option("characters", {
                type: "string",
                description:
                    "Comma separated list of paths to character JSON files",
            })
            .option("telegram", {
                type: "boolean",
                description: "Enable Telegram client",
                default: false,
            })
            .parseSync() as Arguments;
    } catch (error) {
        console.error("Error parsing arguments:", error);
        return {};
    }
}

export function loadCharacters(charactersArg: string): Character[] {
    let characterPaths = charactersArg
        ?.split(",")
        .map((path) => path.trim())
        .map((path) => {
            if (path.startsWith("../characters")) {
                return `../${path}`;
            }
            if (path.startsWith("characters")) {
                return `../../${path}`;
            }
            if (path.startsWith("./characters")) {
                return `../.${path}`;
            }
            return path;
        });

    const loadedCharacters = [];

    if (characterPaths?.length > 0) {
        for (const path of characterPaths) {
            try {
                const character = JSON.parse(fs.readFileSync(path, "utf8"));
                loadedCharacters.push(character);
            } catch (e) {
                console.error(`Error loading character from ${path}: ${e}`);
            }
        }
    }

    if (loadedCharacters.length === 0) {
        console.log("No characters found, using default character");
        loadedCharacters.push(defaultCharacter);
    }

    return loadedCharacters;
}

export function getTokenForProvider(
    provider: ModelProvider,
    character: Character
) {
    switch (provider) {
        case ModelProvider.OPENAI:
            return (
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProvider.ANTHROPIC:
            return (
                character.settings?.secrets?.ANTHROPIC_API_KEY ||
                character.settings?.secrets?.CLAUDE_API_KEY ||
                settings.ANTHROPIC_API_KEY ||
                settings.CLAUDE_API_KEY
            );
        case ModelProvider.REDPILL:
            return (
                character.settings?.secrets?.REDPILL_API_KEY ||
                settings.REDPILL_API_KEY
            );
    }
}
export function initializeDatabase() {
    if (settings.POSTGRES_URL) {
        return new Adapter.PostgresDatabaseAdapter({
            connectionString: settings.POSTGRES_URL,
        });
    } else {
        return new Adapter.SqliteDatabaseAdapter(new Database("./db.sqlite"));
    }
}

export async function createAgentRuntime(
    character: Character,
    db: any,
    token: string,
    configPath: string = "./elizaConfig.yaml"
) {
    const actionConfigs = loadActionConfigs(configPath);
    const customActions = await loadCustomActions(actionConfigs);

    console.log("Creating runtime for character", character.name);

    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators: [],
        character,
        providers: [Provider.timeProvider, Provider.boredomProvider],
        actions: [
            // Default actions
            ...defaultActions,

            // Custom actions
            Action.followRoom,
            Action.unfollowRoom,
            Action.unmuteRoom,
            Action.muteRoom,
            Action.imageGeneration,

            // imported from elizaConfig.yaml
            ...customActions,
        ],
    });
}

export async function createDirectRuntime(
    character: Character,
    db: any,
    token: string,
    configPath: string = "./elizaConfig.yaml"
) {
    const actionConfigs = loadActionConfigs(configPath);
    const customActions = await loadCustomActions(actionConfigs);

    console.log("Creating runtime for character", character.name);
    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators: [],
        character,
        providers: [
            Provider.timeProvider,
            Provider.boredomProvider,
            character.settings?.secrets?.WALLET_PUBLIC_KEY &&
                Provider.walletProvider,
        ].filter(Boolean),
        actions: [
            ...defaultActions,
            // Custom actions
            Action.followRoom,
            Action.unfollowRoom,
            Action.unmuteRoom,
            Action.muteRoom,
            Action.imageGeneration,

            // imported from elizaConfig.yaml
            ...customActions,
        ],
    });
}

export function startDiscord(runtime: IAgentRuntime): Promise<DiscordClient> {
    elizaLogger.log("Starting Discord client...");
    const discordClient = new DiscordClient(runtime);
    
    // Return a promise that resolves when Discord is ready
    return new Promise((resolve) => {
        discordClient.once('ready', () => {
            elizaLogger.log("Discord client fully initialized");
            resolve(discordClient);
        });
    });
}

export async function startTelegram(
    runtime: IAgentRuntime,
    character: Character
) {
    elizaLogger.log("🔍 Attempting to start Telegram bot...");
    const botToken = runtime.getSetting("TELEGRAM_BOT_TOKEN");

    if (!botToken) {
        elizaLogger.error(
            `❌ Telegram bot token is not set for character ${character.name}.`
        );
        return null;
    }

    try {
        const telegramClient = new Client.TelegramClient(runtime, botToken);
        await telegramClient.start();
        elizaLogger.success(
            `✅ Telegram client successfully started for character ${character.name}`
        );
        return telegramClient;
    } catch (error) {
        elizaLogger.error(
            `❌ Error creating/starting Telegram client for ${character.name}:`,
            error
        );
        return null;
    }
}

export async function startTwitter(runtime: IAgentRuntime) {
    elizaLogger.log("Starting Twitter clients...");
    
    // Create all clients first
    const twitterSearchClient = new Client.TwitterSearchClient(runtime);
    const twitterInteractionClient = new Client.TwitterInteractionClient(runtime);
    const twitterGenerationClient = new Client.TwitterPostClient(runtime);
    
    // Wait for each client to be ready
    await Promise.all([
        new Promise<void>((resolve) => {
            twitterSearchClient.once('ready', () => {
                elizaLogger.log("Twitter search client ready");
                resolve();
            });
        }),
        new Promise<void>((resolve) => {
            twitterInteractionClient.once('ready', () => {
                elizaLogger.log("Twitter interaction client ready");
                resolve();
            });
        }),
        new Promise<void>((resolve) => {
            twitterGenerationClient.once('ready', () => {
                elizaLogger.log("Twitter generation client ready");
                resolve();
            });
        })
    ]);

    return [
        twitterInteractionClient,
        twitterSearchClient,
        twitterGenerationClient,
    ];
}
