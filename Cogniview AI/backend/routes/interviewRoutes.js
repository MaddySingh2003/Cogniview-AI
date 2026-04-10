const express = require("express");
const router = express.Router();

const controller = require("../controllers/interviewController");

// ✅ ALL MUST EXIST
router.post("/start", controller.startInterview);
router.post("/answer", controller.submitAnswer);
router.get("/result/:sessionId", controller.getResult);

module.exports = router;