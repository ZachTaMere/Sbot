const { CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('../../utils/Models/infractionsDB');
const moment = require('moment');

module.exports = {
    name: "kick",
    description: "Expulser un utilisateur du serveur",
    permission: "KICK_MEMBERS",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un utilisateur",
            type: "USER",
            required: true
        },
        {
            name: "raison",
            description: "La raison de l'expulsion",
            type: "STRING",
            required: true
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const{ guild, member, options } = interaction;

        const target = options.getMember("membre");
        const reason = options.getString("raison");
        const kickDate = moment.utc(interaction.createdAt).format("DD/MM/YYYY");

        const Response = new MessageEmbed()
            .setColor("RED")
            .setAuthor("Moderation System", guild.iconURL({ dynamic: true }))
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))

            // Several checking: if the target is the bot
        if (target === guild.members.resolve(client.user)) {
            Response.setDescription("⛔ Tu essaie de kick le bot ?!")
            return interaction.reply({ embeds: [Response] });
        }
            // if the target is the command involver
        if (target.id === member.id) {
            Response.setDescription("⛔ Tu ne peux pas t'expulser toi même.")
            return interaction.reply({ embeds: [Response] });
        }
            // if the target as a higher role position than the command involver
        if (target.roles.highest.position >= member.roles.highest.position) {
            Response.setDescription("⛔ Tu ne peux pas expulser une personne ayant un rôle supérieur ou égal à toi.")
            return interaction.reply({ embeds: [Response] });
        }

        db.findOne({ GuildID: interaction.guild.id, UserID: target.id }, async (err, data) => {
            if (err) throw (err);
            if (!data || !data.KickData) {
                data = new db({
                    GuildID: guild.id,
                    UserID: target.id,
                    KickData: [
                        {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: target.id,
                            TargetTag: target.user.tag,
                            Reason: reason,
                            Date: kickDate
                        }
                    ]
                })
            } else {
                const KickDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: target.id,
                    TargetTag: target.user.tag,
                    Reason: reason,
                    Date: kickDate
                }
                data.KickData.push(KickDataObject);
            }
            data.save();
        })

            // Send a DM to the kicked
        await target.send({embeds:[
            new MessageEmbed()
            .setColor("RED")
            .setAuthor("Moderation System", guild.iconURL({ dynamic: true }))
            .setDescription(`Tu as été expulser pour la raison suivante : ${reason}`)
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))
        ]}).catch(() => {console.log(`Je ne peux pas envoyer le message d'expulsion à ${target.user.tag}`) });

            // Reply in the channel where the command was involved 
        Response.setDescription(`${target} a été expulser pour : ${reason}`)
        interaction.reply({ embeds: [Response] })

            // Kick the target person
        target.kick({ reason: reason })
        .catch((error) => { console.log(error) });

            // Send in log channel a log message
        Response.setDescription(`L'utilisateur ${target.user.tag} / ${target.user.id} a été expulser pour la raison suivante : ${reason}`)
        Response.addField("Auteur De L'expulsion :", interaction.user.username)
        guild.channels.cache.get("909915653547376672").send({embeds: [Response] });
    }
}