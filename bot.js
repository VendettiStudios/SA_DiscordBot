import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { logSlashCommandUsage, logMemberJoin, logMemberLeave } from './commandLogs.js';
import { clearChannel } from './clearChannel.js'; // Import the clearChannel function

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages, // Add this intent
  ],
});
const loggingPreferences = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  // Log every command usage
  if (loggingPreferences.commands?.isEnabled) {
    logSlashCommandUsage(
      client,
      loggingPreferences.commands.channelId,
      interaction.commandName,
      interaction.user.tag
    );
  }

  if (interaction.commandName === 'ping') {
    const { execute } = await import('./ping.js');
    await execute(interaction);
  } else if (interaction.commandName === 'announce') {
    const { default: handleAnnounceCommand } = await import('./announcement.js');
    await handleAnnounceCommand(interaction);
  } else if (interaction.commandName === 'log') {
    const logChannel = interaction.options.getChannel('logchannel');
    const logCommands = interaction.options.getBoolean('log_commands');
    const logComing = interaction.options.getBoolean('log_coming');
    const comingMessage = interaction.options.getString('coming_message') || 'has joined the server';
    const logGoing = interaction.options.getBoolean('log_going');
    const leavingMessage = interaction.options.getString('leaving_message') || 'has left the server';

    loggingPreferences.commands = { channelId: logChannel.id, isEnabled: logCommands };
    loggingPreferences.coming = { channelId: logChannel.id, isEnabled: logComing, message: comingMessage };
    loggingPreferences.going = { channelId: logChannel.id, isEnabled: logGoing, message: leavingMessage };

    await interaction.reply('Log settings updated.');
  } else if (interaction.commandName === 'clear') { // Add this block to handle the /clear command
    // Check if the user has permission to manage messages
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    // Clear the current channel
    const cleared = await clearChannel(interaction.channel);

    if (cleared) {
      interaction.reply('All messages in this channel have been cleared.');
    } else {
      interaction.reply('An error occurred while clearing messages.');
    }
  }
});

client.on('guildMemberAdd', member => {
  if (loggingPreferences.coming?.isEnabled) {
    const message = `User (${member.user.tag}) ${loggingPreferences.coming.message}`;
    logMemberJoin(client, loggingPreferences.coming.channelId, message);
  }
});

client.on('guildMemberRemove', member => {
  if (loggingPreferences.going?.isEnabled) {
    const message = `User (${member.user.tag}) ${loggingPreferences.going.message}`;
    logMemberLeave(client, loggingPreferences.going.channelId, message);
  }
});

client.login(process.env.DISCORD_TOKEN);
