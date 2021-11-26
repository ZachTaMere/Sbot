const { CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('../../utils/Models/infractionsDB');
const moment = require('moment');

module.exports = {
    name: "ban",
    description: "Bannir un utilisateur du serveur",
    permission: "BAN_MEMBERS",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un utilisateur",
            type: "USER",
            required: true
        },
        {
            name: "raison",
            description: "La raison du bannissement",
            type: "STRING",
            required: true
        },
        {
            name: "message",
            description: "Entre la durée de suppression des messages de la personne bannie (0-7d)",
            type: "NUMBER",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const{ guild, member, options } = interaction;

        const target = options.getMember("membre");
        const reason = options.getString("raison");
        const amount = options.getNumber("message");
        const banDate = moment.utc(interaction.createdAt).format("DD/MM/YYYY");

        const Response = new MessageEmbed()
            .setColor("RED")
            .setAuthor("Moderation System", guild.iconURL({ dynamic: true }))
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))

            // Several checking if the target is the bot
        if (target === guild.members.resolve(client.user)) {
            Response.setDescription("⛔ Tu essaie de ban le bot ?!")
            return interaction.reply({ embeds: [Response] });
        }

            // If the target is the command involver
        if (target.id === member.id) {
            Response.setDescription("⛔ Tu ne peux pas te bannir toi même.")
            return interaction.reply({ embeds: [Response] });
        }

            // if the target has a higher role than the command involver
        if (target.roles.highest.position >= member.roles.highest.position) {
            Response.setDescription("⛔ Tu ne peux pas bannir une personne ayant un rôle supérieur ou égal à toi.")
            return interaction.reply({ embeds: [Response] });
        }

            // if the number of day for deleting the target messages is greater than 7
        if (amount > 7) {
            Response.setDescription("⛔ Le nombre de jour de message à supprimer ne peut pas être supérieur à 7 (0-7d).")
            return interaction.reply({ embeds: [Response] });
        }

        db.findOne({ GuildID: interaction.guild.id, UserID: target.id }, async (err, data) => {
            if (err) throw (err);
            if (!data || !data.BanData) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    BanData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Amount: amount,
                            Reason: reason,
                            Date: banDate
                        }
                    ]
                })
            } else {
                const BanDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Amount: amount,
                    Reason: reason,
                    Date: banDate
                }
                data.BanData.push(BanDataObject);
            }
            data.save();
        })

            // Send a DM to the banned person
        await target.send({embeds:[
            new MessageEmbed()
            .setColor("RED")
            .setAuthor(`Moderation System`, guild.iconURL({ dynamic: true }))
            .setDescription(`Tu as été banni pour la raison suivante : ${reason}`)
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))
        ]}).catch(() => {console.log(`Je ne peux pas envoyer le message de bannissement à ${target.user.tag}`) });

            // Reply in the channel where the command was involved
        Response.setDescription(`${target} a été banni pour : ${reason}`)
        interaction.reply({ embeds: [Response] })

            // Ban the target
        target.ban({ days: amount, reason: reason })
        .catch((error) => { console.log(error) });

            // Send in log channel a log message
        Response.setDescription(`L'utilisateur ${target.user.tag} / ${target.user.id} a été banni pour la raison suivante : ${reason}`)
        Response.addField("Auteur Du bannissement :", interaction.user.username)
        guild.channels.cache.get("909915653547376672").send({embeds: [Response] });
    }
}