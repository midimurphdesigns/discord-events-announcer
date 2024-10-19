const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Log in the bot
client.login(TOKEN);

// This function sends an announcement message to a specified channel
async function announceOnce() {
    // Replace with your target channel ID
    const channelId = CHANNEL_ID;
    console.log(`Attempting to fetch channel with ID: ${channelId}`);
    const channel = await client.channels.fetch(CHANNEL_ID);
    console.log(channel.permissionsFor(client.user).toArray());

    if (channel) {
        await channel.send("This is a one-time announcement from the bot!");
        console.log("Announcement sent successfully.");
    } else {
        console.error("Channel not found.");
    }

    // Log out the bot after sending the announcement
    client.destroy();
}

// Once the bot is ready, run the announcement
client.once("ready", () => {
    console.log("Bot is ready!");
    announceOnce();
});
