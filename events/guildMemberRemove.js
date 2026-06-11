const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = async (client, member) => {
    const channel = member.guild.channels.cache.get(client.config.log.welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: `Aramızdan birisi ayrıldı: ${member.user.username}`, iconURL: member.user.displayAvatarURL() })
        .setDescription(`Hoşça kal ${member}, seni görmek güzeldi! Onun ayrılmasıyla beraber **${member.guild.memberCount}** kişi kaldık.`)
        .addFields(
            { name: '🔸 Kayıt Tarihi', value: `\`${moment(member.user.createdAt).fromNow()}\``, inline: true },
            { name: '🔸 Giriş Tarihi', value: `\`${moment(member.joinedAt).fromNow()}\``, inline: true },
            { name: '🔸 Çıkış Tarihi', value: `\`Şimdi\``, inline: true }
        )
        .setThumbnail('https://i.imgur.com/8N9f8S3.png') 
        .setColor('#e74c3c') 
        .setFooter({ text: '2025 HzRazy Topluluğu Powered By Enes', iconURL: client.user.displayAvatarURL() });

    await channel.send({ embeds: [embed] });
};