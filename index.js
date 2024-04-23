require("dotenv").config();
const fs = require("fs");
const { Client, Collection, GatewayIntentBits, ActivityType } = require("discord.js");
const { MongoClient } = require('mongodb'); // Import MongoClient from mongodb package
const http = require('http');
const https = require('https');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.commands = new Collection(); // Saving the commands

const commandFiles = fs.readdirSync('/home/node/src/commands').filter(file => file.endsWith('.js'));

commandFiles.forEach((commandFile) => {
  const command = require(`/home/node/src/commands/${commandFile}`);
  client.commands.set(command.data.name, command);
});

const activityNames = [
  "with a friend",
  "with Shork",
  "some music",
  "daydreaming",
  "something cool",
];

let currentActivityIndex = 0;

// Function to set a random activity
function setRandomActivity() {
  const randomNameIndex = Math.floor(Math.random() * activityNames.length);
  const randomName = activityNames[randomNameIndex];

  client.user.setActivity({ name: randomName, type: ActivityType.Playing });
}

// Set initial activity when bot is ready
client.once("ready", () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  setRandomActivity(); // Set initial random activity
});

// Change activity every 10 minutes
setInterval(() => {
  setRandomActivity();
}, 10 * 60 * 1000); // 10 minutes in milliseconds

// Normal command was said
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      if (interaction.deferred || interaction.replied) {
        interaction.editReply('Defer Stuff');
      } else {
        interaction.reply('There was an error while executing this command!');
      }
    }
  }
});

// MongoDB configuration
const uri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// When the bot is added to a new server
client.on("guildCreate", async (guild) => {
  console.log(`Added to guild: ${guild.name} (ID: ${guild.id})`);

  try {
    await mongoClient.connect();
    const database = mongoClient.db('bot_db'); // Change to your desired database name
    const collection = database.collection('guilds');

    // Insert the guild ID and name into the collection
    await collection.insertOne({ guildId: guild.id, guildName: guild.name });
  } catch (error) {
    console.error("Error adding guild to MongoDB:", error);
  } finally {
    await mongoClient.close();
  }
});

// When the bot is removed from a server
client.on("guildDelete", async (guild) => {
  console.log(`Removed from guild: ${guild.name} (ID: ${guild.id})`);

  try {
    await mongoClient.connect();
    const database = mongoClient.db('bot_db'); // Change to your desired database name
    const collection = database.collection('guilds');

    // Remove the guild ID from the collection
    await collection.deleteOne({ guildId: guild.id });
  } catch (error) {
    console.error("Error removing guild from MongoDB:", error);
  } finally {
    await mongoClient.close();
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);