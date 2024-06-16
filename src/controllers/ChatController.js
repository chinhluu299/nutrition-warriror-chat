const Chat = require("../models/Chat");

const ChatController = {
  create: async (req, res) => {
    const query = Chat.findOne({
      $or: [
        { reciever: req.body.reciever, sender: req.body.sender },
        { reciever: req.body.sender, sender: req.body.reciever },
      ],
    });
    query
      .exec()
      .then((data) => {
        if (data === null) {
          const chat = new Chat({
            sender: req.body.sender,
            reciever: req.body.reciever,
            messages: req.body.messages,
          });

          chat
            .save()
            .then((data) => {
              res.json(data);
            })
            .catch((error) => {
              res.json(error);
            });
        } else {
          const updateChat = Chat.updateOne(
            {
              $or: [
                { reciever: req.body.reciever, sender: req.body.sender },
                { reciever: req.body.sender, sender: req.body.reciever },
              ],
            },
            { $set: { messages: req.body.messages } }
          );
          updateChat
            .exec()
            .then((data) => {
              res.json(data);
            })
            .catch((error) => {
              res.json(error);
            });
        }
      })
      .catch((error) => {
        res.json(error);
      });
  },
  getDetailChat: (req, res) => {
    const chat = Chat.findOne({
      $or: [
        { reciever: req.params.reciever, sender: req.params.sender },
        { reciever: req.params.sender, sender: req.params.reciever },
      ],
    });

    chat.exec().then((data) => {
      if (data === null) {
        res.json([]);
      } else {
        res.json(data.messages);
      }
    });
  },
  getAllChatUser: (req, res) => {
    const chat = Chat.find({
      $or: [{ reciever: req.params.userId }, { sender: req.params.userId }],
    });

    chat.exec().then((data) => {
      if (data.length === 0) {
        res.json([]);
      } else {
        res.json(data);
      }
    });
  },
};

module.exports = ChatController;
