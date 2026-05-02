require("dotenv").config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const HF_KEY = process.env.HUGGINGFACE_API_KEY;

// 🔥 MODEL CHAIN
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash"
];

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

// ================= PROMPT =================
function buildPrompt(role, level, type) {
  return `
  Act like a interviewer,
Generate EXACTLY 5 ${type.toUpperCase()} interview questions.

Role: ${role}
Level: ${level}

RULES:
- Return ONLY JSON array
- EXACTLY 5 questions
- Each MUST include "topic" (1-2 words, like API, DB, Auth)

FORMAT:

TEXT:
{
 "type":"text",
 "question":"...",
 "modelAnswer":"...",
 "topic":"..."
}

MCQ:
{
 "type":"mcq",
 "question":"...",
 "options":["A","B","C","D"],
 "correctAnswer":"A",
 "topic":"..."
}

MSQ:
{
 "type":"msq",
 "question":"...",
 "options":["A","B","C","D"],
 "correctAnswers":["A","C"],
 "topic":"..."
}
`;
}

// ================= PARSE =================
function safeParse(text) {
  const clean = text.replace(/```json|```/g, "").trim();

  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");

  if (start === -1 || end === -1) throw new Error("Invalid JSON");

  return JSON.parse(clean.slice(start, end + 1));
}

// ================= VALIDATION =================
function validate(qs) {
  if (!Array.isArray(qs) || qs.length !== 5)
    throw new Error("Invalid count");

  qs.forEach(q => {
    if (!q.question) throw new Error("Missing question");
    if (!q.topic || q.topic.length < 2)
      throw new Error("Missing topic");
  });

  return qs;
}

// ================= NORMALIZE =================
function normalize(qs, level, offset = 0) {
  return qs.map((q, i) => ({
    id: offset + i + 1,
    type: q.type || "text",
    question: q.question,
    modelAnswer: q.modelAnswer || "",
    topic: q.topic, // 🔥 NO "General"
    difficulty: level,
    options: q.options || [],
    correctAnswer: q.correctAnswer || null,
    correctAnswers: q.correctAnswers || []
  }));
}

// ================= GEMINI =================
async function callGemini(prompt, model) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!res.ok) throw new Error(`${model} ${res.status}`);

  const data = await res.json();

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty Gemini response");

  return validate(safeParse(text));
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
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 700,
          temperature: 0.3
        }
      })
    }
  );

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json"))
    throw new Error("HF HTML");

  const data = await res.json();

  if (data.error) throw new Error(data.error);

  const text = data[0]?.generated_text;

  if (!text) throw new Error("Empty HF");

  return validate(safeParse(text));
}

// ================= GENERATE BLOCK =================
async function generateBlock(prompt) {
  // 🔥 GEMINI FIRST
  for (let model of GEMINI_MODELS) {
    try {
      console.log(`⚡ Gemini → ${model}`);
      return await callGemini(prompt, model);
    } catch (err) {
      console.warn(`❌ ${model}`, err.message);
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // 🔥 HF FALLBACK
  try {
    console.log("⚡ HF fallback...");
    return await callHF(prompt);
  } catch (err) {
    console.warn("❌ HF failed:", err.message);
  }

  throw new Error("All LLM providers failed");
}

// ================= MAIN =================
async function generateQuestions(role, level) {
  try {
    const textQ = await generateBlock(buildPrompt(role, level, "text"));
    const mcqQ = await generateBlock(buildPrompt(role, level, "mcq"));
    const msqQ = await generateBlock(buildPrompt(role, level, "msq"));

    const all = [
      ...normalize(textQ, level, 0),
      ...normalize(mcqQ, level, 5),
      ...normalize(msqQ, level, 10)
    ];

    return { questions: all, source: "llm" };

  } catch (err) {
    console.error("🔥 HARD FAIL:", err.message);
    throw new Error("AI service busy, try again");
  }
}

module.exports = { generateQuestions };