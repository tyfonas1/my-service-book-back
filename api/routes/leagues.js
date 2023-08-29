const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Leagues = require("../models/league");
const { isValidObjectId } = require("mongoose");
const validateId = require("../middleware/validateId");
const Team = require("../models/team");

router.get("/", async (req, res) => {
  const league = await Leagues.find();
  return res.status(200).json({ data: league });
});

router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      message: "Please add a name",
    });
  }
  const league = await new Leagues({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
  });
  league
    .save()
    .then((result) =>
      res.status(201).json({
        message: "League Created",
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
  const league = await Leagues.findOne({ _id: req.params._id });
  if (!league) {
    return res.status(404).json({
      message: "league not found",
    });
  }
  return res.status(200).json({ data: league });
});

router.put("/:_id", [validateId], async (req, res, next) => {
  const league = await Leagues.findOne({ _id: req.params._id });
  if (!league) {
    return res.status(404).json({
      message: "League not found",
    });
  }
  league.name = req.body.name || league.name;

  league
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
  const league = await Leagues.find({ _id: req.params._id });
  if (!league) {
    return res.status(404).json({
      message: "league not found",
    });
  }
  await Leagues.deleteOne({ _id: req.params._id });
  return res.send({ message: "Deleted succesfully" });
});

module.exports = router;
