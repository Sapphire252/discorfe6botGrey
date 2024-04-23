
const clientId = process.env['DISCORD_APPLICATION_ID'];
const guildId = process.env['DISCORD_GUILD_ID'];
const token = process.env['DISCORD_BOT_TOKEN'];


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/*const commands = [{
    name: 'activedevbadge',
    description: 'An example command'
}];*/

const rest = new REST({ version: '9' }).setToken(token);

// Fetch all registered commands
rest.get(Routes.applicationCommands(clientId)).then(commands => {
  // Find the command with the matching name
  console.log(commands)
  const command = commands.find(cmd => cmd.name == 'e621');
  if (command) {
    // Delete the command using its ID
    rest.delete(Routes.applicationCommand(clientId, command.id))
      .then(() => console.log('Command deleted!'))
      .catch(console.error);
  } else {
    console.log('Command not found.');
  }
}).catch(console.error);