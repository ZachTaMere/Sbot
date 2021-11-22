const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('../../utils/Models/infractionsDB');
const moment = require('moment');

module.exports = {
    name: "warnings",
    description: "Mettre un avertissement à un utilisateur",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "add",
            description: "Ajouter un avertissement",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "utilisateur",
                    description: "Selectionner un utilisateur",
                    type: "USER",
                    required: true
                },
                {
                    name: "raison",
                    description: "Raison de l'avertissement",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "check",
            description: "Vérifier le nombre d'avertissement",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "utilisateur",
                    description: "Selectionner un utilisateur",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "delete",
            description: "Supprimer un avertissement",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "utilisateur",
                    description: "Selectionner un utilisateur",
                    type: "USER",
                    required: true
                },
                {
                    name: "warnid",
                    description: "Mettez l'ID de l'avertissement",
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "clear",
            description: "Supprimer tout les avertissements",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "utilisateur",
                    description: "Selectionner un utilisateur",
                    type: "USER",
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const { options, guild } = interaction;
        const sub = options.getSubcommand();
        const target = options.getMember("utilisateur");
        const raison = options.getString("raison");
        const warnID = options.getNumber("warnid") - 1;
        const warnDate = moment.utc(interaction.createdAt).format("DD/MM/YYYY");
        const warnEmbed = new MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTitle("MODERATION SYSTEM")
            .setColor("RED")
            .setFooter(`S'bot - Warn System`, guild.members.resolve(client.user).displayAvatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
            switch (sub) {
                case "add":
                    db.findOne({ GuildID: interaction.guildId, UserID: target.id }, async(err, data) => {
                        if (err) throw err;
                        if (!data) {
                            data = new db({
                                GuildID: interaction.guildId,
                                UserID: target.id,
                                WarnData: [
                                    {
                                        ExecuterID: interaction.user.id,
                                        ExecuterTag: interaction.user.tag,
                                        Reason: raison,
                                        Date: warnDate
                                    }
                                ]
                            })
                        } else {
                            const obj = {
                                ExecuterID: interaction.user.id,
                                ExecuterTag: interaction.user.tag,
                                Reason: raison,
                                Date: warnDate
                            }
                            data.WarnData.push(obj)
                        };
                        data.save();
                    });
                    warnEmbed.setDescription(`**Avertissement ajouter à :** ${target.user.tag} | ${target.id}\n**Raison**: ${raison}`);
                    interaction.reply({ embeds: [warnEmbed] });
                    break;
                case "check":
                    db.findOne({ GuildID: interaction.guildId, UserID: target.id }, async(err, data) => {
                        if (err) throw err;
                        if (data?.WarnData.length > 0 && data) {
                            warnEmbed.setFooter(`Avertissements de : ${target.user.tag}`)
                            warnEmbed.setDescription(`${data.WarnData.map(
                                (w, i) => `\n**ID**: ${i + 1}\n**Par**: ${w.ExecuterTag} | ${w.ExecuterID}\n**Date**: ${w.Date}\n**Raison**: ${w.Reason}
                                \n`
                            ).join(" ")}`);
                            interaction.reply({ embeds: [warnEmbed] });
                        } else {
                            warnEmbed.setDescription(`${target} | ${target.id} n'a pas d'avertissemment.`);
                            interaction.reply({ embeds: [warnEmbed] });
                        };
                    });
                    break;
                case "delete":
                    db.findOne({ GuildID: interaction.guildId, UserID: target.id }, async(err, data) => {
                        if (err) throw err;
                        if (data) {
                            data.WarnData.splice(warnID, 1);
                            warnEmbed.setDescription(`**L'avertissement N°**: ${warnID + 1 } de ${target.user.tag} a été supprimer.`);
                            interaction.reply({ embeds: [warnEmbed] });
                            data.save();
                        } else {
                            warnEmbed.setDescription(`${target} | ${target.id} n'a pas d'avertissemment.`);
                            interaction.reply({ embeds: [warnEmbed] });
                        }
                    });
                    break;
                case "clear":
                    db.findOne({ GuildID: interaction.guildId, UserID: target.id }, async(err, data) => {
                        if (err) throw err;
                        if (data) {
                            await db.findOneAndDelete({ GuildID: interaction.guildId, UserID: target.id });

                            warnEmbed.setDescription(`Les avertissements de ${target.user.tag} ont été purger. | ${target.id}`);
                            interaction.reply({ embeds: [warnEmbed] });
                        } else {
                            warnEmbed.setDescription(`${target} | ${target.id} n'a pas d'avertissemment.`);
                            interaction.reply({ embeds: [warnEmbed] });
                        };
                    }); 
                    break;
            }
        }
}