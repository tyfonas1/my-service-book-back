const { isValidObjectId } = require("mongoose");
const Stadium = require("../models/stadium");

module.exports = async (req, res, next) => {
  const stadiums = [];
  for (const stId of req.body.stadiums) {
    if (!isValidObjectId(stId)) {
      stadiums.push(stId);
    } else {
      const stadium = await Stadium.find({ _id: stId });
      if (!stadium) {
        stadiums.push(stId);
      }
    }
  }
  if (stadiums?.length > 0)
    return res.status(404).send({ message: "Stadium Not found" });
  next();
};
