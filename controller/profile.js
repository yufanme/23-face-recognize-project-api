const handleProfile = (req, res, smartBrainDB) => {
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
};

module.exports = { handleProfile: handleProfile };
