const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


const JWT_SECRET="secret123";
module.exports={
     // ===== REGISTER =====
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // ✅ VALIDATION FIRST
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "All fields are required"
        });
      }

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
      await User.create({
        name,
        email,
        password: hashed
      });

      res.json({
        message: "User registered successfully"
      });

    } catch (err) {
      console.error("REGISTER ERROR:", err.message);

      // 🔥 HANDLE DUPLICATE KEY ERROR (important)
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
   login :async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    // ✅ NORMALIZE EMAIL (IMPORTANT BUG FIX)
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    // ✅ DEBUG (temporary)
    console.log("INPUT PASS:", password);
    console.log("DB HASH:", user.password);

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

    res.json({
      token
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({
      error: "Login failed"
    });
  }
}
}