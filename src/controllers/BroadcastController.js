const Broadcasts = require("../models/Broadcast");

const BroadcastController = {
  create: async (req, res) => {
    const broadcast = new Broadcast(req.body);
    broadcast
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  },
  get: async (req, res) => {
    const chat = Broadcast.find();
    chat.exec().then((data) => {
      if (data === null) {
        res.json(data);
      } else {
        res.json(data);
      }
    });
  },
};

module.exports = BroadcastController;