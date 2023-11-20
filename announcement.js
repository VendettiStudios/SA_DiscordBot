import Discord from 'discord.js';

export default async function handleAnnounceCommand(interaction) {
    // Retrieve the message and channel options from the user's input
    const options = interaction.options;
    const message = options.getString('message');
    const channel = options.getChannel('channel');
  
    try {
      // Send the custom message to the selected channel
      if (channel instanceof Discord.TextChannel) { // Check if it's a text channel
        await channel.send(message);
        await interaction.reply({ content: 'Announcement sent successfully!', ephemeral: true });
      } else {
        console.error('Channel not found or not a text channel');
        await interaction.reply({ content: 'Failed to send announcement. Channel not found or not a text channel.', ephemeral: true });
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      await interaction.reply({ content: 'Failed to send announcement.', ephemeral: true });
    }
}
