const fetch = require("node-fetch");

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// use a stable model
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

async function generateWithHF(prompt) {
  try {
    const res = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data[0]?.generated_text;

  } catch (err) {
    console.error("❌ HF ERROR:", err.message);
    throw err;
  }
}

module.exports = { generateWithHF };