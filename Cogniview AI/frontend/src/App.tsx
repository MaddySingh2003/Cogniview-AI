import { useState } from "react";
import API from "./services/api";
import type { Question, Result, FinalResult } from "./types";

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [result, setResult] = useState<Result | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [step, setStep] = useState(0);

  // 🚀 START
  const startInterview = async () => {
    const res = await API.post("/start");
    setSessionId(res.data.sessionId);
    setCurrentQ(res.data.question);
    setStep(1);
  };

  // 🚀 SUBMIT
  const submitAnswer = async () => {
    const res = await API.post("/answer", {
      sessionId,
      questionObj: currentQ,
      answer
    });

    setResult(res.data.result);

    if (res.data.isFinished) {
      const finalRes = await API.get(`/result/${sessionId}`);
      setFinalResult(finalRes.data);
      setStep(3);
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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">
            AI Hiring Intelligence System
          </h1>
          <button
            onClick={startInterview}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // 🎯 FINAL SCREEN
  if (finalResult) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
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

        <p className="text-sm text-gray-500 mb-2">
          Step {step}
        </p>

        <h2 className="text-lg font-semibold mb-4">
          {currentQ?.question}
        </h2>

        {/* TEXT */}
        {currentQ?.type === "text" && (
          <textarea
            className="w-full border p-3 rounded-xl"
            rows={4}
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* MCQ */}
        {currentQ?.type === "mcq" &&
          currentQ.options?.map((opt) => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                className="mr-2"
                onChange={() => setAnswer(opt)}
              />
              {opt}
            </label>
          ))}

        {/* MSQ */}
        {currentQ?.type === "msq" &&
          currentQ.options?.map((opt) => (
            <label key={opt} className="block mb-2">
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

        <button
          onClick={submitAnswer}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
        >
          Submit
        </button>

        {result && (
          <div className="mt-4 bg-gray-50 p-3 rounded-xl">
            <p className="font-semibold">Score: {result.score}</p>
            {result.feedback.map((f, i) => (
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