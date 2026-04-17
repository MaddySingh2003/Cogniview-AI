const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const QuestionCache = require("../models/QuestionCache");
const { v4: uuidv4 } = require("uuid");

module.exports = {

  // ================= START =================
  startInterview: async (req, res) => {
    try {
      const { role, level } = req.body;

      let cache = await QuestionCache.findOne({ role, level });

      let questions;

      if (cache) {
        console.log("⚡ Using cached questions");
        questions = cache.questions;

      } else {
        const result = await generateQuestions(role, level);
        questions = result.questions;

        if (result.source !== "fallback") {
          await QuestionCache.create({ role, level, questions });
        } else {
          console.log("⚠️ Not caching fallback");
        }
      }

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

      if (question.type === "text") {
        result = {
          score: 7,
          feedback: ["Text evaluation placeholder"]
        };
      }

      else if (question.type === "mcq") {
        const correct = question.correctAnswer === answer;

        result = {
          score: correct ? 10 : 3,
          feedback: correct ? ["Correct"] : ["Incorrect"]
        };
      }

      else if (question.type === "msq") {
        const selected = answer || [];
        const correct = question.correctAnswers || [];

        const match = selected.filter(a => correct.includes(a)).length;

        result = {
          score: Math.round((match / correct.length) * 10),
          feedback: ["Partial correctness"]
        };
      }

      session.answers.push({
        question: question.question,
        answer,
        score: result.score,
        feedback: result.feedback
      });

      await session.save();

      res.json({
        result,
        nextQuestion: session.questions[index + 1],
        isFinished: index + 1 >= session.questions.length
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Answer failed" });
    }
  }

};