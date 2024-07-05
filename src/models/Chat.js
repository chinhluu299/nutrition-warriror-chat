const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    sender: String,
    receiver: String,
    messages: [
      {
        _id: String, //message_id
        text: String, //message_content
        createdAt: String, //message_creation_time
        user: {
          _id: String, //sender_id
          name: String, //sender_name
          avatar: String, //sender_photo
        },
        image: String, //message_image_content
      },
    ],
  },
  {
    strict: false,
  }
);

module.exports = mongoose.model("Chats", ChatSchema);
