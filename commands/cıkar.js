const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'çıkar',
    async execute(client, message, args) {
        
        if (!message.member.roles.cache.has(client.config.ticket.staffRoleId)) {
            return message.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!' });
        }

        
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!targetUser) return message.reply('Lütfen bir kullanıcı etiketle veya ID gir.');

        try {
            
            await message.channel.permissionOverwrites.delete(targetUser.id);

            const embed = new EmbedBuilder()
                .setTitle('<:member:1456944920097984618> Üye Çıkarıldı')
                .setDescription(`${targetUser} kullanıcısının bu talebe erişimi kesildi.`)
                .setColor('Red')
                .setFooter({ text: client.config.footerText });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            message.reply('Kullanıcı çıkarılırken bir hata oluştu.');
        }
    }
};