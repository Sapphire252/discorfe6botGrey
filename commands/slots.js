const { SlashCommandBuilder } = require("@discordjs/builders");
const { MongoClient } = require('mongodb');
const { deductCurrency, addCurrency } = require('../currencySystem.js'); // Adjust the path accordingly

// Configure MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

function getRandomSlot() {
  const slotOptions = ["🍒", "🍊", "🍇", "🍀", "🔔", "💎"];
  const randomIndex = Math.floor(Math.random() * slotOptions.length);
  return slotOptions[randomIndex];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play the slots game')
    .addIntegerOption(option =>
      option.setName('bid')
        .setDescription('Enter the amount you want to bid.')
        .setRequired(true)),

  async execute(interaction) {
    const author = interaction.user;
    const userId = author.id;

    // Get the user's bid amount from the interaction
    const bidAmount = interaction.options.getInteger('bid');

    // Connect to MongoDB
    await client.connect();
    const database = client.db('test'); // Replace with your database name
    const collection = database.collection('users');

    // Get the user's balance
    const user = await collection.findOne({ _id: userId });
    const balance = user ? user.balance : 0;

    // Check if user has enough balance to bid
    if (balance < bidAmount) {
      await interaction.reply("You don't have enough currency to play.");
      return;
    }

    const slot1 = getRandomSlot();
    const slot2 = getRandomSlot();
    const slot3 = getRandomSlot();

    await interaction.reply(`[${slot1} | ${slot2} | ${slot3}]`);

    if (
      (slot1 === "🍒" && slot2 === "🍒") || (slot1 === "🍊" && slot2 === "🍊") || (slot1 === "🍇" && slot2 === "🍇") ||
      (slot1 === "🍒" && slot3 === "🍒") || (slot1 === "🍊" && slot3 === "🍊") || (slot1 === "🍇" && slot3 === "🍇") ||
      (slot2 === "🍒" && slot3 === "🍒") || (slot2 === "🍊" && slot3 === "🍊") || (slot2 === "🍇" && slot3 === "🍇") ||
      (slot1 === "🍀" && slot2 === "🍀") || (slot1 === "🔔" && slot2 === "🔔") || (slot1 === "💎" && slot2 === "💎") ||
      (slot1 === "🍀" && slot3 === "🍀") || (slot1 === "🔔" && slot3 === "🔔") || (slot1 === "💎" && slot3 === "💎") ||
      (slot2 === "🍀" && slot3 === "🍀") || (slot2 === "🔔" && slot3 === "🔔") || (slot2 === "💎" && slot3 === "💎")
    ) {
      const matchingPairReward = bidAmount * 2; // Adjust as needed
      await addCurrency(userId, matchingPairReward, collection);
      await interaction.followUp(`Nice, you got a matching pair! You've been awarded ${matchingPairReward} furcoins.`);
    } else if (slot1 === slot2 && slot2 === slot3) {
      if (slot1 === "🍀" || slot1 === "🔔" || slot1 === "💎") {
        const jackpotAmount = bidAmount * 3; // Adjust as needed
        await addCurrency(userId, jackpotAmount, collection);
        await interaction.followUp(`Congratulations, you won the jackpot! You've been awarded ${jackpotAmount} furcoins.`);
      } else {
        await interaction.followUp("Better luck next time!");
      }
    } else {
      // Deduct the bid amount as they didn't win
      await deductCurrency(userId, bidAmount, collection);
      await interaction.followUp(`Sorry, you didn't win this time. You lost ${bidAmount} furcoin.`);
    }

    // Close MongoDB connection
    await client.close();
  },
};
