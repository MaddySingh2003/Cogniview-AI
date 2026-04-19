const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: Number,
  question: String,
  answer: String,
  score: Number,
  feedback: [String],
  topic: String
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  role: String,
  level: String,
  questions: Array,
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);