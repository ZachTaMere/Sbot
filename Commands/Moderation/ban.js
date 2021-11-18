const { CommandInteraction, MessageEmbed } = require('discord.js');

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

        const Target = options.getMember("membre");
        const Reason = options.getString("raison");
        const Amount = options.getNumber("message");

        const Response = new MessageEmbed()
            .setColor("RED")
            .setAuthor(`${guild.name} - MODERATION SYSTEM`, guild.iconURL({ dynamic: true }))
            .setThumbnail(Target.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))
            .setTimestamp()

            // Several checking if the target is the bot
        if (Target === guild.members.resolve(client.user)) {
            Response.setDescription("⛔ Tu essaie de ban le bot ?!")
            return interaction.reply({ embeds: [Response] });
        }

            // If the target is the command involver
        if (Target.id === member.id) {
            Response.setDescription("⛔ Tu ne peux pas te bannir toi même.")
            return interaction.reply({ embeds: [Response] });
        }

            // if the target has a higher role than the command involver
        if (Target.roles.highest.position >= member.roles.highest.position) {
            Response.setDescription("⛔ Tu ne peux pas bannir une personne ayant un rôle supérieur ou égal à toi.")
            return interaction.reply({ embeds: [Response] });
        }

            // if the number of day for deleting the target messages is greater than 7
        if (Amount > 7) {
            Response.setDescription("⛔ Le nombre de jour de message à supprimer ne peut pas être supérieur à 7 (0-7d).")
            return interaction.reply({ embeds: [Response] });
        }

            // Send a DM to the banned person
        await Target.send({embeds:[
            new MessageEmbed()
            .setColor("RED")
            .setAuthor(`${guild.name} - MODERATION SYSTEM`, guild.iconURL({ dynamic: true }))
            .setDescription(`Tu as été banni pour la raison suivante : ${Reason}`)
            .setThumbnail(Target.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))
            .setTimestamp()
        ]}).catch(() => {console.log(`Je ne peux pas envoyer le message de bannissement à ${Target.user.tag}`) });

            // Reply in the channel where the command was involved
        Response.setDescription(`${Target} a été banni pour : ${Reason}`)
        interaction.reply({ embeds: [Response] })

            // Ban the target
        Target.ban({ days: Amount, reason: Reason })
        .catch((error) => { console.log(error) });

            // Send in log channel a log message
        Response.setFooter("LOGS SYSTEM", interaction.user.displayAvatarURL({ dynamic: true }))
        Response.setDescription(`L'utilisateur ${Target.user.tag} / ${Target.user.id} a été banni pour la raison suivante : ${Reason}`)
        Response.addField("Auteur Du bannissement :", interaction.user.username)
        guild.channels.cache.get("909915653547376672").send({embeds: [Response] });
    }
}