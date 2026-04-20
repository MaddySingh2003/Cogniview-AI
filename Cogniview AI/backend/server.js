const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRouter");
const interviewRoutes = require("./routes/interviewRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", interviewRoutes);
app.use("/auth", authRoutes);

app.listen(3001, () => {
  console.log("Server running on 3001 🚀");
});