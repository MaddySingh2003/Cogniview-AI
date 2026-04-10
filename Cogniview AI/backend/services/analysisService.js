function analyzePerformance(answers) {
  const topicScores = {};

  answers.forEach(a => {
    if (!topicScores[a.topic]) {
      topicScores[a.topic] = [];
    }
    topicScores[a.topic].push(a.score);
  });

  const topicAvg = {};
  const weakAreas = [];

  for (let topic in topicScores) {
    const scores = topicScores[topic];
    const avg =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    topicAvg[topic] = Number(avg.toFixed(2));

    if (avg < 5) {
      weakAreas.push(topic);
    }
  }

  return { topicAvg, weakAreas };
}

module.exports = { analyzePerformance };