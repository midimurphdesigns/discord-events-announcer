const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");
require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Schedule a task to run every Sunday at 10 AM
    // cron.schedule("0 10 * * 0", () => {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        // Fetch scheduled events for the guild (server)
        const guild = channel.guild;
        const events = await guild.scheduledEvents.fetch();

        // Format the events into messages
        const eventMessages = events.map((event) => {
            console.log("event:", event);
            return (
                `**${event?.name}**\n` +
                `📍 Location: ${event?.entityMetadata?.location}\n` +
                `📝 Description: ${event?.description}\n` +
                `🕒 Start: ${event?.scheduledStartTimestamp?.toLocaleString()}\n` +
                `🕒 End: ${event?.scheduledEndTimestamp?.toLocaleString()}\n` +
                "---"
            ); // Separator between events
        });

        // Send each event message separately
        eventMessages.forEach(async (message) => {
            try {
                // Check if the message length exceeds 2000 characters
                if (message.length > 2000) {
                    // Truncate the message to 1997 characters and add '...'
                    message = message.slice(0, 1997) + "...";
                }

                await channel.send(message); // Send the message to the channel
            } catch (error) {
                // Handle the error if it occurs
                console.error("Error sending message:", error);

                // Check if the error is related to message length
                if (error.rawError?.errors?.content?._errors) {
                    error.rawError.errors.content._errors.forEach((err) => {
                        if (
                            err.message ===
                                "Must be 2000 or fewer in length." &&
                            err.code === "BASE_TYPE_MAX_LENGTH"
                        ) {
                            console.error(
                                "Message exceeded maximum length:",
                                message
                            );
                        }
                    });
                }
            }
        });

        // Send a final message to encourage participation
        channel.send(`Stay active and see you there!`);
    } else {
        console.log("Channel not found!");
    }
    // });
});

client.login(TOKEN);
