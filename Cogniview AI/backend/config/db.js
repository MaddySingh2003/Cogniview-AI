const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
  "mongodb+srv://admin:Milan2703%2E@ai-cluster.j2kcz2k.mongodb.net/ai-interview?retryWrites=true&w=majority"
);

    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
