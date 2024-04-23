const { SlashCommandBuilder } = require('@discordjs/builders');
const { Guild, MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kicked')
        .setDescription('Check which servers a user got kicked from')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const bannedGuilds = [];

        interaction.client.guilds.cache.forEach((guild) => {
            const guildBans = guild.bans.cache;
            if (guildBans.some((ban) => ban.user.id === user.id)) {
                bannedGuilds.push(guild);
            }
        });

        if (bannedGuilds.length > 0) {
            const embed = new MessageEmbed()
                .setTitle(`Kicked Servers for ${user.tag}`)
                .setColor('RED')
                .setDescription(`The user has been kicked from the following servers: ${bannedGuilds.join(', ')}`);
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new MessageEmbed()
                .setTitle(`Kicked Servers for ${user.tag}`)
                .setColor('GREEN')
                .setDescription('The user has not been kicked from any server.');
            await interaction.reply({ embeds: [embed] });
        }
    },
};