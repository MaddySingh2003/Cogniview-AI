const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const interviewRoutes = require("./routes/interviewRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB
mongoose.connect(
  "mongodb+srv://admin:Milan2703%2E@ai-cluster.j2kcz2k.mongodb.net/ai-interview?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error(err);
  process.exit(1);
});

// ✅ ROUTES
app.use("/", interviewRoutes);

app.listen(3001, () => console.log("Server running on 3001"));