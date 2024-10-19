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

        // Format the events into a message
        const options = {
            year: "numeric",
            month: "long", // Full month name
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // 12-hour format
        };

        // Create the event list with formatted strings
        const eventList = events.map((event) => {
            const startDate = new Date(event?.scheduledStartTimestamp);
            const endDate = new Date(event?.scheduledEndTimestamp);

            return {
                message:
                    `**Event:** ${event?.name}\n` +
                    `**Location:** ${event?.entityMetadata?.location}\n` +
                    `**Description:** ${event?.description}\n` +
                    `**Start Time:** ${startDate.toLocaleString(
                        "en-US",
                        options
                    )}\n` +
                    `**End Time:** ${endDate.toLocaleString("en-US", options)}`,
                length:
                    event?.name.length +
                    event?.entityMetadata?.location.length +
                    event?.description.length +
                    100, // Rough estimate for length
            };
        });

        // Initialize the base message
        let baseMessage = `🚨 **Event Reminder Announcement!** 🚨\n\nHere are all scheduled events:\n\n`;

        // Send the announcement message first
        await channel.send(baseMessage);

        // Send each event message separately
        for (const event of eventList) {
            const eventMessage = event.message;

            // Check if the individual message exceeds the character limit
            if (eventMessage.length > 2000) {
                // If it exceeds, truncate and send the message
                const truncatedMessage = eventMessage.slice(0, 1997) + "...";
                await channel.send(truncatedMessage);
            } else {
                // Send the event message directly
                await channel.send(eventMessage);
            }

            // Send a separator after each event for clarity
            await channel.send("---"); // Clear separator for each event
        }

        // Notify users to stay active at the end
        await channel.send("Stay active and see you there! 🎉");
    } else {
        console.log("Channel not found!");
    }
    // });
});

client.login(TOKEN);
