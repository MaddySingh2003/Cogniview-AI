const express = require("express");
const router = express.Router();

const interviewController = require("../controllers/interviewController");

// ✅ USE OBJECT REFERENCE (safer)
router.post("/start", interviewController.startInterview);
router.post("/answer", interviewController.submitAnswer);

module.exports = router;