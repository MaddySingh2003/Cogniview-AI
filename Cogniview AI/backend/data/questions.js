module.exports = [
  // ===== EASY =====
  {
    role: "data-scientist",
    type: "text",
    question: "What is overfitting?",
    difficulty: "easy"
  },
  {
    role: "data-scientist",
    type: "text",
    question: "What is underfitting?",
    difficulty: "easy"
  },
  {
    role: "data-scientist",
    type: "mcq",
    question: "Which technique reduces overfitting?",
    options: ["Regularization", "More layers", "Less data"],
    correctAnswer: "Regularization",
    difficulty: "easy"
  },

  // ===== MEDIUM =====
  {
    role: "data-scientist",
    type: "text",
    question: "Explain bias vs variance",
    difficulty: "medium"
  },
  {
    role: "data-scientist",
    type: "msq",
    question: "Select methods to prevent overfitting",
    options: ["Dropout", "Regularization", "Cross-validation", "More noise"],
    correctAnswers: ["Dropout", "Regularization", "Cross-validation"],
    difficulty: "medium"
  },

  // ===== HARD =====
  {
    role: "data-scientist",
    type: "text",
    question: "Explain cross-validation in detail",
    difficulty: "hard"
  }
];