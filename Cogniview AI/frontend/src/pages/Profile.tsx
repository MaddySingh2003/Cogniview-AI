import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);

    getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => {});
  }, []);

  const avg = history.length
    ? (
        history.reduce((a, b) => a + Number(b.averageScore || 0), 0) /
        history.length
      ).toFixed(2)
    : "0";

  const best = history.length
    ? Math.max(...history.map((h) => Number(h.averageScore || 0)))
    : "0";

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* 🔥 INTERVIEW BACKGROUND */}
      <div className="absolute inset-0 bg-[#070B14]" />

      <div className="absolute w-[400px] h-[400px] bg-[#E83464]/20 blur-[120px] rounded-full -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-[#8E2DE2]/20 blur-[120px] rounded-full -bottom-40 -right-40 animate-pulse" />

      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(to_right,white_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* HEADER */}
        <div className="mb-14">
          <h1 className="text-4xl font-bold mb-2">
            Profile Overview
          </h1>
          <p className="text-gray-400">
            Your AI interview journey and performance insights
          </p>
        </div>

        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* PROFILE */}
          <FloatingCard delay="0s">
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E83464] to-[#8E2DE2] flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>

              <h2 className="text-xl font-semibold">
                {user?.email || "User"}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                AI Interview Candidate
              </p>

              <p className="mt-6 text-gray-400 text-sm">
                Interviews: {history.length}
              </p>
            </div>
          </FloatingCard>

          {/* STATS */}
          <div className="col-span-2 grid grid-cols-2 gap-6">

            <FloatingCard delay="0.2s">
              <Stat title="Average Score" value={avg} />
            </FloatingCard>

            <FloatingCard delay="0.4s">
              <Stat title="Best Score" value={best} />
            </FloatingCard>

            <FloatingCard delay="0.6s">
              <Stat title="Total Sessions" value={history.length} />
            </FloatingCard>

            <FloatingCard delay="0.8s">
              <Stat
                title="Consistency"
                value={history.length > 3 ? "Good" : "Low"}
              />
            </FloatingCard>

          </div>
        </div>

        {/* RECENT */}
        <FloatingCard delay="1s">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Recent Interviews
            </h2>

            <div className="space-y-4">

              {history.length === 0 && (
                <p className="text-gray-400">No history found</p>
              )}

              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/history")}
                  className="cursor-pointer flex justify-between items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {h.role} • {h.level}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-green-400 font-semibold">
                      {h.averageScore}
                    </p>
                    <p className="text-xs text-gray-400">Score</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </FloatingCard>

      </div>

      {/* FLOAT ANIMATION */}
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        `}
      </style>

    </div>
  );
}

/* FLOAT WRAPPER */
function FloatingCard({ children, delay }: any) {
  return (
    <div
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: delay
      }}
      className="relative p-[1px] rounded-2xl bg-gradient-to-r from-[#E83464] to-[#8E2DE2]"
    >
      <div className="bg-[#0B0F1A] rounded-2xl">
        {children}
      </div>
    </div>
  );
}

/* STAT */
function Stat({ title, value }: any) {
  return (
    <div className="p-6 text-center">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}