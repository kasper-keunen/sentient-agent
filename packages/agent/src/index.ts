import {
    AgentRuntime,
    boredomProvider,
    Character,
    defaultActions,
    defaultCharacter,
    DirectClient,
    followRoom,
    getTokenForProvider,
    IAgentRuntime,
    settings,
    initializeClients,
    initializeDatabase,
    loadActionConfigs,
    loadCharacters,
    loadCustomActions,
    muteRoom,
    parseArguments,
    timeProvider,
    unfollowRoom,
    unmuteRoom,
    walletProvider,
} from "@eliza/core";
import readline from "readline";
const args = parseArguments();

let charactersArg = args.characters || args.character;

let characters = [defaultCharacter];

if (charactersArg) {
    characters = loadCharacters(charactersArg);
}

const directClient = new DirectClient();

const serverPort = parseInt(settings.SERVER_PORT || "3000");
directClient.start(serverPort);

export async function createAgent(
    character: Character,
    db: any,
    token: string,
    configPath: string = "./elizaConfig.yaml"
) {
    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators: [],
        character,
        providers: [
            timeProvider,
            boredomProvider,
            character.settings?.secrets?.WALLET_PUBLIC_KEY !== undefined &&
                walletProvider,
        ].filter(Boolean),
        actions: [
            ...defaultActions,

            // Custom actions
            followRoom,
            unfollowRoom,
            unmuteRoom,
            muteRoom,

            // imported from elizaConfig.yaml
            ...(await loadCustomActions(loadActionConfigs(configPath))),
        ],
    });
}

async function startAgent(character: Character) {
    try {
        const token = getTokenForProvider(character.modelProvider, character);
        const db = initializeDatabase();

        const runtime = await createAgent(character, db, token);

        const clients = await initializeClients(
            character,
            runtime as IAgentRuntime
        );

        directClient.registerAgent(runtime);

        return clients;
    } catch (error) {
        console.error(
            `Error starting agent for character ${character.name}:`,
            error
        );
        throw error; // Re-throw after logging
    }
}

const startAgents = async () => {
    try {
        for (const character of characters) {
            await startAgent(character);
        }
    } catch (error) {
        console.error("Error starting agents:", error);
    }
};

startAgents().catch((error) => {
    console.error("Unhandled error in startAgents:", error);
    process.exit(1); // Exit the process after logging
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function handleUserInput(input) {
    if (input.toLowerCase() === "exit") {
        rl.close();
        return;
    }

    const agentId = characters[0].name.toLowerCase();
    try {
        const response = await fetch(
            `http://localhost:${serverPort}/${agentId}/message`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: input,
                    userId: "user",
                    userName: "User",
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${errorText}`);
        }

        const data = await response.json();

        data.forEach((message) =>
            console.log(`${characters[0].name}: ${message.text}`)
        );
    } catch (error) {
        console.error("Error handling user input:", error);
        throw error;
    }

    chat();
}

function chat() {
    rl.question("You: ", handleUserInput);
}

console.log("Chat started. Type 'exit' to quit.");
chat();
