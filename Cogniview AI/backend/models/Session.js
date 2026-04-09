const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: String,
  answer: mongoose.Schema.Types.Mixed, // supports string + array
  score: Number,
  feedback: [String]
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  questions: Array,
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);