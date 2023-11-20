import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from './node_modules/@discordjs/builders/dist/index.js';
import dotenv from 'dotenv';

dotenv.config();

const guildId = process.env.GUILD_ID;

const commands = [
    new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement to the selected channel')
        .addStringOption(option =>
            option.setName('message').setDescription('The announcement message').setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel').setDescription('The channel to send the announcement to').setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    new SlashCommandBuilder()
        .setName('log')
        .setDescription('Configure logging settings')
        .addChannelOption(option =>
            option.setName('logchannel').setDescription('The channel to log events').setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('log_commands').setDescription('Enable or disable logging of /commands')
        )
        .addBooleanOption(option =>
            option.setName('log_coming').setDescription('Enable or disable logging of members joining')
        )
        .addStringOption(option =>
            option.setName('coming_message').setDescription('Custom message for logging members joining')
        )
        .addBooleanOption(option =>
            option.setName('log_going').setDescription('Enable or disable logging of members leaving')
        )
        .addStringOption(option =>
            option.setName('leaving_message').setDescription('Custom message for logging members leaving')
        ),
    new SlashCommandBuilder() // Add the clear command
        .setName('clear')
        .setDescription('Clear all messages in the channel')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
