///auth.js///


const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret123";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ FIX HERE
    req.user = decoded; 

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};