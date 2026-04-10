const express = require("express");
const router = express.Router();

// ✅ DESTRUCTURE PROPERLY
const {
  startInterview,
  submitAnswer,
  getResult
} = require("../controllers/interviewController");

// ✅ MUST BE FUNCTIONS
router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/result/:sessionId", getResult);

module.exports = router;