const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");
const { evaluateText } = require("../services/mlService");

module.exports = {

  startInterview: async (req, res) => {
    try {
      const { role, level } = req.body;

      const questions = await generateQuestions(role, level);

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
      res.status(500).json({ error: "LLM failed" });
    }
  },

  submitAnswer: async (req, res) => {
    try {
      const { sessionId, answer } = req.body;

      const session = await Session.findOne({ sessionId });

      const index = session.answers.length;
      const question = session.questions[index];

      let result;

      if (question.type === "text") {
        result = await evaluateText(
          question.question,
          answer,
          question.modelAnswer
        );
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