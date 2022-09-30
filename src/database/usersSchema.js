const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
});

const Users = mongoose.model("Users", usersSchema);

module.exports = { Users };
