const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  startInterview: async (req, res) => {
    try {
      const { role, level } = req.body;

      const questions = await generateQuestions(role, level);

      const session = new Session({
        sessionId: uuidv4(),
        role,
        level,
        questions
      });

      await session.save();

      res.json({
  sessionId: session.sessionId,
  question: questions,
  totalQuestions: questions.length
});

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "LLM failed" });
    }
  }
};