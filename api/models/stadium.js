const mongoose = require("mongoose");

const daysAndHoursSchema = mongoose.Schema(
    {from: String,to:String},{ _id : false }
)

const stadiumSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  daysAndHours: [[daysAndHoursSchema]],
});

module.exports = mongoose.model("Stadium", stadiumSchema);
