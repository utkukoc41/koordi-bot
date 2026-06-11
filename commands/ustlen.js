const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'üstlen',
    async execute(client, message, args) {
        
        if (!message.member.roles.cache.has(client.config.ticket.staffRoleId)) {
            return message.reply({ content: 'Bu komutu kullanmak için yetkiniz yok!' });
        }

        
        if (!message.channel.name.startsWith('ticket-') && !message.channel.name.startsWith('üstlendi-')) {
            return message.reply({ content: 'Bu komut sadece ticket kanallarında kullanılabilir!' });
        }

        
        if (message.channel.name.startsWith('üstlendi-')) {
            return message.reply({ content: 'Bu talep zaten bir yetkili tarafından üstlenilmiş!' });
        }

        try {
            
            await message.channel.setName(`üstlendi-${message.author.username}`);

            const ustlenEmbed = new EmbedBuilder()
                .setTitle('<:770592checkmark:1456261746108006450> Talep Üstlenildi')
                .setDescription(`Bu destek talebi <@${message.author.id}> tarafından üstlenmiştir.\n\nArtık sizinle bu yetkilimiz ilgilenecektir.`)
                .setColor('#2ecc71')
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter({ text: client.config.footerText });

            await message.channel.send({ embeds: [ustlenEmbed] });

        } catch (error) {
            console.error('Üstlenme hatası:', error);
            message.reply({ content: 'Talep üstlenirken bir hata oluştu!' });
        }
    }
};