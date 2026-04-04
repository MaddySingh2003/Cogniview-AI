const express =require("express");
const cors=require("cors");
const axios=require("axios");


const app =express();
app.use(cors());
app.use(express.json());


app.post("/evaluate", async (req, res) => {
  const { question, answer } = req.body;

  try {
    const response = await axios.post("http://localhost:8001/evaluate", {
      question,
      answer,
    });

    // ✅ ONLY ONE RESPONSE
    return res.json(response.data);

  } catch (error) {
    console.error(error.message);

    // ✅ RETURN prevents double send
    return res.status(500).json({
      error: "ML service error",
    });
  }
});

app.listen(3001,()=>console.log("Backend running port 3001"));