const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'yetkili',
    async execute(client, message) {
        const embed = new EmbedBuilder()
            .setTitle('Yetkili Başvurusu')
            .setDescription('Sunucumuzda yetkili olmak için aşağıdaki butona tıklayarak başvuru formunu doldurabilirsiniz.\n\n10.08.2025 23:52')
            .setColor('#0099ff');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('basvuru_ac')
                .setLabel('Başvuru Yap')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📝')
        );

        await message.channel.send({ embeds: [embed], components: [row] });
        message.delete().catch(() => {});
    }
};