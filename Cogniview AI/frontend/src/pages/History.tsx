import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((res) => setData(res.data))
      .catch(() => {
        alert("Failed to load history");
      });
  }, []);

  return (
    <div className="min-h-screen  bg-black/40 border-white/10  text-white relative overflow-hidden">

      {/* 🔥 GLOW BG */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#E83464]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#8E2DE2]/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Interview History
          </h1>
          <p className="text-gray-400">
            Review your past sessions and track your improvement.
          </p>
        </div>

        {/* EMPTY */}
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-center">
            <p className="text-gray-400 mb-4">
              No interviews yet
            </p>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] text-sm font-semibold hover:scale-105 transition"
            >
              Start First Interview →
            </button>
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {data.map((s, i) => (
            <div
              key={i}
              onClick={() =>
                navigate("/result", {
                  state: { sessionId: s.sessionId }
                })
              }
              className="group relative cursor-pointer"
            >

              {/* GLOW */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#E83464] to-[#8E2DE2] opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition" />

              {/* CARD */}
              <div className="relative bg-[#0B0F1A] border border-white/10 rounded-2xl p-5 h-full hover:border-white/20 transition flex flex-col justify-between">

                {/* TOP */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>

                  <h3 className="text-lg font-semibold capitalize">
                    {s.role} Interview
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    Level: {s.level}
                  </p>
                </div>

                {/* SCORE */}
                <div className="mt-5">

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">
                      Score
                    </span>

                    <span className="text-lg font-bold">
                      {s.averageScore ?? "--"}
                      <span className="text-sm text-gray-500"> /10</span>
                    </span>
                  </div>

                  {/* BAR */}
                  <div className="w-full h-2 bg-[#131a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2]"
                      style={{
                        width: `${(s.averageScore || 0) * 10}%`
                      }}
                    />
                  </div>

                </div>

                {/* FOOTER */}
                <div className="mt-5 flex justify-between items-center text-sm">

                  <span className="text-gray-400">
                    {s.verdict || "View Result"}
                  </span>

                  <span className="text-white group-hover:translate-x-1 transition">
                    →
                  </span>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}