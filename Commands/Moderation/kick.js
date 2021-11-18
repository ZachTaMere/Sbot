const { CommandInteraction, MessageEmbed } = require('discord.js');

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

        const Target = options.getMember("membre");
        const Reason = options.getString("raison");
        const Amount = options.getNumber("message");

        const Response = new MessageEmbed()
            .setColor("RED")
            .setAuthor("KICK SYSTEM", guild.iconURL({ dynamic: true }))
        if (Target.id === member.id) {
            Response.setDescription("⛔ Tu ne peux pas t'expulser toi même.")
            return interaction.reply({ embeds: [Response] });
        }

        if (Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ Tu ne peux pas expulser une personne ayant un rôle supérieur à toi.")
            return interaction.reply({ embeds: [Response] });
        }

        await Target.send({embeds:[
            new MessageEmbed()
            .setColor("RED")
            .setAuthor("KICK SYSTEM", guild.iconURL({ dynamic: true }))
            .setDescription(`Tu as été expulser pour la raison suivante : ${Reason}`)
        ]}).catch(() => {console.log(`Je ne peux pas envoyer le message d'expulsion à ${Target.user.tag}`) });

        Response.setDescription(`${Target} a été expulser pour : ${Reason}`)
        interaction.reply({ embeds: [Response] })

        Target.kick({ reason: Reason })
        .catch((error) => { console.log(error) });

        Response.setDescription(`L'utilisateur ${Target.user.tag} / ${Target.user.id} a été expulser pour la raison suivante : ${Reason}`)
        guild.channels.cache.get("909915653547376672").send({embeds: [Response] });

    }
}