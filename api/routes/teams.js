const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validateId = require("../middleware/validateId");
const validateStadium = require("../middleware/validateStadium");
const Team = require("../models/team");
const Leagues = require("../models/league");
const Stadium = require("../models/stadium");

router.get("/", async (req, res, next) => {
  const teams = await Team.find();
  return res.status(200).json({ data: teams });
});

router.get("/:_id", [validateId], async (req, res, next) => {
  const team = await Team.findOne({ _id: req.params._id });

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  return res.status(200).json({ data: team });
});

router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      message: "Please add a name",
    });
  }
  if (!req.body.league) {
    return res.status(404).json({
      message: "Please add a league",
    });
  }
  const league = await Leagues.findOne({ _id: req.body.league });
  if (!league) {
    return res.status(404).json({
      message: "League not found",
    });
  }
  const team = await new Team({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    league: league,
  });
  team
    .save()
    .then((result) =>
      res.status(201).json({
        message: "Team Created",
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

router.put("/:_id", [validateId, validateStadium], async (req, res, next) => {
  const team = await Team.findOne({ _id: req.params._id });
  if (!team) {
    return res.status(404).json({
      message: "Team not found",
    });
  }

  const league = await Leagues.findOne({ _id: req.body.league });
  if (!league) {
    return res.status(404).json({
      message: "League not found",
    });
  }
  console.log("ok");
  team.name = req.body.name || team.name;
  team.league = req.body.league || team.league;
  team.stadiums = req.body.stadiums || team.stadiums;

  team
    .save()
    .then((result) =>
      res.status(201).json({
        message: "Team Updated",
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
  const team = await Team.find({ _id: req.params._id });
  if (!team) {
    return res.status(404).json({
      message: "team not found",
    });
  }
  await Team.deleteOne({ _id: req.params._id });
  return res.send({ message: "Deleted succesfully" });
});

module.exports = router;
