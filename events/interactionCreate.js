const { 
    EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, 
    TextInputStyle, ChannelType, PermissionsBitField, StringSelectMenuBuilder 
} = require('discord.js');

module.exports = async (client, interaction) => {
    try {
        
        if (interaction.isButton() && interaction.customId === 'basvuru_ac') {
            const modal = new ModalBuilder().setCustomId('yetkili_modal').setTitle('Yetkili Başvuru Formu');

            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('y_ad_yas').setLabel('İsim ve Yaş? (Ses Teyit Alıyoruz)').setPlaceholder('Örn: Alper / 18').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('y_tecrube').setLabel('Yazılım Hakkında Tecrübeniz Nedir?').setPlaceholder('Tecrübelerinizi buraya yazabilirsiniz.').setStyle(TextInputStyle.Paragraph).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('y_neden').setLabel('Neden yetkili olmak istiyorsun?').setPlaceholder('Neden?').setStyle(TextInputStyle.Paragraph).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('y_aktiflik').setLabel('Gün içerisindeki aktiflik süren?').setPlaceholder('Örn: Günde 3-4 saat').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('y_diger').setLabel('Başka hangi sunucularda yetkilisin?').setPlaceholder('Sunucu isimlerini gir').setStyle(TextInputStyle.Short).setRequired(true))
            );
            return await interaction.showModal(modal);
        }

        
        if (interaction.isModalSubmit() && interaction.customId === 'yetkili_modal') {
            const logChannel = interaction.guild.channels.cache.get(client.config.yetkiliLogChannelId);
            if (!logChannel) return interaction.reply({ content: "Başvuru log kanalı bulunamadı!", ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle('<:sabitlendi:1456945039661072498> Yeni Yetkili Başvurusu')
                .setThumbnail(interaction.user.displayAvatarURL())
                .setColor('Blue')
                .addFields(
                    { name: 'Kullanıcı', value: `${interaction.user} (\`${interaction.user.id}\`)` },
                    { name: 'İsim/Yaş', value: interaction.fields.getTextInputValue('y_ad_yas') },
                    { name: 'Tecrübe', value: interaction.fields.getTextInputValue('y_tecrube') },
                    { name: 'Neden', value: interaction.fields.getTextInputValue('y_neden') },
                    { name: 'Aktiflik', value: interaction.fields.getTextInputValue('y_aktiflik') },
                    { name: 'Diğer Sunucular', value: interaction.fields.getTextInputValue('y_diger') }
                )
                .setFooter({ text: client.config.footerText });

            await logChannel.send({ embeds: [embed] });
            return await interaction.reply({ content: '<:770592checkmark:1456261746108006450> Başvurunuz başarıyla yetkililere iletildi.', ephemeral: true });
        }

        
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
            const category = interaction.values[0];
            const modal = new ModalBuilder().setCustomId(`t_modal_${category}`).setTitle('Destek Formu');

            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_konu').setLabel('Konu').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_oncelik').setLabel('Öncelik Durumu').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_aciklama').setLabel('Açıklama').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return await interaction.showModal(modal);
        }

        
        if (interaction.isModalSubmit() && interaction.customId.startsWith('t_modal_')) {
            await interaction.deferReply({ ephemeral: true });
            const category = interaction.customId.split('_')[2];
            const konu = interaction.fields.getTextInputValue('q_konu');
            const oncelik = interaction.fields.getTextInputValue('q_oncelik');
            const aciklama = interaction.fields.getTextInputValue('q_aciklama');

            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: client.config.ticket.categoryId,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles] },
                    { id: client.config.ticket.staffRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                ],
            });

            
            const topEmbed = new EmbedBuilder()
                .setTitle('<:ticket:1456945121567178948> Ticket Başarıyla Oluşturuldu!')
                .setDescription(
                    `Yetkili ekibimiz talebini incelemeye aldı. Lütfen bekleyiniz.\n\n` +
                    `<:member:1456944920097984618> **Oluşturan:** <@${interaction.user.id}>\n` +
                    `<:saat:1456944976012509197> **Tarih:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
                    `<:saat:1456944976012509197> **Durum:** İşlem Sırasında`
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setColor('#2b2d31')
                .setFooter({ text: `Kategori: ${category}` });

            const manageMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder().setCustomId('ticket_manage').setPlaceholder('Yönetim...').addOptions([{ label: 'Talebi Kapat', value: 'close', emoji: '❌' }])
            );

            
            const detailEmbed = new EmbedBuilder()
                .setTitle('📝 Talep Detayları')
                .setColor('#2b2d31')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `Girdiğiniz form verileri aşağıdadır. Lütfen bekleyin.\n\n` +
                    `<:sabitlendi:1456945039661072498> **Konu:** ${konu}\n` +
                    `<:danger:1456944857666027586> **Öncelik:** ${oncelik}\n` +
                    `📝 **Açıklama:** ${aciklama}`
                )
                .setFooter({ text: `Kullanıcı: ${interaction.user.tag}` });

            await channel.send({ content: `<@&${client.config.ticket.staffRoleId}> | <@${interaction.user.id}>`, embeds: [topEmbed], components: [manageMenu] });
            const detailMsg = await channel.send({ embeds: [detailEmbed] });
            await detailMsg.pin().catch(() => {});

            await interaction.editReply(`Ticket kanalın oluşturuldu: ${channel}`);
        }

        
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_manage') {
            if (interaction.values[0] === 'close') {
                if (!interaction.member.roles.cache.has(client.config.ticket.staffRoleId)) return interaction.reply({ content: "Yetkiniz yok!", ephemeral: true });
                await interaction.reply('🔒 Kapatılıyor...');
                setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
            }
        }

        
        if (interaction.isButton() && interaction.customId.startsWith('abone_')) {
            const [act, userId] = interaction.customId.split('_').slice(1);
            if (!interaction.member.roles.cache.has(client.config.abone.staffRoleId)) return interaction.reply({ content: "Yetkiniz yok!", ephemeral: true });

            const member = await interaction.guild.members.fetch(userId).catch(() => null);
            const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0]);

            if (act === 'onay') {
                if (member) await member.roles.add(client.config.abone.aboneRolId);
                updatedEmbed.setColor('#2ecc71').setDescription(updatedEmbed.data.description.replace('`İşlem Bekleniyor...`', `✅ **Onaylandı:** ${interaction.user.tag}`));
                return await interaction.update({ content: `<:770592checkmark:1456261746108006450> Onaylandı.`, embeds: [updatedEmbed], components: [] });
            } 
            if (act === 'red') {
                updatedEmbed.setColor('#e74c3c').setDescription(updatedEmbed.data.description.replace('`İşlem Bekleniyor...`', `❌ **Reddedildi:** ${interaction.user.tag}`));
                return await interaction.update({ content: `<:874346wrong:1456261765196284015> Reddedildi.`, embeds: [updatedEmbed], components: [] });
            }
        }
    } catch (error) { console.error(error); }
};