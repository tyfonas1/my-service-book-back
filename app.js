require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./api/routes/user");
const stadiumRoutes = require("./api/routes/stadiums");
const leagueRoutes = require("./api/routes/leagues");
const teamRoutes = require("./api/routes/teams");
const seasonRoutes = require("./api/routes/seasons");
const dayRoutes = require("./api/routes/days");
const matchesRoutes = require("./api/routes/matches");

console.log(process.env.mongooseURI);
mongoose.connect(process.env.mongooseURI);
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT , POST,GET,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/users", userRoutes);
app.use("/leagues", leagueRoutes);
app.use("/teams", teamRoutes);
app.use("/stadiums", stadiumRoutes);
app.use("/seasons", seasonRoutes);
app.use("/days", dayRoutes);
app.use("/matches", matchesRoutes);

app.use((req, res, ) => {
  res.status(200).json({
    message: "Up and running",
  });
});
console.log("run");
module.exports = app;
