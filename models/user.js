const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  membership: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
