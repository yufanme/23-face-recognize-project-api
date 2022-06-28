const handleSignin = (req, res, smartBrainDB, bcrypt) => {
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
};

module.exports = { handleSignin: handleSignin };
