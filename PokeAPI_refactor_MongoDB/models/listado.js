const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const pokSchema = new Schema({

  id: Number,
  name: String,
  type: String

}, { versionKey: false }
);

module.exports = mongoose.model('pokemons', pokSchema)