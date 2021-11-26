const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "Avatar",
    type: "USER",
    /**
     * @param {ContextMenuInteraction} interaction
     */
    async execute(client, interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const response = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`Voici l'avatar de ${target.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setImage(target.displayAvatarURL({ dynamic: true, size: 512}))

        interaction.reply({embeds: [response]});
    }
}