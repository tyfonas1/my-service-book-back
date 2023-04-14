const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const {addWeeks} = require("date-fns");

router.post("/", async (req, res, next) => {
    const teams = await Team.find();
    const matchWeeks = []
    if(teams?.length > 0){
        teams.map((team,index)=>{
            matchWeeks.push(addWeeks(new Date(req.body.startDate),index))
        })
    }
    return res.status(200).json({ data: teams });
});

module.exports = router;
