const { SlashCommandBuilder } = require("@discordjs/builders");
const { MongoClient } = require('mongodb');
const { addCurrency } = require('../currencySystem.js'); // Adjust the path accordingly

// Configure MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),

  async execute(interaction) {
    const author = interaction.user;
    const userId = author.id;

    // Connect to MongoDB
    await client.connect();
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('users');

    // Get the user's last daily claim timestamp
    const user = await collection.findOne({ _id: userId });
    const lastClaimTimestamp = user ? user.lastClaimTimestamp : 0;

    const currentTime = Date.now();
    const timeSinceLastClaim = currentTime - lastClaimTimestamp;
    const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeSinceLastClaim < cooldownDuration) {
      const remainingCooldown = cooldownDuration - timeSinceLastClaim;
      const remainingHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

      await interaction.reply(`You've already claimed your daily reward. Please wait ${remainingHours} hours and ${remainingMinutes} minutes.`);
      return;
    }

    // Add the daily reward amount
    const dailyRewardAmount = 100; // Adjust as needed
    await addCurrency(userId, dailyRewardAmount, collection);

    // Update the last claim timestamp
    await collection.updateOne({ _id: userId }, { $set: { lastClaimTimestamp: currentTime } }, { upsert: true });

    await interaction.reply(`Congratulations! You've claimed your daily reward of ${dailyRewardAmount} furcoins.`);

    // Close MongoDB connection
    await client.close();
  },
};
