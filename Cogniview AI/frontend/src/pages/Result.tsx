import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getResult } from "../api/api";

export default function Result() {
  const { state } = useLocation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getResult(state.sessionId).then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        Result
      </h2>

      <h3 className="text-center text-xl mb-4">
        Average Score: {data.averageScore}
      </h3>

      <div className="space-y-4 max-w-2xl mx-auto">
        {data.answers.map((a: any, i: number) => (
          <div
            key={i}
            className="bg-white/10 p-4 rounded-lg"
          >
            <p>{a.question}</p>
            <p className="text-green-300">
              Score: {a.score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}