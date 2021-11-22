const { Schema, model } = require('mongoose');

module.exports = model("infractions", new Schema({
    GuildID: String,
    UserID: String,
    WarnData: Array,
    BanData: Array,
    KickData: Array,
    MuteData: Array,
}));