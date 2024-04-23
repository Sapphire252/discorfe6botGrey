const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const { deductCurrency } = require('../currencySystem.js'); // Adjust the path accordingly

// Configure MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deductcurrency')
    .setDescription('Deduct currency from a user')
    .addUserOption(option =>
      option.setName('user').setDescription('The user to deduct currency from').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount').setDescription('The amount of currency to deduct').setRequired(true)
    ),
  async execute(interaction) {
    const author = interaction.user;
    
    // Check if the author has the "Owner" role
    const ownerRole = interaction.guild.roles.cache.find(role => role.name === 'owner');
    if (!ownerRole || !interaction.member.roles.cache.has(ownerRole.id)) {
      await interaction.reply("You don't have permission to use this command.");
      return;
    }

    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    // Connect to the MongoDB
    await client.connect();
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('users');

    // Deduct currency from the user
    const deductionSuccessful = await deductCurrency(user.id, amount, collection);

    // Close the MongoDB connection
    await client.close();

    if (deductionSuccessful) {
      await interaction.reply(`Successfully deducted ${amount} furcoin from ${user.username}.`);
    } else {
      await interaction.reply(`Insufficient balance or user not found.`);
    }
  },
};
