const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Session = require("../models/Session");

// ================= QUESTION BANK =================
const questionBank = [
  {
    type: "text",
    question: "What is overfitting?",
    difficulty: "easy",
    topic: "ML"
  },
  {
    type: "mcq",
    question: "Which causes overfitting?",
    options: ["Too much data", "Too complex model", "Regularization"],
    correctAnswer: "Too complex model",
    difficulty: "easy",
    topic: "ML"
  },
  {
    type: "text",
    question: "Explain bias-variance tradeoff",
    difficulty: "medium",
    topic: "ML"
  },
  {
    type: "msq",
    question: "Select regularization techniques",
    options: ["L1", "L2", "Dropout", "Increase layers"],
    correctAnswers: ["L1", "L2", "Dropout"],
    difficulty: "medium",
    topic: "ML"
  },
  {
    type: "text",
    question: "Derive bias-variance decomposition",
    difficulty: "hard",
    topic: "ML"
  }
];

const difficultyOrder = ["easy", "medium", "hard"];

// ================= HELPER =================
function getNextQuestion(currentDifficulty, lastScore) {
  let index = difficultyOrder.indexOf(currentDifficulty);

  if (lastScore >= 7 && index < 2) index++;
  else if (lastScore < 4 && index > 0) index--;

  const nextDifficulty = difficultyOrder[index];

  const filtered = questionBank.filter(
    (q) => q.difficulty === nextDifficulty
  );

  return filtered[Math.floor(Math.random() * filtered.length)];
}

// ================= START =================
exports.startInterview = async () => {
  const sessionId = uuidv4();

  const firstQuestion = questionBank.find(
    (q) => q.difficulty === "easy"
  );

  const session = new Session({
    sessionId,
    currentDifficulty: "easy",
    questions: [firstQuestion],
    answers: []
  });

  await session.save();

  return {
    sessionId,
    question: firstQuestion
  };
};

// ================= ANSWER =================
exports.submitAnswer = async ({ sessionId, questionObj, answer }) => {
  const session = await Session.findOne({ sessionId });

  if (!session) {
    throw new Error("Invalid session");
  }

  // 🔹 Call ML service
  const mlRes = await axios.post("http://localhost:8001/evaluate", {
    questionObj,
    answer
  });

  const result = mlRes.data;

  // 🔹 Save answer
  session.answers.push({
    question: questionObj.question,
    answer,
    score: result.score,
    feedback: result.feedback
  });

  // 🔹 Adaptive next question
  const nextQ = getNextQuestion(
    session.currentDifficulty,
    result.score
  );

  session.currentDifficulty = nextQ.difficulty;
  session.questions.push(nextQ);

  await session.save();

  return {
    result,
    nextQuestion: nextQ,
    isFinished: session.answers.length >= 5
  };
};

// ================= RESULT =================
exports.getResult = async (sessionId) => {
  const session = await Session.findOne({ sessionId });

  if (!session) {
    throw new Error("Session not found");
  }

  const scores = session.answers.map((a) => a.score);

  const avg =
    scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

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

  return {
    averageScore: Number(avg.toFixed(2)),
    selectionProbability: `${Math.round(probability)}%`,
    verdict,
    answers: session.answers
  };
};