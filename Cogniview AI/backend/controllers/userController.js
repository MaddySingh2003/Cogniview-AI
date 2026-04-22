const Session=require("../models/Session");

module.exports={
   getHistory: async (req, res) => {
  try {
    const userId = req.user.userId;

    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("sessionId role level createdAt");

    res.json(sessions);

  } catch (err) {
    res.status(500).json({ error: "History failed" });
  }
}
}