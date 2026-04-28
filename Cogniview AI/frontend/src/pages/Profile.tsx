import { useEffect, useState } from "react";
import { getHistory } from "../api/api";

type HistoryItem = {
  averageScore?: number;
  role?: string;
  level?: string;
  createdAt?: string;
};

type User = {
  email?: string;
};

export default function Profile() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);

    getHistory()
      .then((res) => setHistory(res.data || []))
      .catch(() => {});
  }, []);

  const avg =
    history.length > 0
      ? (
          history.reduce((a, b) => a + Number(b.averageScore ?? 0), 0) /
          history.length
        ).toFixed(2)
      : "0";

  const best =
    history.length > 0
      ? Math.max(...history.map((h) => Number(h.averageScore ?? 0)))
      : "0";

  return (
    <div className="min-h-screen bg-black/20 border border-white/10 text-white relative overflow-hidden">

      {/* 🔥 FLOATING BACKGROUND BLOBS */}
      <div className="absolute -top-50 -left-50 w-125 h-125 bg-[#E83464]/20 blur-[120px] rounded-full animate-floatSlow" />
      <div className="absolute -bottom-50 -right-50 w-125 h-125 bg-[#8E2DE2]/20 blur-[120px] rounded-full animate-floatSlow delay-2000" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* HEADER */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-2">
            Your Profile
          </h1>
          <p className="text-gray-400">
            Overview of your interview performance
          </p>
        </div>

        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* PROFILE CARD */}
          <div className="glass-card animate-float">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] flex items-center justify-center text-2xl font-bold mb-4 shadow-lg animate-pulseSlow">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>

            <h2 className="text-lg font-semibold">
              {user?.email || "User"}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              AI Interview Candidate
            </p>

            <div className="mt-6 text-sm text-gray-300">
              <p>Total Interviews</p>
              <p className="text-xl font-bold text-white">
                {history.length}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <StatBox title="Average Score" value={avg} />
            <StatBox title="Best Score" value={best} />
            <StatBox title="Total Sessions" value={history.length} />
            <StatBox
              title="Consistency"
              value={history.length > 3 ? "Good" : "Low"}
            />
          </div>
        </div>

        {/* HISTORY */}
        <div className="glass-card animate-fadeIn">

          <h2 className="text-xl font-semibold mb-6">
            Recent Interviews
          </h2>

          <div className="space-y-3">

            {history.length === 0 && (
              <p className="text-gray-400 text-sm">
                No history found
              </p>
            )}

            {history.map((h, i) => (
              <div
                key={i}
                className="history-item"
              >
                <div>
                  <p className="font-medium capitalize">
                    {h.role} • {h.level}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(h.createdAt || "").toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-green-400">
                    {h.averageScore ?? "--"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Score
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* 🔥 ANIMATIONS */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .glass-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          transition: all 0.25s ease;
        }

        .history-item:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.1);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes floatSlow {
          0% { transform: translate(0,0); }
          50% { transform: translate(20px, -20px); }
          100% { transform: translate(0,0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseSlow {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 12s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        .animate-pulseSlow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}

/* STAT BOX */
type StatBoxProps = {
  title: string;
  value: string | number;
};

function StatBox({ title, value }: StatBoxProps) {
  return (
    <div className="glass-card animate-float">

      <p className="text-gray-400 text-sm mb-1">
        {title}
      </p>

      <h3 className="text-2xl font-bold text-white">
        {value}
      </h3>

    </div>
  );
}