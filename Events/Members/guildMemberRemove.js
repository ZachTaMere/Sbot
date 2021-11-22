const { MessageEmbed, GuildMember } = require('discord.js');

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member
     */
    execute(client, member) {

        const GoodbyeEmbed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("👀 Un membre est parti.")
            .setDescription(`Au revoir ${member} 😭\nRentrons, il commence à pleuvoir...`)
            .setFooter(`${member.user.tag}`, member.guild.iconURL({ dynamic: true }))
            .setTimestamp()

        member.guild.channels.cache.get("909915653547376672").send({ embeds: [GoodbyeEmbed]});
    }
}
