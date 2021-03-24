const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const messageSchema = new Schema({

  nick: String,
  message: String,
  time: String,
}, { versionKey: false }
);



module.exports = mongoose.model("messages", messageSchema);
