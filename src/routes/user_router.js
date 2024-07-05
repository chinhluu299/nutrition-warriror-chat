const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/:userId", UserController.getUser);
router.get("/follow/:userId", UserController.getFollow);
router.post("/follow", UserController.addFollow);
router.delete("/follow", UserController.deleteFollow);
router.post("/friend", UserController.addFriend);
router.delete("/friend", UserController.deleteFriend);

module.exports = router;
