const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the 8-ball a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Ask a question to the 8-ball')
        .setRequired(true)),

  async execute(interaction) {
    const answers = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes - definitely.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful."
    ];

    const question = interaction.options.getString('question');

    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

    await interaction.reply(`You asked: "${question}"\n🎱 The 8-ball says: ${randomAnswer}`);
  },
};
