const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "mcq", "msq"],
    required: true
  },
  question: String,
  options: [String],
  correctAnswer: String,
  correctAnswers: [String]
});

const answerSchema = new mongoose.Schema({
  question: String,
  answer: mongoose.Schema.Types.Mixed, // important (string OR array)
  score: Number,
  feedback: String
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  questions: [questionSchema], // ✅ FIXED
  answers: [answerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", sessionSchema);