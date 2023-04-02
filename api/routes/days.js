const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Day = require("../models/days");

router.get("/", async (req, res, next) => {
  const days = await Day.find();
  return res.status(200).json({ data: days });
});

router.post("/", async (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      message: "Please add a name",
    });
  }
  const day = await new Day({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    priority: req.body.priority,
  });
  day
    .save()
    .then((result) =>
      res.status(201).json({
        message: "Day Created",
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

module.exports = router;
