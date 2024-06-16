const mongoose = require("mongoose");
const User = require('./User');

const seekerSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String },
});
const StorySchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  seekers: {
    type: [seekerSchema],
    default: [],
  },
  media: String,
  content: String,
  time: Date,
});

module.exports = mongoose.model("Stories", StorySchema);
