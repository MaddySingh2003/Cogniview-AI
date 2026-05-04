const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

async function executeCode(code, language = "python") {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "temp.py");

    fs.writeFileSync(filePath, code);

    const process = spawn("python", [filePath]);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", () => {
      resolve({ stdout, stderr });
    });

    process.on("error", reject);
  });
}

module.exports = { executeCode };