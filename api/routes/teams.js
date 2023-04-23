const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const validateId = require("../middleware/validateId");
const validateStadium = require("../middleware/validateStadium");
const Team = require("../models/team");
const Leagues = require("../models/league");
const Stadium = require("../models/stadium");
const Season = require("../models/season");
const Day = require("../models/days");

router.get("/", async (req, res, next) => {
  const teams = await Team.find().populate('league').populate('stadiums').populate('seasons');
  return res.status(200).json({ data: teams });
});

router.get("/team/:_id", [validateId], async (req, res, next) => {
  const team = await Team.findOne({ _id: req.params._id });

  if (!team) {
    return res.status(404).json({ message: "Team not found2" });
  }
  return res.status(200).json({ data: team });
});

router.get("/season/:_id", [validateId], async (req, res, next) => {
  const teams = await Team.find({seasons: req.params._id}).populate('league').populate('stadiums').populate('seasons');
  if (!teams) {
    return res.status(404).json({ message: "Team not found1" });
  }
  return res.status(200).json({ data: teams });
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

  const stadiums = await Stadium.count({ _id: { $in: req.body.stadiums } });

  if (req.body.stadiums.length > stadiums) {
    return res.status(404).json({
      message: "Stadium doesnt exists",
    });
  }
  let seasons
  if(req.body.seasons?.length > 0 ){

     seasons = await Season.count({ _id: { $in: req.body.seasons } });
    if (req.body.seasons.length > seasons) {
      return res.status(404).json({
        message: "Season doesnt exists",
      });
    }
  }


  // let daysFromRequest = [];
  //
  // if (req.body.playDateTime?.length > 0) {
  //   daysFromRequest = req.body.playDateTime?.map((d) => d.day);
  // }
  // const days = await Day.count({ _id: { $in: daysFromRequest } });
  //
  // if (days < daysFromRequest?.length) {
  //   return res.status(404).json({
  //     message: "Day doesnt exists",
  //   });
  // }

  const team = await new Team({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    league: league,
    playDateTime: req.body.playDateTime,
    notes: req.body.notes,
    stadiums: req.body.stadiums,
    seasons: req.body.seasons || []
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

  const stadiums = await Stadium.count({ _id: { $in: req.body.stadiums } });

  if (req.body.stadiums.length > stadiums) {
    return res.status(404).json({
      message: "Stadium doesnt exists",
    });
  }
  let seasons
  if(req.body.seasons?.length > 0 ){

    seasons = await Season.count({ _id: { $in: req.body.seasons } });
    if (req.body.seasons.length > seasons) {
      return res.status(404).json({
        message: "Season doesnt exists",
      });
    }
  }
  console.log("ok");
  team.name = req.body.name || team.name;
  team.league = req.body.league || team.league;
  team.stadiums = req.body.stadiums || team.stadiums;
  team.seasons = req.body.seasons || team.seasons;

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
