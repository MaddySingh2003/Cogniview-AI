const express = require("express");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRouter");
const interviewRoutes = require("./routes/interviewRoutes");

connectDB();

const app = express();
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());

app.use("/", interviewRoutes);
app.use("/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server running on 3001 🚀");
});
fetch("https://generativelanguage.googleapis.com/v1/models", {
  headers: {
    "x-goog-api-key": process.env.GEMINI_API_KEY
  }
})
.then(res => res.json())
.then(console.log);
