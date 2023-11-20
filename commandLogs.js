import { TextChannel } from 'discord.js';

// Function to log messages to a specific channel
async function logToChannel(client, channelId, message) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel instanceof TextChannel) {
            await channel.send(message);
            console.log('Message logged to channel:', message);
        }
    } catch (error) {
        console.error('Error logging to channel:', error);
    }
}

export function logSlashCommandUsage(client, channelId, commandName, user) {
    const logMessage = `User (${user}) has used the /${commandName} command.`;
    logToChannel(client, channelId, logMessage);
}

export function logMemberJoin(client, channelId, user) {
    const logMessage = `(${user}) has joined the server.`;
    logToChannel(client, channelId, logMessage);
}

export function logMemberLeave(client, channelId, user) {
    // Format the username in bold using Discord's markdown syntax
    const logMessage = `**${user}** has left the server.`;
    logToChannel(client, channelId, logMessage);
}
