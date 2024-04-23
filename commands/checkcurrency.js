const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const { deductCurrency } = require('../currencySystem.js'); // Adjust the path accordingly

// Configure MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkcurrency')
    .setDescription('Check your currency balance')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to check currency for')),
  async execute(interaction) {
    const userOption = interaction.options.getUser('user');
    const targetUser = userOption || interaction.user;

    // Connect to MongoDB
    await client.connect();
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('users');

    // Retrieve currency data for the user
    const userCurrencyData = await collection.findOne({ _id: targetUser.id });

    // Close MongoDB connection
    await client.close();

    if (userCurrencyData) {
      const amount = userCurrencyData.balance; // Assuming "balance" field
      await interaction.reply(`${targetUser.username} has ${amount} furcoin.`);
    } else {
      await interaction.reply(`${targetUser.username} has no currency data.`);
    }
  },
};
