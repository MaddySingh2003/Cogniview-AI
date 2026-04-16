const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  role: String,
  level: String,
  questions: Array,
  currentIndex: { type: Number, default: 0 },

  answers: [
    {
      question: String,
      answer: String,
      score: Number,
      feedback: [String]
    }
  ]
});

module.exports = mongoose.model("Session", sessionSchema);