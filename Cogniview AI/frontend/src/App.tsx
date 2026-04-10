import { useState } from "react";
import axios from "axios";

export default function App() {
  const [role, setRole] = useState("data-scientist");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [result, setResult] = useState<any>(null);
  const [final, setFinal] = useState<any>(null);
  const [step, setStep] = useState(1);

  // 🚀 START
  const start = async () => {
    const res = await axios.post("http://localhost:3001/start", { role });
    setSessionId(res.data.sessionId);
    setQuestion(res.data.question);
  };

  // 🚀 SUBMIT
  const submit = async () => {
    if (!question) return;

    const res = await axios.post("http://localhost:3001/answer", {
      sessionId,
      questionObj: question,
      answer
    });

    setResult(res.data.result);

    if (res.data.isFinished) {
      const finalRes = await axios.get(
        `http://localhost:3001/result/${sessionId}`
      );
      setFinal(finalRes.data);
    } else {
      setTimeout(() => {
        setQuestion(res.data.nextQuestion);
        setAnswer(res.data.nextQuestion?.type === "msq" ? [] : "");
        setResult(null);
        setStep((s) => s + 1);
      }, 1200);
    }
  };

  // 🧠 VALIDATION
  const isDisabled =
    !question ||
    (question.type === "text" && (!answer || answer === "")) ||
    (question.type === "mcq" && (!answer || answer === "")) ||
    (question.type === "msq" &&
      (!Array.isArray(answer) || answer.length === 0));

  // ================= START SCREEN =================
  if (!sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-[420px] text-center">
          <h1 className="text-3xl font-bold mb-6">
            AI Interview System
          </h1>

          <select
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded-xl mb-6"
          >
            <option value="data-scientist">Data Scientist</option>
            <option value="backend">Backend Developer</option>
          </select>

          <button
            onClick={start}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // ================= FINAL RESULT =================
  if (final) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Interview Report
          </h2>

          <div className="text-center mb-6">
            <p className="text-lg">
              Average Score:{" "}
              <span className="font-semibold">{final.averageScore}</span>
            </p>
          </div><p className="mt-2 font-semibold">
  Selection Probability: {final.selectionProbability}
</p>

<p className="font-semibold">
  Verdict: {final.verdict}
</p>

<p className="text-sm text-gray-600">
  {final.finalDecision}
</p>

          {final.answers.map((a: any, i: number) => (
            <div key={i} className="mb-4 border-b pb-3">
              <p className="font-semibold">{a.question}</p>
              <p className="text-sm">Score: {a.score}</p>

              {a.feedback?.map((f: string, idx: number) => (
                <p key={idx} className="text-sm text-gray-600">
                  • {f}
                </p>
              ))}
            </div>
          ))}

          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  // ================= INTERVIEW =================
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl">

        {/* Progress */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Question {step}
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${step * 20}%` }}
            />
          </div>
        </div>

        {/* Type */}
        <p className="text-sm text-gray-500 mb-2">
          Type: {question?.type.toUpperCase()}
        </p>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-6">
          {question?.question}
        </h2>

        {/* TEXT */}
        {question?.type === "text" && (
          <textarea
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400"
            rows={4}
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* MCQ */}
        {question?.type === "mcq" &&
          question.options?.map((o: string) => (
            <label
              key={o}
              className="block p-3 border rounded-xl mb-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="mcq"
                className="mr-2"
                onChange={() => setAnswer(o)}
              />
              {o}
            </label>
          ))}

        {/* MSQ */}
        {question?.type === "msq" &&
          question.options?.map((opt: string) => (
            <label
              key={opt}
              className="block p-3 border rounded-xl mb-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => {
                  const prev = Array.isArray(answer) ? answer : [];

                  if (e.target.checked) {
                    setAnswer([...prev, opt]);
                  } else {
                    setAnswer(prev.filter((a) => a !== opt));
                  }
                }}
              />
              {opt}
            </label>
          ))}

        {/* Submit */}
        <button
          disabled={isDisabled}
          onClick={submit}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          Submit Answer
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl">
            <p className="font-semibold mb-2">
              Score: {result.score}
            </p>

            {result.feedback?.map((f: string, i: number) => (
              <p key={i} className="text-sm text-gray-600">
                • {f}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}