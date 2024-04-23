const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock-Paper-Scissors')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Choose your move: rock, paper, or scissors')
        .setRequired(true)),

  async execute(interaction) {
    const choices = ['rock', 'paper', 'scissors'];
    const userChoice = interaction.options.getString('choice').toLowerCase();
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = '';

    if (!choices.includes(userChoice)) {
      return interaction.reply({ content: 'Please choose rock, paper, or scissors.', ephemeral: true });
    }

    if (userChoice === botChoice) {
      result = 'It\'s a tie!';
    } else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = 'You have beaten me!';
    } else {
      result = 'I won uwu';
    }

    return interaction.reply({ content: `You chose: ${userChoice}. I chose: ${botChoice}. ${result}`, ephemeral: true });
  },
};
