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
            .setAuthor("BAN SYSTEM", guild.iconURL({ dynamic: true }))
        if (Target.id === member.id) {
            Response.setDescription("⛔ Tu ne peux pas te bannir toi même.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ Tu ne peux pas bannir une personne ayant un rôle supérieur à toi.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Amount > 7) {
            Response.setDescription("⛔ Le nombre de jour de message à supprimer ne peut pas être supérieur à 7 (0-7d).")
            return interaction.reply({ embeds: [Response] });
        }

        await Target.send({embeds:[
            new MessageEmbed()
            .setColor("RED")
            .setAuthor("BAN SYSTEM", guild.iconURL({ dynamic: true }))
            .setDescription(`Tu as été banni pour la raison suivante : ${Reason}`)
        ]}).catch(() => {console.log(`Je ne peux pas envoyer le message de bannissement à ${Target.user.tag}`) });

        Response.setDescription(`${Target} a été banni pour : ${Reason}`)
        interaction.reply({ embeds: [Response] })

        Target.ban({ days: Amount, reason: Reason })
        .catch((error) => { console.log(error) });

        Response.setDescription(`L'utilisateur ${Target.user.tag} / ${Target.user.id} a été banni pour la raison suivante : ${Reason}`)
        guild.channels.cache.get("909915653547376672").send({embeds: [Response] });

    }
}