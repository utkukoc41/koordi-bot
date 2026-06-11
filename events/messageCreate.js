const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (client, message) => {
    
    if (message.author.bot || !message.guild) return;

    
    if (message.channel.id === client.config.abone.channelId && message.attachments.size > 0) {
        
        
        const staffRole = message.guild.roles.cache.get(client.config.abone.staffRoleId);
        
        
        const activeStaff = staffRole?.members
            .filter(m => m.presence?.status !== 'offline' && m.presence?.status !== undefined)
            .map(m => `<@${m.id}>`).join(' ');

        
        const aboneEmbed = new EmbedBuilder()
            .setTitle('<:770592checkmark:1456261746108006450> Ekran Görüntüsü Algılandı')
            .setDescription(
                `**Bilgilendirme:**\n` +
                `> Videoyu Beğenmiş olman,\n` +
                `> Kanala Abone olman,\n` +
                `> Ve yorum atmış olman gerekmektedir.\n\n` +
                `Lütfen yetkililerimiz kontrol edene kadar bekleyiniz.\n` +
                `Hatalı kanıtlar doğrudan reddedilecektir.\n\n` +
                `**🔴 Sonuç:** \`İşlem Bekleniyor...\``
            )
            .setImage(client.config.rgbImage) 
            .setColor('#f1c40f') 
            .setFooter({ 
                text: client.config.footerText, 
                iconURL: client.user.displayAvatarURL() 
            });

        
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`abone_onay_${message.author.id}`)
                .setLabel('Abone Rolü Ver')
                .setStyle(ButtonStyle.Success)
                .setEmoji('<:770592checkmark:1456261746108006450>'),

            new ButtonBuilder()
                .setCustomId(`abone_red_${message.author.id}`)
                .setLabel('Talebi Reddet')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('<:874346wrong:1456261765196284015>'),

            new ButtonBuilder()
                .setLabel('Son Videoya Git')
                .setStyle(ButtonStyle.Link)
                .setURL('https://youtube.com/@HzRazy')
        );

        
        await message.reply({ 
            content: `<:evrensel_zil:1456949426596872377> **Aktif Yetkililer:** ${activeStaff || 'Şu an aktif yetkili bulunmuyor.'}`, 
            embeds: [aboneEmbed], 
            components: [buttons] 
        });
    }

    
    const prefix = client.config.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    
    const command = client.commands.get(commandName);

    if (command) {
        try {
            await command.execute(client, message, args);
        } catch (error) {
            console.error(`[KOMUT HATASI] ${commandName}:`, error);
            message.reply('Bu komutu çalıştırırken bir hata oluştu!');
        }
    }
};