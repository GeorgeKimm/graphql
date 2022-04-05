const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// описание данных через mongoose схему
const directorSchema = new Schema({
  name: String,
  born: Number,
});

module.exports = mongoose.model("Director", directorSchema, "directors");
