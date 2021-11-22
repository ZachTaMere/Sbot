const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('../../utils/Models/infractionsDB');
const ms = require('ms');
const moment = require('moment');

module.exports = {
    name: "mute",
    description: "Mute un utilisateur",
    permission: "MUTE_MEMBERS",
    options: [
        {
            name: "utilisateur",
            description: "Selectionnez l'utilisateur",
            type: "USER",
            required: true
        },
        {
            name: "raison",
            description: "Mettre la raison du mute",
            type: "STRING",
            required: true            
        },
        {
            name: "durée",
            description: "Mettre la durée du mute",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "1 minute",
                    value: "1m"
                },
                {
                    name: "30 minutes",
                    value: "30m"
                },
                {
                    name: "1 heure",
                    value: "1h"
                },
                {
                    name: "3 heures",
                    value: "3h"
                },
                {
                    name: "1 Jour",
                    value: "1d"
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("utilisateur");
        const reason = options.getString("raison");
        const duration = options.getString("durée");
        const mute = guild.roles.cache.get("912297562982211604");
        const muteDate = moment.utc(interaction.createdAt).format("DD/MM/YYYY");

        const response = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("MODERATION SYSTEM", guild.iconURL({ dynamic: true}))

            if (target === guild.members.resolve(client.user)) {
                response.setDescription("⛔ Tu essaie de mute le bot ?!")
                return interaction.reply({ embeds: [response] });
            }
    
            if (target.id === member.id) {
                response.setDescription("⛔ Tu ne peux pas te mute toi même.")
                return interaction.reply({ embeds: [response] });
            }
    
            if (target.roles.highest.position >= member.roles.highest.position) {
                response.setDescription("⛔ Tu ne peux pas mute une personne ayant un rôle supérieur ou égal à toi.")
                return interaction.reply({ embeds: [response] });
            }
            if (target.permissions.has(this.permission)) {
                response.setDescription(`⛔ Tu ne peux pas mute une personne ayant \`${this.permission}\``)
                return interaction.reply({ embeds: [response] });
            }

            if (!mute) {
                response.setDescription(`⛔ Le rôle mute n'a pas été trouver`);
                return interaction.reply({ embeds: [response] });
            }

            db.findOne({ GuilID: guild.id, UserID: target.id }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new db({
                        GuildID: guild.id,
                        UserID: target.id,
                        MuteData: [
                            {
                                ExecuterID: member.id,
                                ExecuterTag: member.user.tag,
                                TargetID: target.id,
                                TargetTag: target.user.tag,
                                Reason: reason,
                                Duration: duration,
                                Date: muteDate
                            }
                        ]
                    })
                } else {
                    const MuteDataObject = {
                        ExecuterID: member.id,
                        ExecuterTag: member.user.tag,
                        TargetID: target.id,
                        TargetTag: target.user.tag,
                        Reason: reason,
                        Duration: duration,
                        Date: muteDate
                    }
                    data.MuteData.push(MuteDataObject);
                }
                data.save();
            });

            target.send({embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setAuthor("MODERATION SYSTEM", guild.iconURL({ dynamic: true}))
                    .setDescription(`Vous avez été mute par ${member} dans **${guild.name}**\n**Raison** : ${reason}\n**Durée** : ${duration}`)
            ]}).catch(() => {
                console.log(`Je n'es pas pu envoyer le message à ${target.user.tag}`);
            });

            response.setDescription(`${target} | \`${target.id}\` a été **mute**\nModérateur : ${member}\nRaison : ${reason}\nDurée : ${duration}`);
            interaction.reply({ embeds: [response] })

            await target.roles.add(mute.id)
            setTimeout(async () => {
                if (!target.roles.cache.has(mute.id)) return;
                await target.roles.remove(mute);
            }, ms(duration));
    }
}