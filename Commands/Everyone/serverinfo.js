const { CommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    description: "Affiche les informations du serveur",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        //Variables
        const guild = interaction.guild;
        await guild.members.fetch();
        const guildOwner = await guild.fetchOwner();
        const presenceCache = guild.presences.cache;

        // Presence calculation
        const totalMembers = guild.memberCount;
        const online = presenceCache.filter((presence) => presence.status === "online").size;
        const idle = presenceCache.filter((presence) => presence.status === "idle").size;
        const dnd = presenceCache.filter((presence) => presence.status === "dnd").size;
        const offline = totalMembers - (online + idle + dnd);
        let presenceString = `🟢 En ligne : ${online}\n🌙 Absents : ${idle}\n⛔ Occupés : ${dnd}\n⚪ Hors ligne ${offline}`;

        // Verification levels for "guild.verficationLevel" field
        const verifLevels = {
            "NONE": "Aucun",
            "LOW": "Faible",
            "MEDIUM": "Moyen",
            "HIGH": "Élevé",
            "VERY_HIGH": "Maximum"
        };

        const premiumTier = {
            "NONE": "0",
            "TIER_1": "1",
            "TIER_2": "2",
            "TIER_3": "3"
        };

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField("📄 Nom", guild.name)
            .addField("👑 Propriétaire", `${guildOwner}`)
            .addField("🚀 Boosts", `**Niveau** : ${premiumTier[guild.premiumTier]} | ${guild.premiumSubscriptionCount} boosts`, true)
            .addField("🤖 Niveau de vérification", verifLevels[guild.verificationLevel], true)
            .addField("⏲️ Date de création", `<t:${parseInt(guild.createdTimestamp / 1000)}:R>`, true)
            .addField("🐱‍👤 Status des membres", `${presenceString}`, true)
            .addField("📜", `**Rôles** : ${guild.roles.cache.filter((role) => role.name != "@everyone").size.toString()}`, true)
            .setFooter(`${client.user.username}`, client.user.avatarURL({ dynamic: true }))
            .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}