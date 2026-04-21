import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getResult } from "../api/api";

export default function Result() {
  const { state } = useLocation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!state?.sessionId) return;

    getResult(state.sessionId)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">

      {/* ===== HEADER ===== */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">
          AI Interview Report
        </h1>

        <p className="text-gray-400">
          Detailed performance analysis
        </p>
      </div>

      {/* ===== SUMMARY CARD ===== */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl mb-8 text-center shadow-lg">
        <h2 className="text-2xl font-semibold">
          Score: {data.averageScore} / 10
        </h2>

        <p className="mt-2 text-purple-300 font-semibold">
          {data.verdict}
        </p>
      </div>

      {/* ===== STRENGTH / WEAK ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        {/* Strengths */}
        <div className="bg-green-500/10 p-6 rounded-xl border border-green-400/20">
          <h3 className="text-green-400 text-lg mb-3 font-semibold">
            Strengths
          </h3>

          {data.strongAreas?.length > 0 ? (
            data.strongAreas.map((s: string, i: number) => (
              <p key={i} className="text-sm text-green-200">
                • {s}
              </p>
            ))
          ) : (
            <p className="text-gray-400">No strong areas detected</p>
          )}
        </div>

        {/* Weakness */}
        <div className="bg-red-500/10 p-6 rounded-xl border border-red-400/20">
          <h3 className="text-red-400 text-lg mb-3 font-semibold">
            Weak Areas
          </h3>

          {data.weakAreas?.length > 0 ? (
            data.weakAreas.map((w: string, i: number) => (
              <p key={i} className="text-sm text-red-200">
                • {w}
              </p>
            ))
          ) : (
            <p className="text-gray-400">No weak areas detected</p>
          )}
        </div>
      </div>

      {/* ===== QUESTION BREAKDOWN ===== */}
      <div className="space-y-6">
        {data.answers.map((a: any, i: number) => {

          const scoreColor =
            a.score >= 7
              ? "text-green-400"
              : a.score >= 4
              ? "text-yellow-400"
              : "text-red-400";

          return (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg p-5 rounded-xl border border-white/10"
            >

              {/* Question */}
              <p className="font-semibold mb-2">
                Q{i + 1}: {a.question}
              </p>

              {/* Type */}
              <p className="text-xs text-purple-300 mb-2">
                Type: {a.type?.toUpperCase() || "UNKNOWN"}
              </p>

              {/* Answer */}
              <p className="text-sm text-gray-300 mb-2">
                Your Answer:{" "}
                {Array.isArray(a.answer)
                  ? a.answer.join(", ")
                  : a.answer}
              </p>

              {/* Score */}
              <p className={`${scoreColor} font-semibold`}>
                Score: {a.score}/10
              </p>

              {/* Feedback */}
              <p className="text-sm text-yellow-300 mt-1">
                {a.feedback?.join(", ") || "No feedback"}
              </p>

            </div>
          );
        })}
      </div>

    </div>
  );
}