const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const e = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

const database = {
  user: [
    {
      id: "1",
      name: "John",
      email: "john@gmail.com",
      password: "hijohn",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "Sally",
      email: "sally@gmail.com",
      password: "hisally",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "1",
      email: "john@gmail.com",
      hash: "$2a$10$yRb7moLGmLDqv9ra1MQASucBZu.nFQbFnea2psY883ei/OsFHN1EO",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.user);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (
    email === database.user[0].email &&
    password === database.user[0].password
  ) {
    res.json("signin success!");
  } else {
    res.status(400).json("signin failed!");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  database.user.push({
    id: "3",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  // send user without password to load user on the home page
  res.json(database.user[database.user.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let foundUser = false;
  database.user.forEach((user) => {
    if (user.id === id) {
      foundUser = true;
      return res.json(user);
    }
  });
  if (!foundUser) {
    res.status(400).json("no user with id of " + id);
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let foundUser = false;
  database.user.forEach((user) => {
    if (user.id === id) {
      foundUser = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!foundUser) {
    res.status(400).json("no user with id of " + id);
  }
});

app.listen(port, () => {
  console.log("app is running on port " + port);
});

/* 
/ --> res = this is working
/signin --> POST = success fail
/register --> POST = userObject
/profiel/:userid --> GET = userObject
/image --> PUT/PATCH =  userObject
*/
