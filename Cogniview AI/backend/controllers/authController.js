
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret123";

module.exports = {

  // ================= REGISTER =================
  register: async (req, res) => {
    try {
      let { name, email, password } = req.body;

      // ✅ VALIDATION
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "All fields are required"
        });
      }

      // ✅ CLEAN INPUTS
      name = name.trim();
      email = email.trim().toLowerCase();

      // ✅ PASSWORD CHECK
      if (password.length < 5) {
        return res.status(400).json({
          error: "Password must be at least 5 characters"
        });
      }

      // ✅ CHECK EXISTING USER
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(400).json({
          error: "User already exists"
        });
      }

      // ✅ HASH PASSWORD
      const hashed = await bcrypt.hash(password, 10);

      // ✅ CREATE USER
      const user = await User.create({
        name,
        email,
        password: hashed
      });

      // ✅ CREATE TOKEN
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ RESPONSE
      res.json({
        message: "User registered successfully",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });

    } catch (err) {
      console.error("REGISTER ERROR:", err.message);

      if (err.code === 11000) {
        return res.status(400).json({
          error: "Email already registered"
        });
      }

      res.status(500).json({
        error: "Register failed"
      });
    }
  },

  // ================= LOGIN =================
  login: async (req, res) => {
    try {
      let { email, password } = req.body;

      // ✅ VALIDATION
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password required"
        });
      }

      // ✅ NORMALIZE EMAIL
      email = email.trim().toLowerCase();

      // ✅ FIND USER
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          error: "User not found"
        });
      }

      // ✅ CHECK PASSWORD
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          error: "Wrong password"
        });
      }

      // ✅ TOKEN
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ RESPONSE
      res.json({
        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });

    } catch (err) {
      console.error("LOGIN ERROR:", err.message);

      res.status(500).json({
        error: "Login failed"
      });
    }
  }

};
