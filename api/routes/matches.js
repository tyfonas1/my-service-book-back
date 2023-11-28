const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const Leagues = require("../models/league");
const Match = require("../models/matches");
const mongoose = require("mongoose");

router.post("/:seasonId", async (req, res, ) => {
    const matches = await Match.find({season: req.params.seasonId})

    if(matches?.length > 0){
        return res.status(404).json({ message: 'You already create matches for this season' });
    }
    if(!req.params.seasonId){
        return res.status(404).json({ message: 'Season is not selected' });
    }
    if(!req.body || req.body?.length <1 || !Array.isArray(req.body)){
        return res.status(404).json({ message: 'Please add matches' });
    }
    let allTeams = []
    const foundWrongLeagues = []

    for(let league of req?.body){
        const found = await Leagues.find({_id: league?.league})
        league?.matches?.map((match)=>{
            if(match?.length < 2){
                return
            }
            allTeams.push(match[0])
            allTeams.push(match[1])
        })
        if(!found){
            foundWrongLeagues.push(league.league)
        }
    }

    if(foundWrongLeagues?.length > 0){
        return res.status(404).json({ message: 'Please check selected league' });
    }

    const foundWrongTeams = []

    for(let team of allTeams){
        const found = await Team.find({_id:team})
        if(!found){
            foundWrongTeams.push(team)
        }
    }
    allTeams = [].concat(...allTeams);
    if(foundWrongTeams?.length > 0){
        return res.status(404).json({ message: 'Please check teams' });
    }
    const match = await new Match({
        _id: new mongoose.Types.ObjectId(),
        season: req.params.seasonId,
        leagueMatches: req.body
    });

    await match.save()

    return res.status(200).json({ message: 'Matches has been saved successfully' });
});

router.get("/:seasonId", async (req, res, ) => {
    const matches = await Match.find({season: req.params.seasonId})

    if(matches?.length < 1){
        return res.status(404).json({ message: 'Not found' });
    }
    if(!req.params.seasonId){
        return res.status(404).json({ message: 'Season is not selected' });
    }
    const data = await populateAllMatches(matches[0])
    console.log(data?.leagueMatches[0]?.matches[0][0])
    return populateAllMatches(matches[0])
        .then((populatedData) => {
            res.status(200).json(populatedData);
        })
        .catch((error) => {
            res.status(500).send(error.message);
        });
});

router.get("/:seasonId/:leagueId", async (req, res, ) => {
    const matches = await Match.findOne({season: req.params.seasonId})

    if(matches?.length < 1){
        return res.status(404).json({ message: 'Not found' });
    }
    if(!req.params.seasonId){
        return res.status(404).json({ message: 'Season is not selected' });
    }

    if(!req.params.leagueId){
        return res.status(404).json({ message: 'League is not selected' });
    }
    const league = await Leagues.find({_id:  req.params.leagueId})
    let leagueMatches = matches?.leagueMatches?.find((mat)=> mat?.league?.toString() === req.params.leagueId)

    leagueMatches = leagueMatches?.matches?.map(async (l) => {
        return await Promise.all(l?.map(async (week) => {
            return await Promise.all(week?.map(async (match) => {
                const team1 = await Team.findOne({_id: match}).populate();
                console.log('in2', team1);
                return team1;
            }));
        }));
    });

    const data = { league: league, leagueMatches: await Promise.all(leagueMatches) };

    return res.status(200).json(data);
});


module.exports = router;


async function populateTeams(match) {
    for (let i = 0; i < match.length; i++) {
        const round = match[i];
        for (let j = 0; j < round.length; j++) {
            const game = round[j];
            match[i][j] = await Team.find({ _id: { $in: game } });

        }
    }
    return match;
}

// Function to populate team IDs for all matches
async function populateAllMatches(data) {
    for (let i = 0; i < data.leagueMatches.length; i++) {
        const leagueMatch = data.leagueMatches[i];
        data.leagueMatches[i] = await Match.populate(leagueMatch, {
            path: 'matches',
            populate: {
                path: 'teamIds',
                model: 'Team'
            }
        });

        // Further populate the nested structure
        data.leagueMatches[i].matches = await populateTeams(data.leagueMatches[i].matches);
    }

    return data;
}
