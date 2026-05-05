const { generateQuestions } = require("../services/llmService");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");
const { evaluateText } = require("../services/mlService");
const { extractText } = require("../services/resumeParser");
const { evaluateCode } = require("../services/codeEvaluate");
const { evaluateHR } = require("../services/mlService");

module.exports = {

  // ================= START =================
  startInterview: async (req, res) => {
    try {
      const { role, level, codingEnabled,hrMode } = req.body;
      const userId = req.user.userId;

      let resumeText = "";

      if (req.file) {
        try {
          resumeText = await extractText(req.file.buffer);

          if (!resumeText || resumeText.length < 50) {
            console.warn("⚠️ Resume too small");
            resumeText = "";
          }
        } catch {
          console.warn("Resume parsing failed");
          resumeText = "";
        }
      }

      let result;
      try {
        result = await generateQuestions(
          role,
          level,
          resumeText,
          codingEnabled === "true",
          hrMode === "true"
        );
      } catch (err) {
        console.error("LLM FAILED:", err.message);
        return res.status(500).json({ error: "AI generation failed" });
      }

      const session = new Session({
        sessionId: uuidv4(),
        userId,
        role,
        level,
        questions: result.questions,
        answers: []
      });

      await session.save();

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
          score: correct ? 10 : 0,
          feedback: correct
            ? ["Correct answer."]
            : ["Incorrect. Review this concept."]
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

        let feedback;

        if (score === 10) {
          feedback = ["All correct options selected."];
        } else if (score >= 5) {
          feedback = ["Partially correct. Review missed options."];
        } else {
          feedback = ["Incorrect. Review all correct options."];
        }

        result = { score, feedback };
      }

      // ===== CODE =====
     else if (question.type === "code") {
  result = {
    score: 0,
    feedback: ["Code will be evaluated after interview."]
  };
}
else if (question.type === "hr") {
  result = evaluateHR(answer);
}

      // ===== STORE ANSWER =====
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
  
liveEvaluate: async(req,res)=>{
    try{
      const {question, answer, modelAnswer} = req.body;
      if(!answer ||answer.length<5){
        return res.json({
score:0,
feedback:["Start typing your answer..."]
        });
      }
      const result=await evaluateText(
        question,
        answer,
        modelAnswer,
      );
      res.json(result);


    }
    catch(err){
      console.error("Live Eval Error:", err);
      res.status(500).json({
        score:0,
        feedback:["Evaluation failed. Try again later."]
      });
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

  // ================= CODE EVALUATION =================
for (let ans of session.answers) {
  const q = session.questions.find(q => q.id === ans.questionId);

  if (q?.type === "code") {
    if (!q.expectedOutput) {
      ans.score = 2;
      ans.feedback = ["Expected output missing. Cannot evaluate code."];
      continue;
    }

    const language = q.question.toLowerCase().includes("python")
      ? "python"
      : "javascript";

    const evalResult = await evaluateCode(
      ans.answer,
      q.expectedOutput,
      language
    );

    ans.score = evalResult.score;
    ans.feedback = evalResult.feedback;
  }
}

// NOW calculate scores AFTER evaluation
const scores = session.answers.map(a => a.score || 0);
      const avg =
        scores.reduce((a, b) => a + b, 0) / scores.length;

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