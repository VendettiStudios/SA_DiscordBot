import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    // Import the execute function from ping.js and execute it
    const { execute } = await import('./ping.js');
    execute(interaction);
  } else if (interaction.commandName === 'announce') {
    // Import the handleAnnounceCommand function from announcement.js and execute it
    const { default: handleAnnounceCommand } = await import('./announcement.js');
    handleAnnounceCommand(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
