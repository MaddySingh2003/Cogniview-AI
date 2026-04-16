const express = require("express");
const router = express.Router();

const {
  startInterview,
  submitAnswer
} = require("../controllers/interviewController");

router.post("/start", startInterview);
router.post("/answer", submitAnswer);

module.exports = router;