const questionBank = require("../data/questions");

const difficultyOrder = ["easy", "medium", "hard"];

function getNextQuestion(session, lastScore) {
  let index = difficultyOrder.indexOf(session.currentDifficulty || "easy");

  if (lastScore >= 7 && index < 2) index++;
  else if (lastScore < 4 && index > 0) index--;

  const nextDifficulty = difficultyOrder[index];

  let available = questionBank.filter(q =>
    q.role === session.role &&
    q.difficulty === nextDifficulty &&
    !session.askedQuestions.includes(q.question)
  );

  // fallback
  if (available.length === 0) {
    available = questionBank.filter(q =>
      q.role === session.role &&
      !session.askedQuestions.includes(q.question)
    );
  }

  if (available.length === 0) return null;

  return available[Math.floor(Math.random() * available.length)];
}

// ✅ CORRECT EXPORT
module.exports = { getNextQuestion };