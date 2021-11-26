const { Client, CommandInteraction, MessageActionRow, MessageSelectMenu} = require('discord.js');
const { execute } = require('./avatar');

module.exports = {
    name: "roles",
    description: "Choisissez vos centre d'intérêts",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
    */
    async execute(client, interaction ) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("role")
                    .setPlaceholder("Choisissez vos centres d'intérêts")
                    .addOptions([
                        {
                            label: "Gaming",
                            value: "913871064898105424",
                            description: "Vous aimez le milieu des Jeux Vidéo",
                            emoji: "🎮"
                        },
                        {
                            label: "Développement",
                            value: "913871102835568670",
                            description: "Vous aimez le milieu du Développement",
                            emoji: "💻"
                        },
                        {
                            label: "Sport",
                            value: "913871082593873971",
                            description: "Vous aimez faire du sport",
                            emoji: "⚽"
                        },
                        {
                            label: "Dessin",
                            value: "913870997793427526",
                            description: "Vous aimez le domaien du dessin",
                            emoji: "✏️"
                        },
                        {
                            label: "Animés",
                            value: "913871046753521734",
                            description: "Vous aimez regarder des Animés",
                            emoji: "⛩️"
                        }
                    ])
            )
        await interaction.reply({ content: "Prenez le rôle qui vous plaira", components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ componentType: "SELECT_MENU" });

        collector.on("collect", async options => {
            const value = options.values[0];

            options.deferUpdate();
            if (options.user.id === interaction.user.id) {

                if (interaction.member.roles.cache.has(value)) {
                    await interaction.member.roles.remove(value)
                } else {
                    await interaction.member.roles.add(value)
                }
            } else return;
        })
    }

}