const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a virtual dice"),
  async execute(interaction) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(`You rolled a ${randomNumber}!`);
  },
};