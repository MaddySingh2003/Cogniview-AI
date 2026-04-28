///session.js///


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
  userId: String,

  role: String,
  level: String,

  questions: Array,
  answers: [answerSchema],

  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

// ✅ PROPER TTL INDEX (30 days)
sessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

module.exports = mongoose.model("Session", sessionSchema);