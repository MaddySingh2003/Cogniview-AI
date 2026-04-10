const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  role: String,
  currentDifficulty: String,
  askedQuestions: [String],
  answers: [
    {
      question: String,
      score: Number,
      feedback: [String],
      topic: String
    }
  ]
});

module.exports = mongoose.model("Session", sessionSchema);