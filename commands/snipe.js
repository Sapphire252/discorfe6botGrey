const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Aims and snipes the tagged user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to be sniped')
        .setRequired(true)),

  async execute(interaction) {
    // Check if the command is being used by you (the owner)
    const ownerId = process.env.YOUR_USER_ID; // Replace with your user ID
    if (interaction.user.id !== ownerId) {
      return;
    }

    try {
      const guild = interaction.guild; // Fetch the guild where the command was used

      // Verify if the guild exists
      if (!guild) {
        return;
      }

      const target = interaction.options.getUser('target');
      if (!target) {
        return interaction.reply('No target provided for snipe.');
      }

      await interaction.reply(`*Aiming at ${target.username}...*`);

      // Countdown
      await new Promise(resolve => setTimeout(resolve, 1000));
      await interaction.followUp('*1...*');

      await new Promise(resolve => setTimeout(resolve, 1000));
      await interaction.followUp('*2...*');

      await new Promise(resolve => setTimeout(resolve, 1000));
      await interaction.followUp('*3....*');

      // Russian accent "shoots"
      await interaction.followUp('*Bang!*');

      // Kick the tagged user
      const member = guild.members.cache.get(target.id);
      if (member && member.kickable) {
        await member.kick();
        await interaction.followUp(`Target ${target.username} has been successfully killed.`);
      } else {
        await interaction.followUp(`Target ${target.username} dodged the shot. The snipe failed.`);
      }
    } catch (error) {
      console.error(`Unexpected error: ${error}`);
    }
  },
};
