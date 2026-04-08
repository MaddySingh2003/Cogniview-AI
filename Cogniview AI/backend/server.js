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

/* ------------------ QUESTION BANK ------------------ */
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

/* ------------------ START ------------------ */
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

/* ------------------ ANSWER ------------------ */
app.post("/answer", async (req, res) => {
  const { sessionId, questionObj, answer } = req.body;

  const session = await Session.findOne({ sessionId });

  if (!session) {
    return res.status(400).json({ error: "Invalid session" });
  }

  let result;

  try {
    // 🔹 TEXT (ML)
    if (questionObj.type === "text") {
      const mlRes = await axios.post("http://localhost:8001/evaluate", {
        question: questionObj.question,
        answer
      });

      result = mlRes.data;
    }

    // 🔹 MCQ
    else if (questionObj.type === "mcq") {
      const isCorrect = answer === questionObj.correctAnswer;

      result = {
        score: isCorrect ? 10 : 0,
        feedback: isCorrect ? "Correct answer" : "Incorrect answer"
      };
    }

    // 🔹 MSQ
    else if (questionObj.type === "msq") {
      const correct = questionObj.correctAnswers;

      const correctCount = answer.filter(a => correct.includes(a)).length;
      const total = correct.length;

      const score = (correctCount / total) * 10;

      result = {
        score: Number(score.toFixed(2)),
        feedback:
          score === 10
            ? "Perfect answer"
            : "Partially correct, review concepts"
      };
    }

    session.answers.push({
      question: questionObj.question,
      answer,
      score: result.score,
      feedback: result.feedback
    });

    await session.save();

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Evaluation failed" });
  }
});

/* ------------------ RESULT ------------------ */
app.get("/result/:sessionId", async (req, res) => {
  const session = await Session.findOne({
    sessionId: req.params.sessionId
  });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const scores = session.answers.map(a => a.score);
  const avg =
    scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

  res.json({
    averageScore: Number(avg.toFixed(2)),
    totalQuestions: session.questions.length,
    answers: session.answers
  });
});

/* ------------------ ANALYTICS ------------------ */
app.get("/analytics/:sessionId", async (req, res) => {
  const session = await Session.findOne({
    sessionId: req.params.sessionId
  });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const topicScores = {};

  session.answers.forEach(a => {
    let topic = "General";

    if (a.question.toLowerCase().includes("overfitting"))
      topic = "ML Basics";
    else if (a.question.toLowerCase().includes("bias"))
      topic = "Statistics";

    if (!topicScores[topic]) topicScores[topic] = [];
    topicScores[topic].push(a.score);
  });

  const topicPerformance = {};

  for (let t in topicScores) {
    const scores = topicScores[t];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    topicPerformance[t] = Number(avg.toFixed(2));
  }

  const weakAreas = Object.entries(topicPerformance)
    .filter(([_, score]) => score < 5)
    .map(([topic]) => topic);

  res.json({
    topicPerformance,
    weakAreas
  });
});

app.listen(3001, () => console.log("Server running on 3001"));