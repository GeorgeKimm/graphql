const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// описание данных через mongoose схему
const movieSchema = new Schema({
  name: String,
  genre: String,
  directorID: String,
});

module.exports = mongoose.model("Movie", movieSchema, "movies");
