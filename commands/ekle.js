const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ekle',
    async execute(client, message, args) {
        
        if (!message.member.roles.cache.has(client.config.ticket.staffRoleId)) {
            return message.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!' });
        }

        
        if (!message.channel.name.startsWith('ticket-') && !message.channel.name.startsWith('üstlendi-')) {
            return message.reply({ content: 'Bu komut sadece ticket kanallarında kullanılabilir!' });
        }

        
        const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!targetUser) {
            return message.reply({ content: 'Lütfen kanala eklemek istediğiniz kullanıcıyı etiketleyin veya ID girin!\nÖrn: `!ekle @kullanıcı` veya `!ekle 1234567890`' });
        }

        try {
            
            await message.channel.permissionOverwrites.edit(targetUser.id, {
                ViewChannel: true,
                SendMessages: true,
                AttachFiles: true,
                ReadMessageHistory: true
            });

            const ekleEmbed = new EmbedBuilder()
                .setTitle('<:member:1456944920097984618> Üye Eklendi')
                .setDescription(`${targetUser} kullanıcısı başarıyla bu talebe eklendi.`)
                .setColor('#2ecc71')
                .setFooter({ text: client.config.footerText });

            await message.channel.send({ embeds: [ekleEmbed] });

        } catch (error) {
            console.error('Üye ekleme hatası:', error);
            message.reply({ content: 'Kullanıcı eklenirken bir hata oluştu!' });
        }
    }
};