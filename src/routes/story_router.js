const express = require("express");
const router = express.Router();

const StoryController = require("../controllers/StoryController");
//const upload = require("../services/multer");
const upload = require("../services/upload");

router.post("/seek", StoryController.getAllStoryByUser);
router.post("/user", StoryController.getStoriesUser);
router.post("/", upload , StoryController.create);
router.put("/seek/add", StoryController.updateSeek);
router.put("/seek/comment", StoryController.updateComment);


module.exports = router;
