const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validateId = require("../middleware/validateId");
const Season = require("../models/season");

router.get("/", async (req, res, next) => {
  const season = await Season.find();
  return res.status(200).json({ data: season });
});

router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      message: "Please add a name",
    });
  }
  const season = await new Season({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  season
    .save()
    .then((result) =>
      res.status(201).json({
        message: "Season Created",
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
  const season = await Season.findOne({ _id: req.params._id });
  if (!season) {
    return res.status(404).json({
      message: "Season not found",
    });
  }
  return res.status(200).json({ data: season });
});

router.put("/:_id", [validateId], async (req, res, next) => {
  const season = await Season.findOne({ _id: req.params._id });
  if (!season) {
    return res.status(404).json({
      message: "Season not found",
    });
  }
  season.name = req.body.name || season.name;

  season
    .save()
    .then((result) =>
      res.status(201).json({
        message: "League Updated",
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
  const season = await Season.find({ _id: req.params._id });
  if (!season) {
    return res.status(404).json({
      message: "league not found",
    });
  }
  await Season.deleteOne({ _id: req.params._id });
  return res.send({ message: "Deleted succesfully" });
});

module.exports = router;
