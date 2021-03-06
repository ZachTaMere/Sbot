const { DBURL } = process.env;
const { Client } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        mongoose.connect(DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true

        }).then(() => {
            console.log("Connected to the database ✅");
        }).catch((err) => console.log(err))

        const rdy = client.channels.cache.get("909915653547376672");

        client.user.setActivity("Yo !", { type: "PLAYING"});
        client.user.setStatus("online");
        rdy.send("✅ Bot connecté et prêt")
    }
}