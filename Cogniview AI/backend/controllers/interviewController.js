const Session = require("../models/Session");
const axios = require("axios");
const { getNextQuestion } = require("../services/questionService");
const { v4: uuidv4 } = require("uuid");

// ✅ START
exports.startInterview = async (req, res) => {
  const { role } = req.body;

  const firstQuestion = getNextQuestion({
    role,
    askedQuestions: [],
    currentDifficulty: "easy"
  }, 5);

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


// ✅ ANSWER
exports.submitAnswer = async (req, res) => {
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
  feedback: result.feedback,
  topic: questionObj.topic || "General"
});

    if (!session.askedQuestions.includes(questionObj.question)) {
      session.askedQuestions.push(questionObj.question);
    }

    const nextQ = getNextQuestion(session, result.score);

    if (nextQ) {
      session.currentDifficulty = nextQ.difficulty;
      session.askedQuestions.push(nextQ.question);
    }

    await session.save();

    res.json({
      result,
      nextQuestion: nextQ,
      isFinished: !nextQ || session.answers.length >= 5
    });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ RESULT (THIS WAS LIKELY MISSING)
exports.getResult = async (req, res) => {
  const session = await Session.findOne({
    sessionId: req.params.sessionId
  });

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const scores = session.answers.map(a => a.score);

  const avg =
    scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

  const { analyzePerformance } = require("../services/analysisService");

const analysis = analyzePerformance(session.answers);

res.json({
  averageScore: avg.toFixed(2),
  topicPerformance: analysis.topicAvg,
  weakAreas: analysis.weakAreas,
  answers: session.answers
});
};