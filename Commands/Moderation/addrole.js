const { CommandInteraction, MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: "addrole",
    description: "Donner un rôle à un utilisateur.",
    permission: "MANAGE_ROLES",
    options: [
        {
            name: "membre",
            description: "Sélectionnez un utilisateur",
            type: "USER",
            required: true
        },
        {
            name: "role",
            description: "Sélectionnez un rôle à donner",
            type: "ROLE",
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
        const Role = options.getRole("role");

        const response = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(target.displayAvatarURL({dynamic: true, siza: 512}))
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, size:512 }))

            // check if the ${target} is the bot
        if (target === guild.members.resolve(client.user)) {
            response.setDescription("Tu ne peux pas m'ajouter de rôle !")
            return interaction.reply({ embeds: [response] });  
        }

            // check if the member has a higher role than the ${Role}
        if (Role.position >= member.roles.highest.position) {
            response.setDescription("Tu ne peux ajouter des rôles plus haut que toi.")
            return interaction.reply({ embeds: [response] });
        }

            // check if the bot has a higher role than the ${Role}
        if (Role.position >= guild.members.resolve(client.user).roles.highest.position) {
            response.setDescription("Je ne peux pas ajouter des rôles plus haut que moi.")
            return interaction.reply({ embeds: [response] });
        }

            // send a message in the channel where the command was involved 
        response.setDescription(`Tu as bien ajouter le rôle ${Role} à ${target}`);
        interaction.reply({ embeds: [response] })

            // add the role to the ${target} and catch the error if there's one
        target.roles.add(Role)
        .catch((error) => { console.log(error) });

            // send a message in the log channel
        response.setDescription(`L'utilisateur ${interaction.user} à ajouter le rôle ${Role} à ${target}`)
        guild.channels.cache.get("909915653547376672").send({embeds: [response] }); 
    }
}