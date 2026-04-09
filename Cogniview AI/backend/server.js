const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const connectDB = require("./config/db");
const Session = require("./models/Session");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// ================= QUESTION BANK =================
const questionBank = [
  {
    type: "text",
    question: "What is overfitting?"
  },
  {
    type: "mcq",
    question: "Which of the following causes overfitting?",
    options: [
      "Too much data",
      "Too complex model",
      "Regularization",
      "Dropout"
    ],
    correctAnswer: "Too complex model"
  },
  {
    type: "msq",
    question: "Select techniques to prevent overfitting",
    options: [
      "Regularization",
      "Dropout",
      "Increase model complexity",
      "Cross-validation"
    ],
    correctAnswers: [
      "Regularization",
      "Dropout",
      "Cross-validation"
    ]
  }
];


// ================= START =================
app.post("/start", async (req, res) => {
  const sessionId = uuidv4();

  const newSession = new Session({
    sessionId,
    questions: questionBank,
    answers: []
  });

  await newSession.save();

  res.json({
    sessionId,
    questions: questionBank
  });
});


// ================= ANSWER =================
app.post("/answer", async (req, res) => {
  try {
    const { sessionId, questionObj, answer } = req.body;

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(400).json({ error: "Invalid session" });
    }

    const mlRes = await axios.post("http://localhost:8001/evaluate", {
      questionObj,
      answer
    });

    const result = mlRes.data;

    session.answers.push({
      question: questionObj.question,
      answer,
      score: result.score,
      feedback: result.feedback
    });

    await session.save();

    res.json(result);

  } catch (err) {
    console.error("ML ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});


// ================= RESULT =================
app.get("/result/:sessionId", async (req, res) => {
  const session = await Session.findOne({
    sessionId: req.params.sessionId
  });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const scores = session.answers.map(a => a.score);

  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

  const variance =
    scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) /
    (scores.length || 1);

  let probability = avg * 10;

  if (variance > 5) probability -= 10;
  if (avg > 8) probability += 5;

  probability = Math.max(0, Math.min(100, probability));

  let verdict = "Needs improvement";

  if (probability > 75) verdict = "High chance of selection";
  else if (probability > 50) verdict = "Moderate chance";

  res.json({
    averageScore: Number(avg.toFixed(2)),
    selectionProbability: `${Math.round(probability)}%`,
    verdict,
    answers: session.answers
  });
});


// ================= SERVER =================
app.listen(3001, () => console.log("Server running on 3001"));