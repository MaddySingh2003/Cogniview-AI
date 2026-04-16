require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

// 🔁 retry function
async function callGeminiWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);

      if (res.ok) {
        return await res.json();
      }

      console.warn(`Retry ${i + 1} failed`);
    } catch (err) {
      console.warn(`Error attempt ${i + 1}:`, err.message);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  throw new Error("Gemini failed after retries");
}

async function generateQuestions(role, level) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt = `
You are a strict JSON generator.

Generate EXACTLY 15 interview questions.

Role: ${role}
Level: ${level}

Rules:
- 5 text (modelAnswer + topic)
- 5 mcq (options + correctAnswer)
- 5 msq (options + correctAnswers)
- Return ONLY JSON array
`;

    const data = await callGeminiWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No response text");

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON format");
    }

    const parsed = JSON.parse(cleaned.slice(start, end + 1));

    // ✅ Validate
    if (!Array.isArray(parsed) || parsed.length !== 15) {
      throw new Error("Invalid question count");
    }

    return parsed;

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.message);

    console.log("⚠️ Using fallback questions...");

    return [
      ...Array(5).fill({
        type: "text",
        question: `Explain ${role} concept`,
        modelAnswer: "Fallback answer",
        topic: role,
        difficulty: level
      }),
      ...Array(5).fill({
        type: "mcq",
        question: "Sample MCQ",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A"
      }),
      ...Array(5).fill({
        type: "msq",
        question: "Sample MSQ",
        options: ["A", "B", "C", "D"],
        correctAnswers: ["A", "C"]
      })
    ];
  }
}

module.exports = { generateQuestions };