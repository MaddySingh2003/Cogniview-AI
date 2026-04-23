import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((res) => setData(res.data))
      .catch(() => {
        alert("Failed to load history");
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white relative overflow-hidden">

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCI+PC9zdmc+')]" />

      {/* GLOW */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Interview History
          </h1>
          <p className="text-gray-400">
            Track your previous AI interviews and monitor your progress over time.
          </p>
        </div>

        {/* EMPTY STATE */}
        {data.length === 0 && (
          <div className="text-center mt-20 text-gray-400">
            No interviews yet. Start your first AI interview 🚀
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
              className="group relative cursor-pointer rounded-2xl p-[1px] bg-gradient-to-r from-[#E83464] to-[#8E2DE2] hover:scale-[1.03] transition-all duration-300"
            >

              {/* INNER CARD */}
              <div className="bg-[#0B0F1A] rounded-2xl p-5 h-full flex flex-col justify-between">

                {/* TOP */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>

                  <h3 className="text-xl font-semibold capitalize">
                    {s.role} Interview
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    Level: {s.level}
                  </p>
                </div>

                {/* MIDDLE */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Score</span>
                    <span className="font-semibold">
                      {s.averageScore ?? "--"} / 10
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
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

              {/* HOVER GLOW */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl bg-gradient-to-r from-[#E83464] to-[#8E2DE2]" />

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}