const User = require("../models/User");

const UserController = {
  getUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate("follows");
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  getFollow: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate("follows");
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      const followers = user.follows;
      return res.status(200).json({ success: true, data: followers });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  addFollow: async (req, res) => {
    //body: userId, targetId
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      const newFriend = req.body.targetId;
      const frenUser = await User.findById(newFriend);
      if (user && frenUser) {
        const friends = user.follows;

        if (!friends.includes(newFriend)) {
          friends.push(newFriend);
          await user.save();
          return res
            .status(200)
            .json({ success: true, message: "Add friend successfully" });
        } else
          return res
            .status(200)
            .json({ success: true, message: "User already been friend" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  },

  deleteFollow: async (req, res) => {
    //body: userId, targetId
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      const newFriend = req.body.targetId;
      const frenUser = await User.findById(newFriend);
      if (user && frenUser) {
        const friends = user.follows;
        if (friends.includes(newFriend)) {
          user.follows = friends.filter((value) => value != newFriend);
          await user.save();
          return res
            .status(200)
            .json({ success: true, message: "Delete friend successfully" });
        } else
          return res
            .status(200)
            .json({ success: true, message: "User not a friend" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  },
  addFriend: async (req, res) => {
    //body: user1, user2
    try {
      const userId = req.body.user1;
      const user = await User.findById(userId);
      const newFriend = req.body.user2;
      const frenUser = await User.findById(newFriend);
      if (user && frenUser) {
        const friends = user.follows;
        if (!friends.includes(newFriend)) {
          friends.push(newFriend);
          await user.save();
        }
        const friends_2 = frenUser.follows;
        if (!friends_2.includes(userId)) {
          friends_2.push(userId);
          await frenUser.save();
        }
        return res
          .status(200)
          .json({ success: true, message: "Add friend successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  },
  deleteFriend: async (req, res) => {
    //body: user1, user2
    try {
      const userId = req.body.user1;
      const user = await User.findById(userId);
      const newFriend = req.body.user2;
      const frenUser = await User.findById(newFriend);
      if (user && frenUser) {
        const friends = user.follows;
        if (friends.includes(newFriend)) {
          user.follows = friends.filter((value) => value != newFriend);
          await user.save();
        }
        const friends_2 = frenUser.follows;
        if (!friends_2.includes(userId)) {
          frenUser.follows = friends_2.filter((value) => value != userId);
          await frenUser.save();
        }
        return res
          .status(200)
          .json({ success: true, message: "Delete friend successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  },

};

module.exports = UserController;
