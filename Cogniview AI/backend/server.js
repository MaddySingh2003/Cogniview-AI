const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const interviewRoutes = require("./routes/interviewRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", interviewRoutes);

app.listen(3001, () => console.log("Server running on 3001"));