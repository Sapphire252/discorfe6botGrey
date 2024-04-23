const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoClient } = require('mongodb');
const { Client, GatewayIntentBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the server remotely (owner only)')
    .addStringOption(option =>
      option.setName('guild_id')
        .setDescription('The ID of the guild/server to leave')
        .setRequired(true)),

  async execute(interaction) {
    // Check if the command is being used by you (the owner)
    const ownerId = process.env.YOUR_USER_ID; // Replace with your user ID
    if (interaction.user.id !== ownerId) {
      return interaction.reply('You are not authorized to use this command.');
    }

    // Get the provided guild ID from the command interaction
    const guildId = interaction.options.getString('guild_id');

    // Configure MongoDB connection
    const uri = process.env.MONGODB_URI;
    const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      // Connect to MongoDB
      await mongoClient.connect();
      const database = mongoClient.db('bot_db');
      const collection = database.collection('guilds');

      // Check if the guild ID exists in the database
      const guildData = await collection.findOne({ guildId: guildId });
      if (!guildData) {
        return interaction.reply('Guild ID not found in the database.');
      }

      // Send a confirmation message
      await interaction.reply(`Leaving server ${guildId}.`);

      // Close MongoDB connection before leaving the server
      await mongoClient.close();

      // Initialize a new bot client for this command
      const botClient = new Client({
        intents: [GatewayIntentBits.Guilds],
      });

      // Log in with the bot token
      await botClient.login(process.env.DISCORD_BOT_TOKEN);

      // Leave the server
      botClient.guilds.cache.get(guildId)?.leave();
    } catch (error) {
      console.error(error);
    }
  },
};
