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
    .catch((err) => {
      console.error("Result fetch error:", err);
    });

}, [state?.sessionId]);

  if (!data)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h2 className="text-3xl font-bold text-center mb-6">
        Interview Result
      </h2>

      {/* SUMMARY */}
      <div className="bg-white/10 p-6 rounded-lg mb-6 text-center">
        <h3 className="text-xl">
          Average Score: {data.averageScore} / 10
        </h3>

        <p className="mt-2 font-semibold">
          Verdict: {data.verdict}
        </p>

        <div className="mt-4">
  <p className="text-green-300">
    Strengths: {(data.strongAreas || []).length > 0
      ? data.strongAreas.join(", ")
      : "None"}
  </p>

  <p className="text-red-300">
    Weak Areas: {(data.weakAreas || []).length > 0
      ? data.weakAreas.join(", ")
      : "None"}
  </p>
</div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-4">
        {data.answers.map((a: any, i: number) => (
          <div
            key={i}
            className="bg-white/10 p-4 rounded-lg"
          >
            <p className="font-semibold">
              Q{i + 1}: {a.question}
            </p>

            <p className="mt-1 text-sm">
              Your Answer: {Array.isArray(a.answer)
                ? a.answer.join(", ")
                : a.answer}
            </p>

            <p className="text-green-300 mt-1">
              Score: {a.score}/10
            </p>

            <p className="text-yellow-300 text-sm">
              {a.feedback?.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}