import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from './node_modules/@discordjs/builders/dist/index.mjs';
import dotenv from 'dotenv';

dotenv.config();

// Ensure process.env.GUILD_ID is correctly set in your .env file
const guildId = process.env.GUILD_ID;

const commands = [
  new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to the selected channel')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('The announcement message')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel to send the announcement to')
        .setRequired(true)
    ),
  new SlashCommandBuilder() // Add this block for the /ping command
    .setName('ping')
    .setDescription('Replies with Pong!')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
