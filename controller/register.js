const handleRegister = (req, res, smartBrainDB, bcrypt) => {
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
};

module.exports = { handleRegister: handleRegister };
