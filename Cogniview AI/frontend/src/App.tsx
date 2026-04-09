import { useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */

type Question = {
  type: "text" | "mcq" | "msq";
  question: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
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

/* ================= COMPONENT ================= */

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState<string | string[]>("");

  const [result, setResult] = useState<Result | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  const currentQ = questions[currentIndex];

  /* ================= START ================= */

  const startInterview = async () => {
    try {
      const res = await axios.post("http://localhost:3001/start");

      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setCurrentIndex(0);

      // Reset states
      setAnswer("");
      setResult(null);
      setFinalResult(null);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SUBMIT ================= */

  const submitAnswer = async () => {
    if (!sessionId || !currentQ) return;

    try {
      const res = await axios.post("http://localhost:3001/answer", {
        sessionId,
        questionObj: currentQ,
        answer,
      });

      setResult(res.data);

      const next = currentIndex + 1;

      if (next < questions.length) {
        setTimeout(() => {
          setCurrentIndex(next);

          // 🔥 Reset answer based on type
          if (questions[next].type === "msq") {
            setAnswer([]);
          } else {
            setAnswer("");
          }

          setResult(null);
        }, 1200);
      } else {
        const finalRes = await axios.get(
          `http://localhost:3001/result/${sessionId}`
        );
        setFinalResult(finalRes.data);
      }
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  /* ================= START SCREEN ================= */

  if (!sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">
            AI Mock Interview System
          </h1>
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

  /* ================= FINAL RESULT ================= */

  if (finalResult) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Interview Report</h2>

          <p><b>Average Score:</b> {finalResult.averageScore}</p>
          <p><b>Selection Probability:</b> {finalResult.selectionProbability}</p>
          <p className="mb-4"><b>Verdict:</b> {finalResult.verdict}</p>

          <hr className="mb-4" />

          {finalResult.answers.map((a, i) => (
            <div key={i} className="mb-4">
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

  /* ================= INTERVIEW SCREEN ================= */

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">

        {/* Progress */}
        <div className="mb-4 text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-4">
          {currentQ?.question}
        </h2>

        {/* TEXT */}
        {currentQ?.type === "text" && (
          <textarea
            className="w-full border p-2 rounded-lg"
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
                name="mcq"
                className="mr-2"
                checked={answer === opt}
                onChange={() => setAnswer(opt)}
              />
              {opt}
            </label>
          ))}

        {/* MSQ */}
        {currentQ?.type === "msq" &&
          currentQ.options?.map((opt) => {
            const selected = Array.isArray(answer) && answer.includes(opt);

            return (
              <label key={opt} className="block mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected}
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
            );
          })}

        {/* Submit */}
        <button
          onClick={submitAnswer}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Submit
        </button>

        {/* Result */}
        {result && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
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