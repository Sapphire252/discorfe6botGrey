const { SlashCommandBuilder } = require('@discordjs/builders');

const colors = [0x707070, 0x000000, 0x96FF00, 0x0037FF, 0x590812, 0xFF0516]; // Array of colors in decimal format

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const createdAt = user.createdAt;
        const joinedAt = member ? member.joinedAt : null;
        const roles = member ? member.roles.cache.map(role => role.toString()).join(', ') : 'None';
        const nickname = member ? member.displayName : 'None';

        let status = 'Unavailable';
        let clientStatus = 'Unavailable';
        if (user.presence) {
            status = user.presence.status;
            clientStatus = user.presence.clientStatus ? Object.keys(user.presence.clientStatus)[0] : 'Unavailable';
        }

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        let presenceActivities = 'None';
        if (user.presence && user.presence.activities) {
            presenceActivities = user.presence.activities.map(activity => activity.name).join(', ') || 'None';
        }

        // Additional information
        const discriminator = user.discriminator;
        const avatarURL = user.displayAvatarURL({ dynamic: true });
        const userFlags = user.flags ? user.flags.toArray().join(', ') : 'None';
        const userMention = user.toString();
        const botCreatedAt = user.bot ? user.createdAt : 'N/A';
        const isSystem = user.system ? 'Yes' : 'No';
        const isVerified = user.verified ? 'Yes' : 'No';
        const userLocale = user.locale || 'Not specified';
        const userCreationTimestamp = user.createdTimestamp;
        const userBannerURL = user.bannerURL({ size: 4096 }) || 'N/A';

        const userEmbed = {
            embeds: [{
                title: `User Information - ${user.tag}`,
                thumbnail: { url: avatarURL },
                color: randomColor,
                fields: [
                    { name: 'Tag', value: user.tag, inline: true },
                    { name: 'ID', value: user.id, inline: true },
                    { name: 'Discriminator', value: discriminator, inline: true },
                    { name: 'Joined Server At', value: joinedAt?.toString() || 'Not Available', inline: true },
                    { name: 'Account Created At', value: createdAt?.toString() || 'Not Available', inline: true },
                    { name: 'Nickname', value: nickname || 'None', inline: true },
                    { name: 'Roles', value: roles || 'None', inline: true },
                    { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
                    { name: 'Status', value: status, inline: true },
                    { name: 'Client Presence', value: clientStatus, inline: true },
                    { name: 'Presence Activities', value: presenceActivities, inline: true },
                    { name: 'Avatar URL', value: `[Link](${avatarURL})`, inline: true },
                    { name: 'User Flags', value: userFlags, inline: true },
                    { name: 'Mention', value: userMention, inline: true },
                    { name: 'Bot Created At', value: botCreatedAt.toString(), inline: true },
                    { name: 'System User', value: isSystem, inline: true },
                    { name: 'Verified', value: isVerified, inline: true },
                    { name: 'Locale', value: userLocale, inline: true },
                    { name: 'Creation Timestamp', value: userCreationTimestamp.toString(), inline: true },
                    { name: 'Banner URL', value: userBannerURL, inline: true },
                ],
            }],
        };

        await interaction.reply(userEmbed);
    },
};
