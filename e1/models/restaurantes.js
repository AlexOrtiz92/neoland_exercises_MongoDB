const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const restSchema = new Schema({

  URL: String,
  address: String,
  "address line 2": String,
  name: String,
  outcode: String,
  postcode: String,
  rating: Number,
  type_of_food: String
}, { versionKey: false }
);


module.exports = mongoose.model("restaurants", restSchema);
