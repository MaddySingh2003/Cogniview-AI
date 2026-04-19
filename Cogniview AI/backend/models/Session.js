const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: Number,
  question: String,

  // ✅ FIX: allow string only (we convert array → string)
  answer: String,

  score: Number,
  feedback: [String],
  topic: String
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  role: String,
  level: String,
  questions: Array,
  answers: [answerSchema]
});

module.exports = mongoose.model("Session", sessionSchema);