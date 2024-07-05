const User = require("../models/User");
const { PublishMessage, CreateChannel } = require("../utils/broker");

const CheerController = {
  cheer: async (req, res) => {
    try {
      const userId = await req.body.userId;
      const targetId = await req.body.targetId;
      const user = await User.findById(userId);
      const target = await User.findById(targetId);
      if (!user || !target) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      } else {
        PublishMessage(CreateChannel(), "notify_queue", {userId: user._id, content:`${user.name} cheer you up!`, title:"From your follower"});
      }
    } catch (error) {}
  },
};

module.exports = UserController;
