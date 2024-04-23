const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord.js');

const colors = [0x707070, 0x000000, 0x96FF00, 0x0037FF, 0x590812, 0xFF0516];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server'),
    async execute(interaction) {
        const guild = interaction.guild;
        const guildCreatedAt = guild.createdAt;
        const totalMembers = guild.memberCount;

        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const verifiedBotCount = guild.members.cache.filter(member => member.user.bot && member.user.verified).size;
        const totalBotCount = botCount + verifiedBotCount;

        let textChannels = 0;
        let voiceChannels = 0;

        // Fetch channels and count text and voice channels
        try {
            const channels = await guild.channels.fetch();
            textChannels = channels.filter(channel => channel.type === ChannelType.GuildText).size;
            voiceChannels = channels.filter(channel => channel.type === ChannelType.GuildVoice).size;
        } catch (error) {
            console.error(error);
        }

        const roles = guild.roles.cache.map(role => role.toString()).join(', ').slice(0, 1024);
        const emojis = guild.emojis.cache.map(emoji => emoji.toString()).join(' ').slice(0, 1024);

        const verificationLevel = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: 'High',
            VERY_HIGH: 'Highest'
        }[guild.verificationLevel];

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const serverInfo = {
            embeds: [{
                title: `Server Information - ${guild.name}`,
                color: randomColor,
                fields: [
                    { name: 'Server ID', value: guild.id, inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Created At', value: guildCreatedAt?.toString() || 'Not Available', inline: true },
                    { name: 'Total Members', value: totalMembers, inline: true },
                    { name: 'Bot Count', value: totalBotCount, inline: true },
                    { name: 'Text Channels', value: textChannels, inline: true },
                    { name: 'Voice Channels', value: voiceChannels, inline: true },
                    { name: 'Roles', value: roles || 'None', inline: true },
                    { name: 'Emojis', value: emojis || 'None', inline: true },
                    { name: 'Verification Level', value: verificationLevel || 'Not Available', inline: true },
                ],
            }],
        };

        await interaction.reply(serverInfo);
    },
};
