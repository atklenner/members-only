const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  user: String,
});

messageSchema.virtual("delete").get(function () {
  return "/delete/" + this._id;
});

module.exports = mongoose.model("Message", messageSchema);
