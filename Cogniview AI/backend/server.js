const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ================= DB (ONLY ONCE) =================
mongoose.connect(
  "mongodb+srv://admin:Milan2703%2E@ai-cluster.j2kcz2k.mongodb.net/ai-interview?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Atlas connected"))
.catch(err => {
  console.error("DB ERROR:", err.message);
  process.exit(1);
});


// ================= MODEL =================
const Session = mongoose.model("Session", new mongoose.Schema({
  sessionId: String,
  role: String,
  currentDifficulty: String,
  answers: [
    {
      question: String,
      score: Number,
      feedback: [String]
    }
  ]
}));


// ================= DATA =================
const questionBank = [
  {
    role: "data-scientist",
    type: "text",
    question: "What is overfitting?",
    difficulty: "easy"
  },
  {
    role: "backend",
    type: "mcq",
    question: "What is REST?",
    options: ["Random", "Representational State Transfer"],
    correctAnswer: "Representational State Transfer",
    difficulty: "easy"
  }
];

const difficultyOrder = ["easy", "medium", "hard"];


// ================= LOGIC =================
function getNextQuestion(role, currentDifficulty, score) {
  let index = difficultyOrder.indexOf(currentDifficulty);

  if (score >= 7 && index < 2) index++;
  else if (score < 4 && index > 0) index--;

  const nextDiff = difficultyOrder[index];

  const filtered = questionBank.filter(
    q => q.role === role && q.difficulty === nextDiff
  );

  return filtered[Math.floor(Math.random() * filtered.length)];
}


// ================= ROUTES =================

// START
app.post("/start", async (req, res) => {
  const { role } = req.body;

  const firstQ = questionBank.find(
    q => q.role === role && q.difficulty === "easy"
  );

  const sessionId = uuidv4();

  await Session.create({
    sessionId,
    role,
    currentDifficulty: "easy",
    answers: []
  });

  res.json({ sessionId, question: firstQ });
});


// ANSWER
app.post("/answer", async (req, res) => {
  try {
    const { sessionId, questionObj, answer } = req.body;

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(400).json({ error: "Session not found" });
    }

    const mlRes = await axios.post("http://localhost:8001/evaluate", {
      questionObj,
      answer
    });

    const result = mlRes.data;

    session.answers.push({
      question: questionObj.question,
      score: result.score,
      feedback: result.feedback
    });

    const nextQ = getNextQuestion(
      session.role,
      session.currentDifficulty,
      result.score
    );

    session.currentDifficulty = nextQ.difficulty;

    await session.save();

    res.json({
      result,
      nextQuestion: nextQ,
      isFinished: session.answers.length >= 5
    });

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});


// RESULT
app.get("/result/:sessionId", async (req, res) => {
  const session = await Session.findOne({
    sessionId: req.params.sessionId
  });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const scores = session.answers.map(a => a.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  res.json({
    averageScore: avg.toFixed(2),
    answers: session.answers
  });
});


// ================= SERVER =================
app.listen(3001, () => console.log("Server running on 3001"));