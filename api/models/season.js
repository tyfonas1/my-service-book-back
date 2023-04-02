const mongoose = require("mongoose");

const seasonSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
});

module.exports = mongoose.model("Season", seasonSchema);
