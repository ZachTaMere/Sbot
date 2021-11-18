const { CommandInteraction, MessageEmbed, User, ClientUser } = require("discord.js");
const { execute } = require("../../Events/ready");

module.exports = {
    name: "addrole",
    description: "Donner un rôle à un utilisateur.",
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
            .setAuthor("REGARDER PQ MARCHE PAS", target.displayAvatarURL({ dynamic: true, siza: 512}))
            .setThumbnail(target.displayAvatarURL({dynamic: true, siza: 512}))

        if (Role.position > member.roles.highest.position) {
            response.setDescription("Tu ne peux ajouter des rôles plus haut que toi.")
            return interaction.reply({ embeds: [response] });
        }

        if (Role.position > user.roles.highest.position) { // Regarder pourquoi marche pas 
            response.setDescription("Je ne peux pas ajouter de rôle au dessus de moi.")
            return interaction.reply({ embeds: [Response] });
        }
        response.setDescription(`Tu as bien ajouter le rôle ${Role} à ${target}`);
        interaction.reply({ embeds: [response] })

        
        target.roles.add(Role)
        .catch((error) => { console.log(error) });

        response.setDescription(`L'utilisateur ${interaction.user} à ajouter le rôle ${Role} à ${target}`)
        guild.channels.cache.get("909915653547376672").send({embeds: [response] });
       

    }
}