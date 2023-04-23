const mongoose = require("mongoose");

const playDateTimeItem = mongoose.Schema(
{from: String,to:String},{ _id : false }
)
const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  league: { type: mongoose.Schema.Types.ObjectId, ref: "League" },
  stadiums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stadium" }],
  seasons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Season" }],
  playDateTime: [[playDateTimeItem]],
  notes: { type: String },
});

module.exports = mongoose.model("Team", teamSchema);
