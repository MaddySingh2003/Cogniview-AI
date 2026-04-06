const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  questions: [String],   // ✅ FIXED
  answers: [answerSchema], // ✅ FIXED
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);