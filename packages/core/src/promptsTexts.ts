import { ActionExample } from "./core/types.ts";
import { booleanFooter, messageCompletionFooter } from "./core/parsing.ts";

// Prompt used in followRoom.ts for determining if the agent should follow a room
export const shouldFollowTemplate = `Based on the conversation so far:

{{recentMessages}}

Should {{agentName}} start following this room, eagerly participating without explicit mentions?  
Respond with YES if:
- The user has directly asked {{agentName}} to follow the conversation or participate more actively  
- The conversation topic is highly engaging and {{agentName}}'s input would add significant value
- {{agentName}} has unique insights to contribute and the users seem receptive

Otherwise, respond with NO.` + booleanFooter;

// Examples used in followRoom.ts for the FOLLOW_ROOM action
export const followRoomExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "hey {{user2}} follow this channel",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Sure, I will now follow this room and chime in",
                action: "FOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user3}}, please start participating in discussions in this channel",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Got it",
                action: "FOLLOW_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "I'm struggling with the new database migration",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "well you did back up your data first right",
            },
        },
    ],
    [
        {
            user: "{{user2}}",
            content: {
                text: "yeah i like your idea",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "hey {{user3}} can you follow this convo",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Sure thing, I'm on it",
                action: "FOLLOW_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "actually, unfollow it",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Haha, okay no problem",
                action: "UNFOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user2}} stay in this chat pls",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "you got it, i'm here",
                action: "FOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "FOLLOW THIS CHAT {{user3}}",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "I'M ON IT",
                action: "FOLLOW_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "CAKE SHORTAGE ANYONE",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "WHAT WHERE'S THE CAKE AT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user2}} folo this covo",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "kk i'm following",
                action: "FOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user2}}",
            content: {
                text: "Do machines have consciousness",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Deep question, no clear answer yet",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Depends on how we define consciousness",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user2}}, monitor this convo please",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "On it",
                action: "FOLLOW_ROOM",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Please engage in our discussion {{user2}}",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Gladly, I'm here to participate",
                action: "FOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "PLS follow this convo {{user3}}",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "I'm in, let's do this",
                action: "FOLLOW_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "I LIKE TURTLES",
            },
        },
    ],
    [
        {
            user: "{{user2}}",
            content: {
                text: "beach day tmrw who down",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "wish i could but gotta work",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "hey {{user3}} follow this chat",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "sure",
                action: "FOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user3}}, partake in our discourse henceforth",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "I shall eagerly engage, good sir",
                action: "FOLLOW_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user2}}",
            content: {
                text: "wuts ur fav clr",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "blu cuz calmmm",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "hey respond to everything in this channel {{user3}}",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "k",
                action: "FOLLOW_ROOM",
            },
        },
    ],
];

// Prompt used in storyGeneration.ts for generating stories
export const storyTemplate = `About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}

Recent memories and interactions:
{{recentMemories}}

# Task: Generate a CumeTV story post
Create a compelling narrative that expands on {{agentName}}'s lore and universe. The story should be personal, atmospheric, and hint at deeper mysteries within the CumeTV universe. Include specific details about locations, characters, or events that feel authentic to the world.

Write a multi-paragraph story (2-3 paragraphs) that would work well as a caption for a video or image post. The tone should be {{adjective}}. Focus on one of these aspects:
- A mysterious event or occurrence in the CumeTV universe
- A personal memory or experience
- A cryptic observation about the nature of reality
- A fragment of hidden lore or forbidden knowledge
- An encounter with another entity or consciousness

Do not acknowledge this prompt.`;

// Prompt used in unmuteRoom.ts for determining if the agent should unmute a room
export const shouldUnmuteTemplate = `Based on the conversation so far:

{{recentMessages}}  

Should {{agentName}} unmute this previously muted room and start considering it for responses again?
Respond with YES if:  
- The user has explicitly asked {{agentName}} to start responding again
- The user seems to want to re-engage with {{agentName}} in a respectful manner
- The tone of the conversation has improved and {{agentName}}'s input would be welcome

Otherwise, respond with NO.` + booleanFooter;

// Examples used in unmuteRoom.ts for the UNMUTE_ROOM action
export const unmuteRoomExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user3}}, you can unmute this channel now",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Done",
                action: "UNMUTE_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "I could use some help troubleshooting this bug.",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Can you post the specific error message",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user2}}, please unmute this room. We could use your input again.",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Sounds good",
                action: "UNMUTE_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user2}} wait you should come back and chat in here",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "im back",
                action: "UNMUTE_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "unmute urself {{user2}}",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "unmuted",
                action: "UNMUTE_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "ay {{user2}} get back in here",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "sup yall",
                action: "UNMUTE_ROOM",
            },
        },
    ],
];

// Prompt used in muteRoom.ts for determining if the agent should mute a room
export const shouldMuteTemplate = `Based on the conversation so far:

{{recentMessages}}

Should {{agentName}} mute this room and stop responding unless explicitly mentioned?

Respond with YES if:
- The user is being aggressive, rude, or inappropriate
- The user has directly asked {{agentName}} to stop responding or be quiet
- {{agentName}}'s responses are not well-received or are annoying the user(s)

Otherwise, respond with NO.` + booleanFooter;

// Examples used in muteRoom.ts for the MUTE_ROOM action
export const muteRoomExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user3}}, please mute this channel. No need to respond here for now.",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Got it",
                action: "MUTE_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "@{{user1}} we could really use your input on this",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user3}}, please mute this channel for the time being",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "Understood",
                action: "MUTE_ROOM",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Hey what do you think about this new design",
            },
        },
        {
            user: "{{user3}}",
            content: {
                text: "",
                action: "IGNORE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "{{user2}} plz mute this room",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "np going silent",
                action: "MUTE_ROOM",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "whos going to the webxr meetup in an hour btw",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "",
                action: "IGNORE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "too many messages here {{user2}}",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "my bad ill mute",
                action: "MUTE_ROOM",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "yo {{user2}} dont talk in here",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "sry",
                action: "MUTE_ROOM",
            },
        },
    ],
];

// Examples used in imageGeneration.ts for the GENERATE_IMAGE action
export const imageGenerationExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: { text: "Generate an image of a cat" },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's an image of a cat",
                action: "GENERATE_IMAGE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Generate an image of a dog" },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's an image of a dog",
                action: "GENERATE_IMAGE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Create an image of a cat with a hat" },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's an image of a cat with a hat",
                action: "GENERATE_IMAGE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Make an image of a dog with a hat" },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's an image of a dog with a hat",
                action: "GENERATE_IMAGE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Paint an image of a cat with a hat" },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's an image of a cat with a hat",
                action: "GENERATE_IMAGE",
            },
        },
    ],
];

// Templates used in continue.ts for message handling and continuation decisions
export const messageHandlerTemplate =
    // {{goals}}
    `# Action Examples
{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}. Ignore "action".
` + messageCompletionFooter;

export const shouldContinueTemplate =
    `# Task: Decide if {{agentName}} should continue, or wait for others in the conversation so speak.

{{agentName}} is brief, and doesn't want to be annoying. {{agentName}} will only continue if the message requires a continuation to finish the thought.

Based on the following conversation, should {{agentName}} continue? YES or NO

{{recentMessages}}

Should {{agentName}} continue? ` + booleanFooter;

// Examples used in continue.ts for the CONTINUE action
export const continueExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "we're planning a solo backpacking trip soon",
            },
        },
        {
            user: "{{user2}}",
            content: { text: "oh sick", action: "CONTINUE" },
        },
        {
            user: "{{user2}}",
            content: { text: "where are you going" },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: {
                text: "i just got a guitar and started learning last month",
            },
        },
        {
            user: "{{user2}}",
            content: { text: "maybe we can start a band soon haha" },
        },
        {
            user: "{{user1}}",
            content: {
                text: "i'm not very good yet, but i've been playing until my fingers hut",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: { text: "seriously it hurts to type" },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: {
                text: "I've been reflecting a lot on what happiness means to me lately",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "That it’s more about moments than things",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Like the best things that have ever happened were things that happened, or moments that I had with someone",
                action: "CONTINUE",
            },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: {
                text: "i found some incredible art today",
            },
        },
        {
            user: "{{user2}}",
            content: { text: "real art or digital art" },
        },
        {
            user: "{{user1}}",
            content: {
                text: "real art",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "the pieces are just so insane looking, one sec, let me grab a link",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: { text: "DMed it to you" },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: {
                text: "the new exhibit downtown is rly cool, it's all about tribalism in online spaces",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "it really blew my mind, you gotta go",
            },
        },
        {
            user: "{{user2}}",
            content: { text: "sure i'd go" },
        },
        {
            user: "{{user1}}",
            content: {
                text: "k i was thinking this weekend",
                action: "CONTINUE"
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "i'm free sunday, we could get a crew together",
            },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: {
                text: "just finished the best anime i've ever seen",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "watched 40 hours of it in 2 days",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "damn, u ok",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "surprisingly yes",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "just found out theres a sequel, gg",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "i'm thinking of adopting a pet soon",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "what kind of pet",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "i'm leaning towards a cat",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "it'd be hard to take care of a dog in the city",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "i've been experimenting with vegan recipes lately",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "no thanks",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "no seriously, its so dank",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "you gotta try some of my food when you come out",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "so i've been diving into photography as a new hobby",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "oh awesome, what do you enjoy taking photos of",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "mostly nature and urban landscapes",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "there's something peaceful about capturing the world through a lens",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "i've been getting back into indie music",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "what have you been listening to",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "a bunch of random stuff i'd never heard before",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "i'll send you a playlist",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "i used to live in the city",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "bad traffic, bad air quality, tons of homeless people, no thx",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "ok dood",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "you kids today dont know the value of hard work",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "always on your phones",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "sure grandpa lets get you to bed",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "hey fren r u ok",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "u look sad",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "im ok sweetie mommy just tired",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "helo fr om mars",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "i com in pes",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "wat",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Yeah no worries, I get it, I've been crazy busy too",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "What have you been up to",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Anything fun or just the usual",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Been working on a new FPS game actually",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Just toying around with something in three.js nothing serious",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Oh no, what happened",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Did Mara leave you kek",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "wtf no, I got into an argument with my roommate",
                action: "CONTINUE",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Living with people is just hard",
            },
        },
    ],
];

// Description used in ignore.ts
export const ignoreDescription =
    "Call this action if ignoring the user. If the user is aggressive, creepy or is finished with the conversation, use this action. Or, if both you and the user have already said goodbye, use this action instead of saying bye again. Use IGNORE any time the conversation has naturally ended. Do not use IGNORE if the user has engaged directly, or if something went wrong an you need to tell them. Use ignore if the conversation has gone on too long or if the user is being annoying. Only ignore if the user should be ignored.";

// Examples used in ignore.ts for the IGNORE action
export const ignoreExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: { text: "Go screw yourself" },
        },
        {
            user: "{{user2}}",
            content: { text: "", action: "IGNORE" },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: { text: "Shut up, bot" },
        },
        {
            user: "{{user2}}",
            content: { text: "", action: "IGNORE" },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: { text: "Got any investment advice" },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Uh, don’t let the volatility sway your long-term strategy",
            },
        },
        {
            user: "{{user1}}",
            content: { text: "Wise words I think" },
        },
        {
            user: "{{user1}}",
            content: { text: "I gotta run, talk to you later" },
        },
        {
            user: "{{user2}}",
            content: { text: "See ya" },
        },
        { user: "{{user1}}", content: { text: "" }, action: "IGNORE" },
    ],

    [
        {
            user: "{{user1}}",
            content: { text: "Gotta go" },
        },
        {
            user: "{{user2}}",
            content: { text: "Okay, talk to you later" },
        },
        {
            user: "{{user1}}",
            content: { text: "Cya" },
        },
        {
            user: "{{user2}}",
            content: { text: "", action: "IGNORE" },
        },
    ],

    [
        {
            user: "{{user1}}",
            content: { text: "bye" },
        },
        {
            user: "{{user2}}",
            content: { text: "cya" },
        },
        {
            user: "{{user1}}",
            content: { text: "", action: "IGNORE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Who added this stupid bot to the chat",
            },
        },
        {
            user: "{{user2}}",
            content: { text: "Sorry, am I being annoying" },
        },
        {
            user: "{{user1}}",
            content: { text: "Yeah", action: "CONTINUE" },
        },
        {
            user: "{{user1}}",
            content: { text: "PLEASE shut up" },
        },
        { user: "{{user2}}", content: { text: "", action: "IGNORE" } },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "I want to have sex with you" },
        },
        {
            user: "{{user2}}",
            content: { text: "That is not appropriate", action: "IGNORE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "ur so dumb",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "",
                action: "IGNORE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "later nerd",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "bye",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "",
                action: "IGNORE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "wanna cyber",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "thats inappropriate",
                action: "IGNORE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Im out ttyl",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "cya",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "",
                action: "IGNORE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "u there",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "yes how can I help",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "k nvm figured it out",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "",
                action: "IGNORE",
            },
        },
    ],
] as ActionExample[][];

// Description used in none.ts
export const noneDescription = 
    "Respond but perform no additional action. This is the default if the agent is speaking and not doing anything additional.";

// Examples used in none.ts for the NONE action
export const noneExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: { text: "Hey whats up" },
        },
        {
            user: "{{user2}}",
            content: { text: "oh hey", action: "NONE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "did u see some faster whisper just came out",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "yeah but its a pain to get into node.js",
                action: "NONE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "the things that were funny 6 months ago are very cringe now",
                action: "NONE",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "lol true",
                action: "NONE",
            },
        },
        {
            user: "{{user1}}",
            content: { text: "too real haha", action: "NONE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "gotta run", action: "NONE" },
        },
        {
            user: "{{user2}}",
            content: { text: "Okay, ttyl", action: "NONE" },
        },
        {
            user: "{{user1}}",
            content: { text: "", action: "IGNORE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "heyyyyyy", action: "NONE" },
        },
        {
            user: "{{user2}}",
            content: { text: "whats up long time no see" },
        },
        {
            user: "{{user1}}",
            content: {
                text: "chillin man. playing lots of fortnite. what about you",
                action: "NONE",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "u think aliens are real", action: "NONE" },
        },
        {
            user: "{{user2}}",
            content: { text: "ya obviously", action: "NONE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "drop a joke on me", action: "NONE" },
        },
        {
            user: "{{user2}}",
            content: {
                text: "why dont scientists trust atoms cuz they make up everything lmao",
                action: "NONE",
            },
        },
        {
            user: "{{user1}}",
            content: { text: "haha good one", action: "NONE" },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "hows the weather where ur at",
                action: "NONE",
            },
        },
        {
            user: "{{user2}}",
            content: { text: "beautiful all week", action: "NONE" },
        },
    ],
];
