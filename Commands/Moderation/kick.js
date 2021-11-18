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
            .setAuthor(`${guild.name} - MODERATION SYSTEM`, guild.iconURL({ dynamic: true }))
            .setThumbnail(Target.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))
            .setTimestamp()

            // Several checking: if the target is the bot
        if (Target === guild.members.resolve(client.user)) {
            Response.setDescription("⛔ Tu essaie de kick le bot ?!")
            return interaction.reply({ embeds: [Response] });
        }
            // if the target is the command involver
        if (Target.id === member.id) {
            Response.setDescription("⛔ Tu ne peux pas t'expulser toi même.")
            return interaction.reply({ embeds: [Response] });
        }
            // if the target as a higher role position than the command involver
        if (Target.roles.highest.position >= member.roles.highest.position) {
            Response.setDescription("⛔ Tu ne peux pas expulser une personne ayant un rôle supérieur ou égal à toi.")
            return interaction.reply({ embeds: [Response] });
        }

            // Send a DM to the kicked
        await Target.send({embeds:[
            new MessageEmbed()
            .setColor("RED")
            .setAuthor(`${guild.name} - MODERATION SYSTEM`, guild.iconURL({ dynamic: true }))
            .setDescription(`Tu as été expulser pour la raison suivante : ${Reason}`)
            .setThumbnail(Target.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter("Auteur : " + interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size:512 }))
            .setTimestamp()
        ]}).catch(() => {console.log(`Je ne peux pas envoyer le message d'expulsion à ${Target.user.tag}`) });

            // Reply in the channel where the command was involved 
        Response.setDescription(`${Target} a été expulser pour : ${Reason}`)
        interaction.reply({ embeds: [Response] })

            // Kick the target person
        Target.kick({ reason: Reason })
        .catch((error) => { console.log(error) });

            // Send in log channel a log message
        Response.setFooter("LOGS SYSTEM", interaction.user.displayAvatarURL({ dynamic: true }))
        Response.setDescription(`L'utilisateur ${Target.user.tag} / ${Target.user.id} a été expulser pour la raison suivante : ${Reason}`)
        Response.addField("Auteur De L'expulsion :", interaction.user.username)
        guild.channels.cache.get("909915653547376672").send({embeds: [Response] });
    }
}