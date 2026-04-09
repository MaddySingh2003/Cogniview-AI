const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: String,
  answer: mongoose.Schema.Types.Mixed,
  score: Number,
  feedback: [String]
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  currentDifficulty: String,
  questions: [Object],
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);