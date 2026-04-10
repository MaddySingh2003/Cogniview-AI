const Session = require("../models/Session");
const axios = require("axios");
const { getNextQuestion } = require("../services/questionService");
const { v4: uuidv4 } = require("uuid");


// 🚀 START
const startInterview = async (req, res) => {
  const { role } = req.body;

  const firstQuestion = getNextQuestion(
    { role, askedQuestions: [], currentDifficulty: "easy" },
    5
  );

  if (!firstQuestion) {
    return res.status(400).json({ error: "No questions available" });
  }

  const session = new Session({
    sessionId: uuidv4(),
    role,
    currentDifficulty: "easy",
    askedQuestions: [firstQuestion.question],
    answers: []
  });

  await session.save();

  res.json({
    sessionId: session.sessionId,
    question: firstQuestion
  });
};


// 🚀 ANSWER
const submitAnswer = async (req, res) => {
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
      score: result.score,
      feedback: result.feedback,
      topic: questionObj.topic || "General"
    });

    const nextQ = getNextQuestion(session, result.score);

    if (nextQ) {
      session.askedQuestions.push(nextQ.question);
      session.currentDifficulty = nextQ.difficulty;
    }

    await session.save();

    res.json({
      result,
      nextQuestion: nextQ,
      isFinished: session.answers.length >= 5 || !nextQ
    });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


// 🚀 RESULT
const getResult = async (req, res) => {
  const session = await Session.findOne({
    sessionId: req.params.sessionId
  });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const scores = session.answers.map(a => a.score);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  let overallFeedback = "Needs improvement";
  if (avg > 7) overallFeedback = "Strong performance";
  else if (avg > 5) overallFeedback = "Moderate performance";

  res.json({
    averageScore: avg.toFixed(2),
    overallFeedback,
    answers: session.answers
  });
};


// ✅ EXPORT CORRECTLY
module.exports = {
  startInterview,
  submitAnswer,
  getResult
};