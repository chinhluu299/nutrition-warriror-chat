const express = require("express");
const router = express.Router();

const UploadController = require("../controllers/UploadController");
//const upload = require("../services/multer");

router.post("/download", UploadController.download);

module.exports = router;
