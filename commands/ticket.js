const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');  

module.exports = {     
    name: 'ticket',     
    description: 'Ticket sistemini kurar.',     

    async execute(client, message, args) {         
        if (!message.member.permissions.has('Administrator')) return;         

        const embed = new EmbedBuilder()
            .setTitle('Nasıl Yardımcı Olabiliriz?')
            .setThumbnail(message.guild.iconURL())
            .setColor('#2b2d31')
            .setDescription(
                `**Destek Sistemi Hakkında:**\n` +
                `• **Eşit Öncelik:** Tüm talepler eşit şekilde değerlendirilir\n` +
                `• **Yanıt Süresi:** Ortalama 2-24 saat içinde dönüş yapılır\n` +
                `• **Açıklama:** Sorununuzu detaylı bir şekilde belirtin\n` +
                `• **Uyarı:** Gereksiz ticket açmaktan kaçının\n\n` +
                `<:19327mspreport:1455596853201469562> **Önemli Uyarılar:**\n` +
                `• Bot hakkında aldığınız hata/soru/yardım için <#123456789> ve <#987654321> kanallarını kullanın.\n` +
                `• Yan sunucudan banlanma sebebiyle ticket açarsanız, buradan da banlanırsınız.\n\n` +
                `© 2025 HzRazy Topluluğu • Powered By Enes • `
            );         

        const selectMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_select')
                .setPlaceholder('Ticket kategorisi seçin...')
                .addOptions([
                    { label: 'Sponsorluk', description: 'Sponsorluk ve işbirliği teklifleri için', value: 'Sponsorluk', emoji: '🌀' },
                    { label: 'Özel Bot Yaptırmak İstiyorum', description: 'Özel bot, site veya API geliştirme hizmetleri', value: 'OzelBot', emoji: '✅' },
                    { label: 'Reklam', description: 'Özel kanal ve video reklamları hakkında fiyat bilgisi', value: 'Reklam', emoji: '💵' },
                    { label: 'Diğer Sorular', description: 'Diğer konulardaki sorularınız için', value: 'Diger', emoji: '<:danger:1456944857666027586>' }
                ])
        );

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Kod Desteğe Göz At').setStyle(ButtonStyle.Link).setURL('https://discord.com/channels/1454813851701739647/1455592219380551922').setEmoji('💻'),
            new ButtonBuilder().setLabel('SSS').setStyle(ButtonStyle.Link).setURL('https://discord.com/channels/1454813851701739647/1455592544132923559').setEmoji('❓')
        );         

        await message.delete().catch(() => {});         

        await message.channel.send({ embeds: [embed], components: [selectMenu, buttons] });     
    } 
};