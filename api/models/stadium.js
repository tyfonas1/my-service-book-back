const mongoose = require("mongoose");

const stadiumSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
});

module.exports = mongoose.model("Stadium", stadiumSchema);
