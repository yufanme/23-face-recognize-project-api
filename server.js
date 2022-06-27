const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

const smartBrainDB = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "fan",
    password: "",
    database: "smart-brain",
  },
});

app.get("/", (req, res) => {
  smartBrainDB
    .select("*")
    .from("users")
    .then((db) => res.json(db))
    .catch((err) => res.status(400).json("get db error"));
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  smartBrainDB
    .select("email", "hash")
    .from("login")
    // .where({ email: email })
    .where("email", "=", email)
    .then((data) => {
      if (data.length) {
        if (bcrypt.compareSync(password, data[0].hash)) {
          smartBrainDB
            .select("*")
            .from("users")
            .where({ email: email })
            .then((user) => res.json(user[0]))
            .catch((err) =>
              res.status(400).json("unable to get user in signin")
            );
        } else {
          res.json("password error");
        }
      } else {
        res.json("user not found");
      }
    })
    .catch((err) => res.status(400).json("login in error"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const hash = bcrypt.hashSync(password);
  //use transaction
  smartBrainDB
    .transaction((trx) => {
      //login table
      smartBrainDB("login")
        .transacting(trx)
        .insert({
          hash: hash,
          email: email,
        })
        .returning("email")
        .then((loginEmail) => {
          //user table
          trx("users")
            .insert({
              name: name,
              email: loginEmail[0].email,
              joined: new Date(),
            })
            .returning("*")
            .then((user) => {
              res.json(user[0]);
            })
            .catch((err) => res.status(400).json("Unable to register."));
        })
        //commit and rollback transaction
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).json("Unable to register."));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  smartBrainDB
    .select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("User not found!");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  smartBrainDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("Unable to get entries."));
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
