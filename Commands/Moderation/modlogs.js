const { CommandInteraction, MessageEmbed} = require('discord.js');
const db = require('../../utils/Models/infractionsDB');
const { execute } = require('./mute');

module.exports = {
    name: "modlogs",
    description: "Avoir l'historique d'infraction d'un utilisateur",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "utilisateur",
            description: "Selectionnez un membre",
            type: "USER",
            required: true
        },
        {
            name: "check",
            description: "Selectionnez un type d'infraction à vérifier",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Tout",
                    value: "all"
                },
                {
                    name: "Avertissements",
                    value: "warnings"
                },
                {
                    name: "Bannissements",
                    value: "bans"
                },
                {
                    name: "Expulsions",
                    value: "kicks"
                },
                {
                    name: "Mutes",
                    value: "mutes"
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(client, interaction) {
        const { guild, member, options } = interaction;

        const target = options.getMember("utilisateur");
        const choice = options.getString("check");

        const response = new MessageEmbed()
            .setColor("PURPLE")
            .setAuthor("ModLogs", guild.iconURL({ dynamic: true}))
        switch (choice) {
            case "all":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async (err, data) =>{
                    if (err) throw err;
                    if (data) {
                        const warns = data.WarnData.length;
                        const bans = data.BanData.length;
                        const kicks = data.KickData.length;
                        const mutes = data.MuteData.length;

                        response.setDescription(`Membre : ${target} | \`${target.id}\`\n
                        **Avertissement(s)** : ${warns}\n**Bannissement(s)** : ${bans}\n**Expulsion(s)** : ${kicks}\n**Mute(s)** : ${mutes}`)
                        interaction.reply({embeds: [response]});
                    } else {
                        response.setDescription(`${target} n'a aucune infraction`);
                        interaction.reply({embeds: [response]});
                    }
                })
                break;
            case "warnings":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async (err, data) =>{
                    if (err) throw err;
                    if (data) {
                        if (data.WarnData.length < 1) {
                            response.setDescription(`${target} n'a aucun avertissement`)
                            return interaction.reply({embeds: [response]});
                        }
                        response.setDescription(`Membre : ${target} | \`${target.id}\`\n**Avertissement(s)**\n
                        ` + `${data.WarnData.map((w, i) => `**ID** : ${i + 1}\n**Date** : ${w.Date}\n**Modérateur** : ${w.ExecuterTag} | \`${w.ExecuterID}\`\n**Raison** : ${w.Reason}
                        \n`).join(" ").slice(0,4000)}`);
                        return interaction.reply({embeds: [response]});
                    } else {
                        response.setDescription(`${target} n'a aucun avertissement`);
                        interaction.reply({embdes: [response]});
                    }
                })
                break;
            case "bans":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async (err, data) =>{
                    if (err) throw err;
                    if (data) {
                        if (data.BanData.length < 1) {
                            response.setDescription(`${target} n'a aucun banissement`)
                            return interaction.reply({embeds: [response]});
                        }
                        response.setDescription(`Membre : ${target} | \`${target.id}\`\n**Bannissement(s)**\n
                        ` + `${data.BanData.map((w, i) => `**ID** : ${i + 1}\n**Date** : ${w.Date}\n**Modérateur** : ${w.ExecuterTag} | \`${w.ExecuterID}\`\n**Raison** : ${w.Reason}
                        \n`).join(" ").slice(0,4000)}`);
                        return interaction.reply({embeds: [response]});
                    } else {
                        response.setDescription(`${target} n'a aucun banissement`);
                        interaction.reply({embdes: [response]});
                    }
                })
                break;
            case "kicks":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async (err, data) =>{
                    if (err) throw err;
                    if (data) {
                        if (data.KickData.length < 1) {
                            response.setDescription(`${target} n'a aucune expulsion`)
                            return interaction.reply({embeds: [response]});
                        }
                        response.setDescription(`Membre : ${target} | \`${target.id}\`\n**Expulsion(s)**\n
                        ` + `${data.KickData.map((w, i) => `**ID** : ${i + 1}\n**Date** : ${w.Date}\n**Modérateur** : ${w.ExecuterTag} | \`${w.ExecuterID}\`\n**Raison** : ${w.Reason}
                        \n`).join(" ").slice(0,4000)}`);
                        return interaction.reply({embeds: [response]});
                    } else {
                        response.setDescription(`${target} n'a aucune expulsion`);
                        interaction.reply({embdes: [response]});
                    }
                })
                break;
            case "mutes":
                db.findOne({ GuildID: guild.id, UserID: target.id }, async (err, data) =>{
                    if (err) throw err;
                    if (data) {
                        if (data.MuteData.length < 1) {
                            response.setDescription(`${target} n'a aucun mute`)
                            return interaction.reply({embeds: [response]});
                        }
                        response.setDescription(`Membre : ${target} | \`${target.id}\`\n**Mute(s)**\n
                        ` + `${data.MuteData.map((w, i) => `**ID** : ${i + 1}\n**Date** : ${w.Date}\n**Modérateur** : ${w.ExecuterTag} | \`${w.ExecuterID}\`\n**Raison** : ${w.Reason}\n**Durée** : ${w.Duration}
                        \n`).join(" ").slice(0,4000)}`);
                        return interaction.reply({embeds: [response]});
                    } else {
                        response.setDescription(`${target} n'a aucun mute`);
                        interaction.reply({embdes: [response]});
                    }
                })
                break;
        }
    }
}