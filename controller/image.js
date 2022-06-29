const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "583569cd329c42f9ba2d8c275778a27c",
});

const handleImage = (req, res, smartBrainDB) => {
  const { id } = req.body;
  smartBrainDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("Unable to get entries."));
};

const handleImageURL = (req, res) => {
  const { imageLink } = req.body;
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      // THE JPG
      imageLink
    )
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json("error get clarify response");
    });
};

module.exports = { handleImage: handleImage, handleImageURL: handleImageURL };
