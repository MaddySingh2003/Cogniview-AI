import { useEffect, useState } from "react";
import { getHistory } from "../api/api";

export default function Profile() {
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // get user from localStorage
    const u = JSON.parse(localStorage.getItem("user") || "null");
    setUser(u);

    // fetch last 5 interviews
    getHistory()
      .then((res) => setHistory(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#070B14] text-white px-6 md:px-20 py-20">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-2">
          Your Profile
        </h1>
        <p className="text-gray-400">
          Track your AI interview performance and progress
        </p>
      </div>

      {/* USER CARD */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl col-span-1 flex flex-col items-center text-center">
          
          {/* AVATAR */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mb-4">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>

          <h2 className="text-xl font-semibold">
            {user?.email || "User"}
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            AI Interview Candidate
          </p>

          <div className="mt-6 text-sm text-gray-400">
            <p>Interviews Taken: {history.length}</p>
          </div>
        </div>

        {/* STATS */}
        <div className="col-span-2 grid grid-cols-2 gap-6">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Avg Score</p>
            <h3 className="text-2xl font-bold mt-2">
              {history.length
                ? (
                    history.reduce((a, b) => a + Number(b.averageScore || 0), 0) /
                    history.length
                  ).toFixed(2)
                : "0"}
            </h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Best Score</p>
            <h3 className="text-2xl font-bold mt-2">
              {history.length
                ? Math.max(...history.map(h => Number(h.averageScore || 0)))
                : "0"}
            </h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Total Sessions</p>
            <h3 className="text-2xl font-bold mt-2">
              {history.length}
            </h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Consistency</p>
            <h3 className="text-2xl font-bold mt-2">
              {history.length > 3 ? "Good" : "Low"}
            </h3>
          </div>

        </div>
      </div>

      {/* HISTORY */}
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl font-semibold mb-6">
          Recent Interviews
        </h2>

        <div className="space-y-4">

          {history.length === 0 && (
            <p className="text-gray-400">No history found</p>
          )}

          {history.map((h, i) => (
            <div
              key={i}
              className="bg-white/5 p-5 rounded-xl border border-white/10 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
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
                <p className="text-xs text-gray-400">
                  Score
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}