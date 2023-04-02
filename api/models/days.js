const mongoose = require("mongoose");

const daySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  priority: { type: Number },
});

module.exports = mongoose.model("Day", daySchema);
