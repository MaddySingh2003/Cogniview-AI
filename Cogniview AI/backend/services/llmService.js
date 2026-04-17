require("dotenv").config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const HF_KEY = process.env.HUGGINGFACE_API_KEY;

const GEMINI_MODEL = "gemini-2.5-flash";
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

// ================= STRICT PROMPT =================
function buildPrompt(role, level) {
  return `
You are an AI interviewer.

Generate EXACTLY 15 questions in STRICT JSON format.

Role: ${role}
Level: ${level}

RULES:
- Return ONLY JSON (no text, no explanation)
- Must be ARRAY of 15 objects

STRUCTURE:

TEXT:
{
  "type": "text",
  "question": "...",
  "modelAnswer": "...",
  "topic": "...",
  "difficulty": "${level}"
}

MCQ:
{
  "type": "mcq",
  "question": "...",
  "options": ["A","B","C","D"],
  "correctAnswer": "A"
}

MSQ:
{
  "type": "msq",
  "question": "...",
  "options": ["A","B","C","D"],
  "correctAnswers": ["A","C"]
}

DISTRIBUTION:
- 5 text
- 5 mcq
- 5 msq
`;
}

// ================= PARSER =================
function safeParse(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("JSON not found");
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  if (!Array.isArray(parsed) || parsed.length !== 15) {
    throw new Error("Invalid count");
  }

  return parsed;
}

// ================= NORMALIZER =================
function normalizeQuestions(questions, level) {
  return questions.map((q, i) => {
    return {
      id: i + 1,
      type: q.type || "text",
      question: q.question || "Sample question",
      modelAnswer: q.modelAnswer || "",
      topic: q.topic || "General",
      difficulty: q.difficulty || level,
      options: q.options || [],
      correctAnswer: q.correctAnswer || null,
      correctAnswers: q.correctAnswers || []
    };
  });
}

// ================= GEMINI =================
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}`);

  const data = await res.json();

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("No response");

  return safeParse(text);
}

// ================= HF =================
async function callHF(prompt) {
  const res = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  const data = await res.json();

  if (data.error) throw new Error(data.error);

  return safeParse(data[0]?.generated_text);
}

// ================= FALLBACK =================
function fallback(role, level) {
  return normalizeQuestions(
    [
      ...Array(5).fill({
        type: "text",
        question: `Explain ${role}`,
        modelAnswer: "Fallback answer"
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
    ],
    level
  );
}

// ================= MAIN =================
async function generateQuestions(role, level) {
  const prompt = buildPrompt(role, level);

  try {
    console.log("⚡ Gemini...");
    const q = await callGemini(prompt);
    return { questions: normalizeQuestions(q, level), source: "gemini" };

  } catch (err) {
    console.warn("Gemini failed:", err.message);
  }

  try {
    console.log("⚡ HF...");
    const q = await callHF(prompt);
    return { questions: normalizeQuestions(q, level), source: "hf" };

  } catch (err) {
    console.warn("HF failed:", err.message);
  }

  console.log("⚠️ fallback...");
  return { questions: fallback(role, level), source: "fallback" };
}

module.exports = { generateQuestions };