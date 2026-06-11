const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'devret',
    async execute(client, message, args) {
        
        if (!message.member.roles.cache.has(client.config.ticket.staffRoleId)) {
            return message.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!' });
        }

        
        const targetUser = message.mentions.members.first();
        if (!targetUser) {
            return message.reply({ content: 'Lütfen talebi devretmek istediğiniz yetkiliyi etiketleyin! Örn: `!devret @isim`' });
        }

        
        if (!message.channel.name.startsWith('ticket-') && !message.channel.name.startsWith('üstlendi-')) {
            return message.reply({ content: 'Bu komut sadece ticket kanallarında kullanılabilir!' });
        }

        try {
            
            await message.channel.permissionOverwrites.edit(targetUser.id, {
                ViewChannel: true,
                SendMessages: true,
                AttachFiles: true,
                ReadMessageHistory: true
            });

            
            await message.channel.permissionOverwrites.edit(message.author.id, {
                SendMessages: false
            });

            const devretEmbed = new EmbedBuilder()
                .setTitle('🔄 Talep Devredildi')
                .setDescription(`Bu ticket talebi <@${message.author.id}> tarafından ${targetUser} yetkilisine devredilmiştir.`)
                .setColor('#3498db')
                .setFooter({ text: client.config.footerText });

            await message.channel.send({ embeds: [devretEmbed] });
            
            // Kanal ismini güncelle (isteğe bağlı)
            await message.channel.setName(`devredildi-${targetUser.user.username}`);

        } catch (error) {
            console.error('Devretme hatası:', error);
            message.reply({ content: 'Talep devredilirken bir hata oluştu!' });
        }
    }
};