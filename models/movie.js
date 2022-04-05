const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: String,
  genre: String,
  directorID: String,
});

module.exports = mongoose.model("Movie", movieSchema, "movies");
