const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");
const { evaluateText } = require("../services/mlService");

module.exports = {

  // ================= START =================
  startInterview: async (req, res) => {
    try {
      const { role, level } = req.body;

      const result = await generateQuestions(role, level);
      const questions = result.questions;

      const session = new Session({
        sessionId: uuidv4(),
        role,
        level,
        questions,
        answers: []
      });

      await session.save();

      res.json({
        sessionId: session.sessionId,
        question: questions[0],
        totalQuestions: questions.length
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Start failed" });
    }
  },

  // ================= ANSWER =================
  submitAnswer: async (req, res) => {
    try {
      const { sessionId, answer } = req.body;

      const session = await Session.findOne({ sessionId });

      if (!session) {
        return res.status(400).json({ error: "Session not found" });
      }

      const index = session.answers.length;
      const question = session.questions[index];

      let result;

      // ===== TEXT (ML) =====
      if (question.type === "text") {
        result = await evaluateText(
          question.question,
          answer,
          question.modelAnswer
        );
      }

      // ===== MCQ =====
      else if (question.type === "mcq") {
        const correct = question.correctAnswer === answer;

        result = {
          score: correct ? 10 : 3,
          feedback: correct ? ["Correct"] : ["Incorrect"]
        };
      }

      // ===== MSQ =====
      else if (question.type === "msq") {
        const selected = answer || [];
        const correct = question.correctAnswers || [];

        const match = selected.filter(a => correct.includes(a)).length;

        result = {
          score: Math.round((match / correct.length) * 10),
          feedback: ["Partial correctness"]
        };
      }

      // ===== SAVE =====
      session.answers.push({
        questionId: question.id,
        question: question.question,
        answer,
        score: result.score,
        feedback: result.feedback,
        topic: question.topic
      });

      await session.save();

      const nextQuestion = session.questions[index + 1];

      res.json({
        result,
        nextQuestion,
        isFinished: index + 1 >= session.questions.length
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Answer failed" });
    }
  },

  // ================= RESULT =================
  getResult: async (req, res) => {
    try {
      const session = await Session.findOne({
        sessionId: req.params.sessionId
      });

      const scores = session.answers.map(a => a.score);

      const avg =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      res.json({
        averageScore: avg.toFixed(2),
        answers: session.answers
      });

    } catch (err) {
      res.status(500).json({ error: "Result failed" });
    }
  }
};