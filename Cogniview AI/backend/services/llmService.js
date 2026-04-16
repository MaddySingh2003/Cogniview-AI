const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestions(role, level) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash" // this works ONLY here
    });

    const prompt = `
You are an expert interviewer.

Generate EXACTLY 15 interview questions.

Role: ${role}
Level: ${level}

Rules:
- 5 text (modelAnswer + topic)
- 5 mcq (options + correctAnswer)
- 5 msq (options + correctAnswers)

Return ONLY valid JSON array.
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    // clean JSON
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON");
    }

    const parsed = JSON.parse(cleaned.slice(start, end + 1));

    if (!Array.isArray(parsed) || parsed.length !== 15) {
      throw new Error("Invalid question count");
    }

    return parsed;

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err.message);

    return [
      ...Array(5).fill({
        type: "text",
        question: "Explain core concept",
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