const express = require('express');
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.post("/", ChatController.create);
router.get("/:sender/:reciever", ChatController.getDetailChat);
router.post("/:userId", ChatController.getAllChatUser);


module.exports = router;
