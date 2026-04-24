const axios = require("axios");

function generateFeedback({ answer, modelAnswer, score, semantic }) {
  const feedback = [];

  if (answer.length < 20) {
    feedback.push("Answer is too short. Add more explanation.");
  }

  if (semantic < 0.4) {
    feedback.push("Answer is not aligned with the question.");
  } else if (semantic < 0.7) {
    feedback.push("Partial understanding. Missing key concepts.");
  } else {
    feedback.push("Good conceptual understanding.");
  }

  const keywords = modelAnswer
    ? modelAnswer.toLowerCase().split(" ").slice(0, 10)
    : [];

  const matchCount = keywords.filter(k =>
    answer.toLowerCase().includes(k)
  ).length;

  if (keywords.length > 0) {
    const ratio = matchCount / keywords.length;

    if (ratio < 0.3) {
      feedback.push("Missing important technical keywords.");
    } else if (ratio > 0.6) {
      feedback.push("Covers important concepts well.");
    }
  }

  if (score >= 8) {
    feedback.push("Strong answer.");
  } else if (score >= 5) {
    feedback.push("Average answer. Improve clarity.");
  } else {
    feedback.push("Weak answer. Needs improvement.");
  }

  return feedback;
}

async function evaluateText(question, answer, modelAnswer) {
  try {
    const res = await axios.post("http://localhost:8000/predict", {
      question,
      answer,
      model_answer: modelAnswer   // ✅ FIXED
    });

    const data = res.data;

    const score = Math.round(data.final_score * 10);

    const feedback = generateFeedback({
      answer,
      modelAnswer,
      score,
      semantic: data.semantic_score
    });

    return {
      score,
      feedback,
      confidence: data.final_score
    };

  } catch (err) {
    console.error("ML ERROR", err.response?.data || err.message);

    return {
      score: 5,
      feedback: ["Fallback evaluation (ML failed)"]
    };
  }
}

module.exports = { evaluateText };