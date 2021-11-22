const { Client, Permissions, Collection } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const Ascii = require('ascii-table');
const PG = promisify(glob);


/**
 * @param { Client } client
 */

module.exports = async (client) => {
    const table = new Ascii("Commands loaded")

    CommandsArray =[];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(file => {
        const command = require(file);

        if (!command.name) return table.addRow(file.split("/")[7], "🔴 FAILED", "Missing a name");
        if (command.type !== "USER" && !command.description) return table.addRow(command.name, "🔴 FAILED", "Missing a description")

        if(command.permission) {
            if(Object.keys(Permissions.FLAGS).includes(command.permission))
            command.defaultPermission = false;
            else
            return table.addRown(command.name, "🔴 FAILED", "Permission is invalid");
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        table.addRow(command.name, "✔️ SUCCESSFUL");
    });

    console.log(table.toString());

    // PERMISSIONS CHECK //
    client.on("ready", async() => {
        const mainGuild = await client.guilds.cache.get("667988224181796866");

        mainGuild.commands.set(CommandsArray).then(async (command) => {
            const roles = (commandName) => {
                const cmdPerms = CommandsArray.find((c) => c.name === commandName).permission;
                if (!cmdPerms) return new Collection();

                return mainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);
            };

            const perms = command.map((r) => roles(r.name).size === 0 ? false : { id: r.id, permissions: roles(r.name).map(({ id }) => ({id: id, type: "ROLE", permission: true })) }).filter(e => Boolean(e));

            await mainGuild.commands.permissions.set({ fullPermissions: perms });
        })
    });
};