const Story = require("../models/Story");
const User = require("../models/User");
const upload = require("../services/upload");

const GridFSBucket = require("mongodb").GridFSBucket;

const StoryController = {
  create: async (req, res) => {
    const story = new Story({
      author: req.body.author,
      seeker: [],
      media: "",
      content: req.body.content,
      time: Date.now(),
    });
    try {
      if(req.file){
        story.media = req.file.filename;
      }
      const savedStory = await story.save();
      return res.status(201).json(savedStory);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  updateSeek: async (req, res) => {
    try {
      const story = await Story.findOne({id: req.body.userId});
      if (story) {
        story.seekers.push({
          user: req.body.userId,
          comment: "",
        });
        await story.save();
        return res.status(200).json({ message: "Update ok" });
      } else {
        return res.status(404).json({ message: "Story not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const story = await Story.findOne({id: req.body.userId});
      if (story) {
        const seek = story.seekers.find((x) => x.user === req.body.user);
        if (seek) {
          seek.comment = req.body.comment;
          const updatedStory = await story.save();
          return res.status(200).json(updatedStory);
        } else return res.status(404).json({ message: "User not found" });
      } else {
        return res.status(404).json({ message: "Story not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getAllStoryByUser: async (req, res) => {
    try {
      let userId = req.body.userId;
      const limit = parseInt(req.body.limit, 10) || 10;
      const offset = parseInt(req.body.offset, 10) || 0;
      let time = new Date(req.body.time) || new Date();
      if(isNaN(time)) time = new Date();
      
      const user = await User.findById(userId);
      if (user) {
        const friends = user.follows;
        const stories = await Story.find({ author: { $in: friends } })
          .where("time")
          .lte(time)
          .sort({ time: -1 })
          .select("author media content time")
          .skip(offset)
          .limit(limit)
          .populate("author");
        return res.status(200).json({ success: true, data: stories });
      }
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error });
    }
  },
  getStoriesUser: async (req, res) => {
    try {
      const userId = req.body.userId;
      const limit = parseInt(req.body.limit, 10) || 10;
      const offset = parseInt(req.body.offset, 10) || 0;
      console.log(req.body.userId);
      const stories = await Story.find({ author: userId})
        .select("author media content time")
        .sort({ time: -1 })
        .skip(offset)
        .limit(limit)
        .populate("author");
      console.log(stories)
      return res.status(200).json({ success: true, data: stories });

    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: error });
    }
  },
};

module.exports = StoryController;
