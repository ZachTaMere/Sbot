const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: "clear",
    description: "Effacer un certains nombre de message",
    permission: "MANAGE_MESSAGES",
    options: [
        {
            name: "nombre",
            description: "Indique le nombre de message que tu souhaite supprimer (0-100)",
            type: "NUMBER",
            required: true
        },
        {
            name: "utilisateur",
            description: "Selectionne l'utilisateur dont tu veux supprimer les messages",
            type: "USER",
            required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const { options, channel } = interaction;
        const amount = options.getNumber("nombre");
        const target = options.getUser("utilisateur");
        const messages = channel.messages.fetch();
        
        const response = new MessageEmbed()
        .setColor("GREEN")

        if (amount > 100) {
            response.setDescription("⛔ Tu dois donner un nombre compris entre 0 et 100.")
            interaction.reply({ embeds: [response] });
        }

        if (target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((m) => {
                if (m.author.id === target.id && amount > 0) {
                    filtered.push(m);
                    i++;
                }
            });

            await channel.bulkDelete(filtered, true).then(messages => {
                response.setDescription(`🧹 ${messages.size} messages de ${target} ont été supprimés`);
                interaction.reply({ embeds: [response] });
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                response.setDescription(`🧹 ${messages.size} messages ont été supprimés`);
                interaction.reply({ embeds: [response] });
            })
        }
    }
}