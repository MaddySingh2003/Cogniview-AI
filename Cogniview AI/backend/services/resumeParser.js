const pdf = require("pdf-parse");

async function extractText(fileBuffer) {
  try {
    const data = await pdf(fileBuffer);

    // limit size to avoid LLM overload
    return data.text.slice(0, 3000);

  } catch (err) {
    console.error("PDF Parse error:", err);
    return "";
  }
}

module.exports = { extractText };