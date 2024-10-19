const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

// Replace with your bot token and channel ID
const TOKEN = "YOUR_BOT_TOKEN";
const CHANNEL_ID = "YOUR_CHANNEL_ID"; // Replace with your announcements channel ID

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Schedule a task to run every Sunday at 10 AM
    cron.schedule("0 10 * * 0", () => {
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            channel.send(
                "🚨 **Weekly Event Announcement!** 🚨\n\nHere are the upcoming events for this week:\n- Event 1: Date & Time\n- Event 2: Date & Time\n- Event 3: Date & Time\n\nStay active and see you there!"
            );
        } else {
            console.log("Channel not found!");
        }
    });
});

client.login(TOKEN);
