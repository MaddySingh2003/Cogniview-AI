const express = require("express");
const router = express.Router();
const controller = require("../controllers/interviewController");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const upload = require("../middleware/upload"); // adjust path

router.post("/start", auth, controller.startInterview);
router.post("/answer", auth, controller.submitAnswer);
router.get("/result/:sessionId", auth, controller.getResult);
router.get("/history",auth,userController.getHistory);
router.post("/start", auth, upload.single("resume"), controller.startInterview);


module.exports = router;