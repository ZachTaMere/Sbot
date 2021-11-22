const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     */
    execute(client, member) {
        const memberRole = member.guild.roles.cache.get("746130525432971346");
        member.roles.add(memberRole);

        const WelcomeEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("Nouveau Membre 🎉")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`🚀 Bienvenue à toi ${member} dans le serveur ${member.guild.name}\n👤 Nombre de membres : **${member.guild.memberCount}**`)
            .setFooter(`${member.user.tag}`, member.guild.iconURL({ dynamic: true }))
            .setTimestamp()

        member.guild.channels.cache.get("912341235438596127").send({ embeds: [WelcomeEmbed]});
    }
}
