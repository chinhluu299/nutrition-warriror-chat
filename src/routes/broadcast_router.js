const BroadcastController = require("../controllers/BroadcastController");
const express = require("express");
const router = express.Router();

router.post("/", BroadcastController.create);
router.get("/", BroadcastController.get);

module.exports = router;
