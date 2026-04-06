const connectDB = require("./config/db");
const Session=require("./models/Session")

const { v4: uuidv4 } = require("uuid");
const questionBank = [
  "What is overfitting?",
  "What is underfitting?",
  "Explain bias vs variance"
];
connectDB();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const sessions = {};

// ✅ START
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

// ✅ ANSWER
app.post("/answer", async (req, res) => {
  const { sessionId, question, answer } = req.body;

  const session = await Session.findOne({ sessionId });

  if (!session) {
    return res.status(400).json({ error: "Invalid session" });
  }

  try {
    const mlRes = await axios.post("http://localhost:8001/evaluate", {
      question,
      answer
    });

    const result = mlRes.data;

    session.answers.push({
      question,
      answer,
      score: result.score,
      feedback: result.feedback
    });

    await session.save();

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "ML service error" });
  }
});

// ✅ RESULT
app.get("/result/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findOne({ sessionId });

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


app.get("/analytics/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findOne({ sessionId });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const answers = session.answers;

  // 🔹 Topic tagging (basic logic)
  const topicScores = {};

  answers.forEach(a => {
    let topic = "General";

    if (a.question.toLowerCase().includes("overfitting")) topic = "ML Basics";
    else if (a.question.toLowerCase().includes("underfitting")) topic = "ML Basics";
    else if (a.question.toLowerCase().includes("bias")) topic = "Statistics";

    if (!topicScores[topic]) topicScores[topic] = [];

    topicScores[topic].push(a.score);
  });

  // 🔹 Average per topic
  const topicPerformance = {};

  for (let topic in topicScores) {
    const scores = topicScores[topic];
    const avg =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    topicPerformance[topic] = Number(avg.toFixed(2));
  }

  // 🔹 Weak areas
  const weakAreas = Object.entries(topicPerformance)
    .filter(([_, score]) => score < 5)
    .map(([topic]) => topic);

  res.json({
    topicPerformance,
    weakAreas
  });
});

app.listen(3001, () => console.log("Backend running on 3001"));