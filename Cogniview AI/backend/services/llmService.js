require("dotenv").config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const HF_KEY = process.env.HUGGINGFACE_API_KEY;

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash"
];

const HF_MODEL = "HuggingFaceH4/zephyr-7b-beta";
// ================= PROMPT =================
function buildPrompt(role, level, resumeText = "", codingEnabled = false) {
  return `
You are an AI interviewer.

Generate EXACTLY 15 questions in STRICT JSON ARRAY.

Each object MUST follow this schema:

{
  "type": "text | mcq | msq | code",
  "question": "string",
  "topic": "string",
  "difficulty": "${level}",
  "options": ["string"],        // for mcq/msq only
  "correctAnswer": "string",    // for mcq only
  "correctAnswers": ["string"], // for msq only
  "modelAnswer": "string",      // for text
  "constraints": "string",      // for code
  "example": "string"           // for code
}

Rules:
- ALWAYS include "topic"
- ALWAYS include correctAnswer / correctAnswers when needed
- No explanation
- Return ONLY JSON array
- No markdown
- No backticks

Role: ${role}
Level: ${level}

${resumeText ? `Resume:\n${resumeText}` : ""}

${codingEnabled ? "Include EXACTLY 3 CODE questions" : ""}

`;
}

// ================= PARSE =================
function safeParse(text) {
  const clean = text.replace(/```json|```/g, "").trim();

  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON format");
  }

  return JSON.parse(clean.slice(start, end + 1));
}

// ================= VALIDATION =================
function validate(qs, expectedCount) {
  if (!Array.isArray(qs) || qs.length !== expectedCount) {
    throw new Error("Invalid question count");
  }

  qs.forEach(q => {
    if (!q.question) throw new Error("Missing question");
    if (!q.topic) throw new Error("Missing topic");
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
    topic: q.topic || "General",
    difficulty: level,

    options: q.options || [],
    correctAnswer: q.correctAnswer || null,
    correctAnswers: q.correctAnswers || [],

    // 🔥 CODE SUPPORT
    constraints: q.constraints || "",
    example: q.example || ""
  }));
}

// ================= GEMINI =================
async function callGemini(prompt, model, expectedCount, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`⚡ Gemini → ${model} (try ${i + 1})`);

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

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${model} ${res.status} → ${errText}`);
      }

      const data = await res.json();

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Empty Gemini response");

      return validate(safeParse(text), expectedCount);

    } catch (err) {
      console.warn(`❌ ${model} failed:`, err.message);
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  throw new Error(`${model} failed after retries`);
}

// ================= HF =================
async function callHF(prompt, expectedCount, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
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
              max_new_tokens: 800,
              temperature: 0.3
            }
          })
        }
      );

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("HF returned HTML (model loading)");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const text = data[0]?.generated_text;

      if (!text) throw new Error("Empty HF");

      return validate(safeParse(text), expectedCount);

    } catch (err) {
      console.warn("❌ HF retry:", err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  throw new Error("HF failed");
}
// ================= GENERATE =================
async function generateBlock(prompt, expectedCount) {

  // 🔥 Try ALL Gemini models properly
  for (let model of GEMINI_MODELS) {
    try {
      return await callGemini(prompt, model, expectedCount);
    } catch (err) {
      console.warn(`Model failed → ${model}`);
    }
  }

  // 🔥 HF LAST (NOT primary fallback)
  console.log("⚡ HF fallback...");

  return await callHF(prompt, expectedCount);
}

// ================= MAIN =================
async function generateQuestions(role, level, resumeText = "", codingEnabled = false) {
  try {
    const prompt = buildPrompt(role, level, resumeText, codingEnabled);

    const qs = await generateBlock(prompt, 15);

    return {
      questions: normalize(qs, level),
      source: "llm"
    };

  } catch (err) {
    console.error("🔥 HARD FAIL:", err.message);
    throw new Error("AI service busy, try again");
  }
}

module.exports = { generateQuestions };