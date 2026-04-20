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
    <div className="p-10 max-w-4xl mx-auto">

      <h2 className="text-4xl text-center mb-6">AI Evaluation</h2>

      <div className="bg-white/10 p-6 rounded-xl text-center mb-6">
        <h3 className="text-2xl">Score: {data.averageScore}/10</h3>
        <p className="text-purple-300">{data.verdict}</p>
      </div>

      <div className="space-y-4">
        {data.answers.map((a: any, i: number) => (
          <div key={i} className="bg-white/10 p-4 rounded-lg">
            <p>{a.question}</p>
            <p className="text-green-300">Score: {a.score}</p>
          </div>
        ))}
      </div>

    </div>
  );

}