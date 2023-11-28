const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validateId = require("../middleware/validateId");
const Stadium = require("../models/stadium");

router.get("/", async (req, res, next) => {
  const stadiums = await Stadium.find();
  return res.status(200).json({ data: stadiums });
});

router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      message: "Please add a name",
    });
  }
  const stadium = await new Stadium({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    daysAndHours: req.body.daysAndHours
  });
  stadium
    .save()
    .then((result) =>
      res.status(201).json({
        message: "Stadium Created",
        data: result,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:_id", [validateId], async (req, res, next) => {
  const stadium = await Stadium.findOne({ _id: req.params._id });
  if (!stadium) {
    return res.status(404).json({
      message: "stadium not found",
    });
  }
  return res.status(200).json({ data: stadium });
});

router.put("/:_id", [validateId], async (req, res, next) => {
  const stadium = await Stadium.findOne({ _id: req.params._id });
  if (!stadium) {
    return res.status(404).json({
      message: "Stadium not found",
    });
  }
  stadium.name = req.body.name || stadium.name;
  stadium.hours = req.body.hours || stadium.hours;

  stadium
    .save()
    .then((result) =>
      res.status(201).json({
        message: "Stadium Updated",
        data: result,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:_id", [validateId], async (req, res, next) => {
  const stadium = await Stadium.find({ _id: req.params._id });
  if (!stadium) {
    return res.status(404).json({
      message: "stadium not found",
    });
  }
  await Stadium.deleteOne({ _id: req.params._id });
  return res.send({ message: "Deleted succesfully" });
});

module.exports = router;
