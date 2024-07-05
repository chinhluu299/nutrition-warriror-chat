const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  photo: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  follows: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  }],
});

module.exports = mongoose.model("Users", UserSchema);