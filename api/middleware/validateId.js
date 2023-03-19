const { isValidObjectId } = require("mongoose");

module.exports = async (req, res, next) => {
  if (!isValidObjectId(req.params._id))
    return res.status(404).send({ message: "Not found" });
  next();
};
