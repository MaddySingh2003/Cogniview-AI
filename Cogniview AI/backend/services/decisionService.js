function getHiringDecision(scores, weakAreas) {
  const avg =
    scores.reduce((a, b) => a + b, 0) / scores.length;

  const variance =
    scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) /
    scores.length;

  let probability = avg * 10;

  // 🔥 penalties
  if (variance > 6) probability -= 10;
  if (weakAreas.length >= 2) probability -= 10;

  // 🔥 bonuses
  if (avg > 8) probability += 5;

  probability = Math.max(0, Math.min(100, probability));

  // ===== VERDICT =====
  let verdict = "Reject";
  let decision = "Revise fundamentals";

  if (probability > 75) {
    verdict = "Strong Hire";
    decision = "Ready for hiring";
  } else if (probability > 55) {
    verdict = "Borderline";
    decision = "Improve weak areas";
  } else {
    verdict = "Reject";
    decision = "Needs significant improvement";
  }

  return {
    probability: Math.round(probability),
    verdict,
    decision
  };
}

module.exports = { getHiringDecision };