import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getResult } from "../api/api";

export default function Result() {
  const { state } = useLocation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!state?.sessionId) return;

    getResult(state.sessionId)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [state?.sessionId]);

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#070B14]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Analyzing your interview...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 bg-[#070B14]" />

      {/* glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#E83464]/20 blur-[120px] rounded-full -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-[#8E2DE2]/20 blur-[120px] rounded-full -bottom-40 -right-40 animate-pulse" />

      {/* grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(to_right,white_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* 🔥 HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            AI Interview Report
          </h1>
          <p className="text-gray-400">
            Intelligent performance evaluation & insights
          </p>
        </div>

        {/* 🔥 SCORE SECTION */}
        <div className="mb-14 flex justify-center">
          <div className="relative w-[260px] h-[260px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_80px_rgba(142,45,226,0.2)]">

            {/* rotating glow ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent 
            bg-gradient-to-r from-[#E83464] to-[#8E2DE2] blur-xl opacity-30 animate-spin" />

            <div className="text-center z-10">
              <p className="text-sm text-gray-400 mb-1">Score</p>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
                {data.averageScore}
              </div>
              <p className="mt-2 text-sm text-gray-300">
                {data.verdict}
              </p>
            </div>

          </div>
        </div>

        {/* 🔥 STRENGTH / WEAK */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">

          {/* STRONG */}
          <div className="bg-white/5 border border-green-400/20 p-6 rounded-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4 text-green-300">
              Strength Areas
            </h3>

            {(data.strongAreas || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.strongAreas.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No strong areas detected</p>
            )}
          </div>

          {/* WEAK */}
          <div className="bg-white/5 border border-red-400/20 p-6 rounded-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4 text-red-300">
              Weak Areas
            </h3>

            {(data.weakAreas || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.weakAreas.map((w: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-red-500/20 text-red-300"
                  >
                    {w}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No weak areas detected</p>
            )}
          </div>

        </div>

        {/* 🔥 BREAKDOWN */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Answer Breakdown
          </h2>

          <div className="space-y-5">

            {data.answers.map((a: any, i: number) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
              >

                {/* Q */}
                <p className="font-semibold mb-2">
                  Q{i + 1}: {a.question}
                </p>

                {/* USER ANSWER */}
                <p className="text-sm text-gray-300 mb-3">
                  Your Answer:{" "}
                  {Array.isArray(a.answer)
                    ? a.answer.join(", ")
                    : a.answer || "Not answered"}
                </p>

                {/* SCORE BAR */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Score</span>
                    <span>{a.score}/10</span>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        a.score >= 7
                          ? "bg-green-500"
                          : a.score >= 4
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(a.score || 0) * 10}%` }}
                    />
                  </div>
                </div>

                {/* FEEDBACK */}
                {a.feedback && (
                  <div className="text-sm text-yellow-300 space-y-1">
                    {a.feedback.map((f: string, idx: number) => (
                      <div key={idx}>• {f}</div>
                    ))}
                  </div>
                )}

              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}