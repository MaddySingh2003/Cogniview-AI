module.exports = [
  // ================= DATA SCIENTIST =================
  {
    role: "data-scientist",
    type: "text",
    question: "What is overfitting?",
    difficulty: "easy"
  },
  {
    role: "data-scientist",
    type: "text",
    question: "Explain bias-variance tradeoff",
    difficulty: "medium"
  },

  // ================= BACKEND =================
  {
    role: "backend",
    type: "text",
    question: "What is middleware in Express?",
    difficulty: "easy"
  },
  {
    role: "backend",
    type: "mcq",
    question: "Which method is used to create server in Express?",
    options: ["createServer()", "express()", "listen()"],
    correctAnswer: "express()",
    difficulty: "easy"
  },
  {
    role: "backend",
    type: "text",
    question: "Explain event loop in Node.js",
    difficulty: "medium"
  },
  {
    role: "backend",
    type: "msq",
    question: "Select Node.js features",
    options: ["Single-threaded", "Blocking", "Event-driven"],
    correctAnswers: ["Single-threaded", "Event-driven"],
    difficulty: "medium"
  },
  {
    role: "backend",
    type: "text",
    question: "What is microservices architecture?",
    difficulty: "hard"
  }
];