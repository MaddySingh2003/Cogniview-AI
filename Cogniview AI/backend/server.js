// const express =require("express");
// const cors=require("cors");
// const axios=require("axios");
// const sessions={};

// const app =express();


// app.use(cors());
// app.use(express.json());


// app.post("/evaluate", async (req, res) => {
//   const { question, answer } = req.body;

//   try {
//     const response = await axios.post("http://localhost:8001/evaluate", {
//       question,
//       answer,
//     });

//     // ✅ ONLY ONE RESPONSE
//     return res.json(response.data);

//   } catch (error) {
//     console.error(error.message);

//     // ✅ RETURN prevents double send
//     return res.status(500).json({
//       error: "ML service error",
//     });
//   }
// });


// app.post("/start", (req, res) => {
//   const sessionId = Date.now().toString(); // ✅ FIXED

//   const questions = [
//     "What is overfitting?",
//     "What is underfitting?",
//     "Explain bias vs variance"
//   ];

//   sessions[sessionId] = {
//     questions,
//     answers: []
//   };

//   res.json({
//     sessionId,
//     questions
//   });
// });

// app.post("/answer", async (req, res) => {
//   const { sessionId, question, answer } = req.body;

//   if (!sessions[sessionId]) {
//     return res.status(400).json({ error: "Invalid session" });
//   }

//   try {
//     const response = await axios.post("http://localhost:5000/evaluate", {
//       question,
//       answer
//     });

//     const result = response.data;

//     sessions[sessionId].answers.push({
//       question,
//       answer,
//       score: result.score,
//       feedback: result.feedback
//     });

//     res.json(result);

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Evaluation failed" });
//   }
// });

// app.get("/result/:sessionId", (req, res) => {
//     const { sessionId } = req.params;

//   const session = sessions[sessionId];

//   if (!session) {
//     return res.status(404).json({ error: "Session not found" });
//   }
//   const scores = session.answers.map(a => a.score);
//   const avg =
//   score.length>0
//    ? scores.reduce((a, b) => a + b, 0) / scores.length
//    :0;

//   res.json({
//     averageScore: avg.toFixed(2),
//     totalQuestions: session.questions.length,
//     answers: session.answers
//   });
// })


// app.listen(3001,()=>console.log("Backend running port 3001"));
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const sessions = {};

// ✅ START
app.post("/start", (req, res) => {
  const sessionId = Date.now().toString();

  const questions = [
    "What is overfitting?",
    "What is underfitting?",
    "Explain bias vs variance"
  ];

  sessions[sessionId] = {
    questions,
    answers: []
  };

  res.json({ sessionId, questions });
});

// ✅ ANSWER
app.post("/answer", async (req, res) => {
  const { sessionId, question, answer } = req.body;

  if (!sessions[sessionId]) {
    return res.status(400).json({ error: "Invalid session" });
  }

  try {
    const response = await axios.post("http://localhost:8001/evaluate", {
      question,
      answer
    });

    const result = response.data;

    sessions[sessionId].answers.push({
      question,
      answer,
      score: result.score,
      feedback: result.feedback
    });

    res.json(result);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

// ✅ RESULT
app.get("/result/:sessionId", (req, res) => {
  const { sessionId } = req.params;

  const session = sessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  const scores = session.answers.map(a => a.score);
  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

  res.json({
    averageScore: Number(avg.toFixed(2)),
    totalQuestions: session.questions.length,
    answers: session.answers
  });
});

app.listen(3001, () => console.log("Backend running on 3001"));