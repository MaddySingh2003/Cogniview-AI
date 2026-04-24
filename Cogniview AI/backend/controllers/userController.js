const Session = require("../models/Session");

module.exports = {

  getHistory: async (req, res) => {
    try {
      const userId = req.user.userId;

      const sessions = await Session.find({ userId })
        .sort({ createdAt: -1 });

      const formatted = sessions.map((session) => {

        if (!session.answers || session.answers.length === 0) {
          return {
            role: session.role,
            level: session.level,
            createdAt: session.createdAt,
            averageScore: 0,
            strongAreas: [],
            weakAreas: []
          };
        }

        // ===== AVG SCORE =====
        const scores = session.answers.map(a => a.score || 0);

        const avg =
          scores.reduce((a, b) => a + b, 0) / scores.length;

        // ===== TOPIC ANALYSIS =====
        const topicMap = {};

        session.answers.forEach(a => {
          const topic = a.topic || "General";

          if (!topicMap[topic]) topicMap[topic] = [];
          topicMap[topic].push(a.score || 0);
        });

        const strong = [];
        const weak = [];

        for (let t in topicMap) {
          const tAvg =
            topicMap[t].reduce((a, b) => a + b, 0) /
            topicMap[t].length;

          if (tAvg >= 6) strong.push(t);
          else if (tAvg <= 4) weak.push(t);
        }

        return {
          role: session.role,
          level: session.level,
          createdAt: session.createdAt,
          averageScore: Number(avg.toFixed(2)),
          strongAreas: strong,
          weakAreas: weak
        };
      });

      res.json(formatted);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "History failed" });
    }
  }

};