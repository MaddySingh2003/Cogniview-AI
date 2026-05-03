//mlService.js///

const axios = require("axios");

function generateFeedback({ answer, modelAnswer, score, semantic }) {
  const feedback = [];

  const cleanAnswer = answer.toLowerCase().trim();

  // ❌ Completely irrelevant / gibberish
  if (cleanAnswer.length < 5 || !/[a-zA-Z]/.test(cleanAnswer)) {
    return [
      "Answer appears invalid or meaningless.",
      "Please provide a clear and structured explanation."
    ];
  }

  // 🔥 Strong semantic-based feedback
  if (semantic < 0.3) {
    feedback.push(
      "Your answer does not address the question correctly."
    );
    feedback.push(
      "Revise the core concept and try again with a clear explanation."
    );
  } 
  else if (semantic < 0.6) {
    feedback.push(
      "Partial understanding, but key concepts are missing."
    );
  } 
  else {
    feedback.push(
      "Good understanding of the concept."
    );
  }

  // 🔥 Compare with model answer (better logic)
  if (modelAnswer) {
    const importantWords = modelAnswer
      .toLowerCase()
      .split(" ")
      .filter(w => w.length > 4);

    const matchCount = importantWords.filter(w =>
      cleanAnswer.includes(w)
    ).length;

    const ratio = matchCount / importantWords.length;

    if (ratio < 0.2) {
      feedback.push(
        "Missing key technical terms from the expected answer."
      );
    } else if (ratio > 0.5) {
      feedback.push(
        "Covers important technical points well."
      );
    }
  }

  // 🔥 Score-based clarity
  if (score >= 8) {
    feedback.push("Strong answer.");
  } else if (score >= 5) {
    feedback.push("Average answer. Add more depth.");
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