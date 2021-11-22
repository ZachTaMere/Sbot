const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "Informations",
    type: "USER",
    /**
     * @param {ContextMenuInteraction} interaction
     */
    async execute(client, interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const response = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor(target.user.tag, target.displayAvatarURL({ dynamic: true, size: 512}))
        .setThumbnail(target.displayAvatarURL({dynamic: true, size: 512}))

        .addField("ID", target.id, true)
        .addField("Pseudo", `${target.nickname != null ? `${target.nickname}` : "Aucun"}`, true)

        .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "Aucun"}`)

        .addField("Membre depuis", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
        
        interaction.reply({embeds: [response], ephemeral: true });
    }
}