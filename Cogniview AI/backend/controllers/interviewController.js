////interviewController.js///



const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");
const { evaluateText } = require("../services/mlService");
const odfParser=require("pdf-parse");
const { extractText } = require("../services/resumeParser");


module.exports = {

  // ================= START =================
 
startInterview: async (req, res) => {
  try {
    const { role, level } = req.body;
    const userId = req.user.userId;

    let resumeText = "";

    // ✅ HANDLE OPTIONAL RESUME
    if (req.file) {
      console.log("📄 Resume uploaded");

      resumeText = await extractText(req.file.buffer);

      if (!resumeText || resumeText.length < 50) {
        console.warn("⚠️ Resume too small or empty");
        resumeText = "";
      }
    }

    // ✅ PASS RESUME TEXT
    const result = await generateQuestions(
      role,
      level,
      resumeText
    );

    const session = new Session({
      sessionId: uuidv4(),
      userId,
      role,
      level,
      questions: result.questions,
      answers: []
    });

    await session.save();

    // ✅ KEEP ONLY LAST 5
    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 });

    if (sessions.length > 5) {
      const extra = sessions.slice(5);
      await Session.deleteMany({
        _id: { $in: extra.map(s => s._id) }
      });
    }

    res.json({
      sessionId: session.sessionId,
      question: result.questions[0],
      totalQuestions: result.questions.length
    });

  } catch (err) {
    console.error("START ERROR:", err);
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

      // ✅ CRITICAL FIX
      if (!question) {
        return res.status(400).json({
          error: "No more questions"
        });
      }

      // ✅ VALIDATE ANSWER
      if (
        answer === undefined ||
        answer === null ||
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        return res.status(400).json({
          error: "Answer cannot be empty"
        });
      }

      let result;

      // ===== TEXT =====
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
          feedback: correct
            ? ["Correct answer"]
            : ["Incorrect, revise concept"]
        };
      }

      // ===== MSQ =====
      else if (question.type === "msq") {
        const selected = Array.isArray(answer) ? answer : [];
        const correct = question.correctAnswers || [];

        const match = selected.filter(a => correct.includes(a)).length;

        const score =
          correct.length === 0
            ? 0
            : Math.round((match / correct.length) * 10);

        result = {
          score,
          feedback: ["Partial correctness"]
        };
      }

      // ✅ FIX: store array safely
      const storedAnswer = Array.isArray(answer)
        ? answer.join(", ")
        : answer;

      session.answers.push({
        questionId: question.id,
        question: question.question,
        answer: storedAnswer,
        score: result.score,
        feedback: result.feedback,
        topic: question.topic
      });

      await session.save();

      const nextQuestion = session.questions[index + 1];

      res.json({
        result,
        nextQuestion: nextQuestion || null,
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
       sessionId: req.params.sessionId,
  userId: req.user.userId //
      });

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      if (!session.answers.length) {
        return res.json({
          averageScore: 0,
          answers: [],
          weakAreas: ["No answers"],
          strongAreas: [],
          verdict: "No Data"
        });
      }

      const scores = session.answers.map(a => a.score || 0);

      const avg =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      // ===== TOPIC ANALYSIS =====
      const topicMap = {};

      session.answers.forEach(a => {
        const topic = a.topic || "General";

        if (!topicMap[topic]) topicMap[topic] = [];
        topicMap[topic].push(a.score);
      });

      const weakAreas = [];
      const strongAreas = [];

      for (let topic in topicMap) {
        const tAvg =
          topicMap[topic].reduce((a, b) => a + b, 0) /
          topicMap[topic].length;

        if (tAvg <= 4) weakAreas.push(topic);
        else if (tAvg >= 6) strongAreas.push(topic);
      }

      if (!weakAreas.length) weakAreas.push("General");
      if (!strongAreas.length && avg > 5)
        strongAreas.push("Basic Concepts");

      let verdict = "Needs Improvement";
      if (avg >= 7) verdict = "Strong Candidate";
      else if (avg >= 5) verdict = "Average Candidate";

      res.json({
        averageScore: avg.toFixed(2),
        answers: session.answers,
        weakAreas,
        strongAreas,
        verdict
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Result failed" });
    }
  }
};const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");
const { evaluateText } = require("../services/mlService");
const { extractText } = require("../services/resumeParser");

module.exports = {

  // ================= START =================
  startInterview: async (req, res) => {
    try {
      const { role, level } = req.body;
      const userId = req.user.userId;

      let resumeText = "";

      // ✅ HANDLE RESUME (optional)
      if (req.file) {
        try {
          resumeText = await extractText(req.file.buffer);

          if (!resumeText || resumeText.length < 50) {
            console.warn("⚠️ Resume too small");
            resumeText = "";
          }
        } catch (err) {
          console.warn("Resume parsing failed");
          resumeText = "";
        }
      }

      // ✅ GENERATE QUESTIONS
      let result;
      try {
        result = await generateQuestions(role, level, resumeText);
      } catch (err) {
        console.error("LLM FAILED:", err.message);
        return res.status(500).json({ error: "AI generation failed" });
      }

      // ✅ CREATE SESSION
      const session = new Session({
        sessionId: uuidv4(),
        userId,
        role,
        level,
        questions: result.questions,
        answers: []
      });

      await session.save();

      // ❌ REMOVED: auto delete last 5 (conflicts with 30-day TTL)

      res.json({
        sessionId: session.sessionId,
        question: result.questions[0],
        totalQuestions: result.questions.length
      });

    } catch (err) {
      console.error("START ERROR:", err);
      res.status(500).json({ error: "Start failed" });
    }
  },

  // ================= ANSWER =================
  submitAnswer: async (req, res) => {
    try {
      const { sessionId, answer } = req.body;
      const userId = req.user.userId;

      // ✅ SECURE FETCH (CRITICAL FIX)
      const session = await Session.findOne({
        sessionId,
        userId
      });

      if (!session) {
        return res.status(400).json({ error: "Session not found" });
      }

      const index = session.answers.length;
      const question = session.questions[index];

      if (!question) {
        return res.status(400).json({
          error: "No more questions"
        });
      }

      // ✅ VALIDATION
      if (
        answer === undefined ||
        answer === null ||
        (typeof answer === "string" && answer.trim() === "") ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        return res.status(400).json({
          error: "Answer cannot be empty"
        });
      }

      let result;

      // ===== TEXT =====
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
          feedback: correct
            ? ["Correct answer"]
            : ["Incorrect, revise concept"]
        };
      }

      // ===== MSQ =====
      else if (question.type === "msq") {
        const selected = Array.isArray(answer) ? answer : [];
        const correct = question.correctAnswers || [];

        const match = selected.filter(a => correct.includes(a)).length;

        const score =
          correct.length === 0
            ? 0
            : Math.round((match / correct.length) * 10);

        result = {
          score,
          feedback: ["Partial correctness"]
        };
      }

      // ✅ STORE ANSWER CLEANLY
      const storedAnswer = Array.isArray(answer)
        ? answer.join(", ")
        : answer;

      session.answers.push({
        questionId: question.id,
        question: question.question,
        answer: storedAnswer,
        score: result.score,
        feedback: result.feedback,
        topic: question.topic
      });

      await session.save();

      const nextQuestion = session.questions[index + 1];

      res.json({
        result,
        nextQuestion: nextQuestion || null,
        isFinished: index + 1 >= session.questions.length
      });

    } catch (err) {
      console.error("ANSWER ERROR:", err);
      res.status(500).json({ error: "Answer failed" });
    }
  },

  // ================= RESULT =================
  getResult: async (req, res) => {
    try {
      const session = await Session.findOne({
        sessionId: req.params.sessionId,
        userId: req.user.userId
      });

      if (!session) {
        return res.status(404).json({
          error: "Session not found"
        });
      }

      if (!session.answers.length) {
        return res.json({
          averageScore: 0,
          answers: [],
          weakAreas: ["No answers"],
          strongAreas: [],
          verdict: "No Data"
        });
      }

      const scores = session.answers.map(a => a.score || 0);

      const avg =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      // ===== TOPIC ANALYSIS =====
      const topicMap = {};

      session.answers.forEach(a => {
        const topic = a.topic || "General";

        if (!topicMap[topic]) topicMap[topic] = [];
        topicMap[topic].push(a.score);
      });

      const weakAreas = [];
      const strongAreas = [];

      for (let topic in topicMap) {
        const tAvg =
          topicMap[topic].reduce((a, b) => a + b, 0) /
          topicMap[topic].length;

        if (tAvg <= 4) weakAreas.push(topic);
        else if (tAvg >= 6) strongAreas.push(topic);
      }

      if (!weakAreas.length) weakAreas.push("General");
      if (!strongAreas.length && avg > 5)
        strongAreas.push("Basic Concepts");

      let verdict = "Needs Improvement";
      if (avg >= 7) verdict = "Strong Candidate";
      else if (avg >= 5) verdict = "Average Candidate";

      res.json({
        averageScore: avg.toFixed(2),
        answers: session.answers,
        weakAreas,
        strongAreas,
        verdict
      });

    } catch (err) {
      console.error("RESULT ERROR:", err);
      res.status(500).json({ error: "Result failed" });
    }
  }
};