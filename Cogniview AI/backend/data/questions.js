module.exports = [
  // ================= DATA SCIENTIST =================

  // EASY
  {
    role: "data-scientist",
    type: "text",
    question: "What is overfitting?",
    difficulty: "easy",
    topic: "ML Basics"
  },
  {
    role: "data-scientist",
    type: "text",
    question: "What is underfitting?",
    difficulty: "easy",
    topic: "ML Basics"
  },
  {
    role: "data-scientist",
    type: "mcq",
    question: "Which technique helps reduce overfitting?",
    options: ["Regularization", "Noise", "More layers"],
    correctAnswer: "Regularization",
    difficulty: "easy",
    topic: "ML Basics"
  },

  // MEDIUM
  {
    role: "data-scientist",
    type: "text",
    question: "Explain bias-variance tradeoff",
    difficulty: "medium",
    topic: "Statistics"
  },
  {
    role: "data-scientist",
    type: "msq",
    question: "Select techniques to prevent overfitting",
    options: ["L1", "L2", "Dropout", "Increase layers"],
    correctAnswers: ["L1", "L2", "Dropout"],
    difficulty: "medium",
    topic: "ML Techniques"
  },
  {
    role: "data-scientist",
    type: "text",
    question: "What is cross-validation?",
    difficulty: "medium",
    topic: "Model Evaluation"
  },

  // HARD
  {
    role: "data-scientist",
    type: "text",
    question: "Explain gradient descent algorithm",
    difficulty: "hard",
    topic: "Optimization"
  },
  {
    role: "data-scientist",
    type: "text",
    question: "What is regularization and why is it used?",
    difficulty: "hard",
    topic: "ML Techniques"
  },

  // ================= BACKEND =================

  // EASY
  {
    role: "backend",
    type: "text",
    question: "What is middleware in Express?",
    difficulty: "easy",
    topic: "Node.js"
  },
  {
    role: "backend",
    type: "mcq",
    question: "Which method starts a server in Express?",
    options: ["listen()", "run()", "start()"],
    correctAnswer: "listen()",
    difficulty: "easy",
    topic: "Express"
  },
  {
    role: "backend",
    type: "mcq",
    question: "What does REST stand for?",
    options: [
      "Representational State Transfer",
      "Remote Execution",
      "Random System Type"
    ],
    correctAnswer: "Representational State Transfer",
    difficulty: "easy",
    topic: "API"
  },

  // MEDIUM
  {
    role: "backend",
    type: "text",
    question: "Explain event loop in Node.js",
    difficulty: "medium",
    topic: "Node.js"
  },
  {
    role: "backend",
    type: "msq",
    question: "Select features of Node.js",
    options: ["Single-threaded", "Blocking", "Event-driven"],
    correctAnswers: ["Single-threaded", "Event-driven"],
    difficulty: "medium",
    topic: "Node.js"
  },

  // HARD
  {
    role: "backend",
    type: "text",
    question: "Explain microservices architecture",
    difficulty: "hard",
    topic: "System Design"
  },
  {
    role: "backend",
    type: "text",
    question: "How does JWT authentication work?",
    difficulty: "hard",
    topic: "Authentication"
  }
];