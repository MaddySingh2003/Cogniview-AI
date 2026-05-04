const { executeCode } = require("./codeExecutor");

async function evaluateCode(answer, expectedOutput, language = "python") {
  try {
    const result = await executeCode(answer, language);

    const output = result.stdout?.trim();

    if (!output) {
      return {
        score: 2,
        feedback: ["Code did not produce output."]
      };
    }

    if (
      output.toLowerCase() ===
      (expectedOutput || "").trim().toLowerCase()
    ) {
      return {
        score: 10,
        feedback: ["Correct solution. Output matches expected result."]
      };
    }

    return {
      score: 4,
      feedback: [
        "Incorrect output.",
        `Expected: ${expectedOutput}`,
        `Got: ${output}`
      ]
    };

  } catch (err) {
    return {
      score: 1,
      feedback: ["Code execution failed."]
    };
  }
}

module.exports = { evaluateCode }; // ✅ IMPORTANT