const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  role: String,
  level: String,

  questions: Array,

  answers: [
    {
      questionId: Number,
      question: String,
      answer: mongoose.Schema.Types.Mixed,
      score: Number,
      feedback: [String],
      topic: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600   // auto delete after 1 hour
  }
});

module.exports = mongoose.model("Session", sessionSchema);