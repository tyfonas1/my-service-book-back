const mongoose = require("mongoose");


const matchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  season: { type: mongoose.Schema.Types.ObjectId, ref: "Season" },
  leagueMatches: [{
    league:{ type: mongoose.Schema.Types.ObjectId, ref: "League" },matches:[[[{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }]]]
  }]
});

module.exports = mongoose.model("Match", matchSchema);
