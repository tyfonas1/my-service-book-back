const mongoose = require("mongoose");

const leagueSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
});

module.exports = mongoose.model("League", leagueSchema);
