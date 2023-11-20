import { TextChannel } from 'discord.js';

// Function to clear all messages in a channel
async function clearChannel(channel) {
  if (channel instanceof TextChannel) {
    try {
      const fetchedMessages = await channel.messages.fetch();
      await channel.bulkDelete(fetchedMessages);
      return true;
    } catch (error) {
      console.error('Error clearing messages:', error);
      return false;
    }
  } else {
    console.error('Channel is not a text channel.');
    return false;
  }
}

export { clearChannel };
