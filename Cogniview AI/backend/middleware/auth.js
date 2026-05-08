
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

module.exports = (req, res, next) => {
  try {

    // ================= AUTH HEADER =================
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token missing"
      });
    }

    // ================= FORMAT CHECK =================
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format"
      });
    }

    // ================= TOKEN =================
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Token missing"
      });
    }

    // ================= VERIFY =================
    const decoded = jwt.verify(token, JWT_SECRET);

    // ================= USER =================
    req.user = {
      userId: decoded.userId
    };

    next();

  } catch (err) {

    console.error("AUTH ERROR:", err.message);

    // JWT EXPIRED
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired"
      });
    }

    // INVALID TOKEN
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token"
      });
    }

    // GENERIC
    return res.status(500).json({
      error: "Authentication failed"
    });
  }
};
