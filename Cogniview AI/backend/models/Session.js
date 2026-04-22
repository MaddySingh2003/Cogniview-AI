const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: Number,
  question: String,
  answer: mongoose.Schema.Types.Mixed,
  score: Number,
  feedback: [String],
  topic: String
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  userId: String, // ✅ NEW

  role: String,
  level: String,

  questions: Array,
  answers: [answerSchema],

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30 // ✅ 30 days auto delete
  }
});

module.exports = mongoose.model("Session", sessionSchema);