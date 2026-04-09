import { useState } from "react";
import axios from "axios";

type Question = {
  type: "text" | "mcq" | "msq";
  question: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  difficulty?: "easy" | "medium" | "hard";
};

type Result = {
  score: number;
  feedback: string[];
};

type FinalResult = {
  averageScore: number;
  selectionProbability: string;
  verdict: string;
  answers: {
    question: string;
    score: number;
    feedback: string[];
  }[];
};

export default function App() {
  const [role, setRole] = useState("data-scientist");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [result, setResult] = useState<Result | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [step, setStep] = useState(1);

  // 🚀 START
  const startInterview = async () => {
    const res = await axios.post("http://localhost:3001/start", { role });
    setSessionId(res.data.sessionId);
    setCurrentQ(res.data.question);
  };

  // 🚀 SUBMIT
  const submitAnswer = async () => {
    const res = await axios.post("http://localhost:3001/answer", {
      sessionId,
      questionObj: currentQ,
      answer
    });

    setResult(res.data.result);

    if (res.data.isFinished) {
      const finalRes = await axios.get(
        `http://localhost:3001/result/${sessionId}`
      );
      setFinalResult(finalRes.data);
    } else {
      setTimeout(() => {
        setCurrentQ(res.data.nextQuestion);
        setAnswer(res.data.nextQuestion.type === "msq" ? [] : "");
        setResult(null);
        setStep((s) => s + 1);
      }, 1200);
    }
  };

  // 🧠 START SCREEN
  if (!sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">
            AI Hiring Intelligence System
          </h1>

          <select
            className="border p-2 rounded mb-4"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="data-scientist">Data Scientist</option>
            <option value="backend">Backend Developer</option>
          </select>

          <br />

          <button
            onClick={startInterview}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // 🎯 FINAL RESULT
  if (finalResult) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Final Report</h2>

          <p>Average Score: {finalResult.averageScore}</p>
          <p>Selection Probability: {finalResult.selectionProbability}</p>
          <p className="mb-4">Verdict: {finalResult.verdict}</p>

          {finalResult.answers.map((a, i) => (
            <div key={i} className="mb-4 border-b pb-2">
              <p className="font-semibold">{a.question}</p>
              <p>Score: {a.score}</p>
              {a.feedback.map((f, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  • {f}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🎤 INTERVIEW
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 w-full max-w-2xl rounded-2xl shadow-xl">

        <p className="text-sm text-gray-500 mb-2">Step {step}</p>

        <h2 className="text-lg font-semibold mb-4">
          {currentQ?.question}
        </h2>

        {/* TEXT */}
        {currentQ?.type === "text" && (
          <textarea
            className="w-full border p-2 rounded"
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* MCQ */}
        {currentQ?.type === "mcq" &&
          currentQ.options?.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                onChange={() => setAnswer(opt)}
              />
              {opt}
            </label>
          ))}

        {/* MSQ */}
        {currentQ?.type === "msq" &&
          currentQ.options?.map((opt) => (
            <label key={opt} className="block">
              <input
                type="checkbox"
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

        <button
          onClick={submitAnswer}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        {result && (
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <p>Score: {result.score}</p>
            {result.feedback.map((f, i) => (
              <p key={i}>• {f}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}