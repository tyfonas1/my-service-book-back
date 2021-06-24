const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./api/routes/user");
const cors = require("cors");
mongoose.connect(
  "mongodb+srv://hnNbyq3kebWmE8MZ:hnNbyq3kebWmE8MZ@my-service-book.pfrqz.mongodb.net/MyServiceBook?retryWrites=true&w=majority"
);
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

app.use("/user", userRoutes);

app.use((req, res, next) => {
  res.status(200).json({
    message: "It works!2",
  });
});
console.log("run");
module.exports = app;
