const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controller/register");
const signin = require("./controller/signin");
const profile = require("./controller/profile");
const image = require("./controller/image");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

// const smartBrainDB = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     port: 5432,
//     user: "fan",
//     password: "",
//     database: "smart-brain",
//   },
// });

const smartBrainDB = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

app.get("/", (req, res) => {
  // smartBrainDB
  //   .select("*")
  //   .from("users")
  //   .then((db) => res.json(db))
  //   .catch((err) => res.status(400).json("get db error"));
  res.json("It is working!");
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, smartBrainDB, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, smartBrainDB, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, smartBrainDB);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, smartBrainDB);
});

app.post("/imageURL", (req, res) => {
  image.handleImageURL(req, res);
});

app.listen(port, () => {
  console.log("app is running on port " + port);
});

/* 
plan of server.js
/ --> res = this is working
/signin --> POST = success fail
/register --> POST = userObject
/profiel/:userid --> GET = userObject
/image --> PUT/PATCH =  userObject
*/
