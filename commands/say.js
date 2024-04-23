const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Repeats the message entered.')
    .addStringOption(option => 
      option.setName('message')
      .setDescription('The message to repeat')
      .setRequired(true)),
  async execute(interaction) {
    // Retrieve the message from the command input
    const message = interaction.options.getString('message');

    // Reply with the same message
    await interaction.reply({ content: message });
  }
}
