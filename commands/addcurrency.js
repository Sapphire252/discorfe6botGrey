const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const { addCurrency } = require('../currencySystem.js'); // Adjust the path accordingly

// Configure MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Replace 'YOUR_USER_ID' with your actual user ID
const YOUR_USER_ID = process.env['YOUR_USER_ID'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcurrency')
    .setDescription('Add currency to a user')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to add currency to').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount').setDescription('The amount of currency to add').setRequired(true)
    ),
  async execute(interaction) {
    // Check if the command is being used by you (the owner)
    if (interaction.user.id !== YOUR_USER_ID) {
      await interaction.reply("You don't have permission to use this command.");
      return;
    }

    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    // Connect to the MongoDB
    await client.connect();
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('users');

    // Add currency to the user
    await addCurrency(user.id, amount, collection);

    // Close the MongoDB connection
    await client.close();

    await interaction.reply(`Successfully added ${amount} furcoin to ${user.username}.`);
  },
};
