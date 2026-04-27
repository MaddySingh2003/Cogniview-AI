import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getHistory().then((res) => {
      setData(res.data || []);
    });
  }, []);

  // ===== METRICS =====
  const chartData = data.map((d, i) => ({
    name: `#${i + 1}`,
    score: d.averageScore || 0
  }));

  const avg =
    data.length > 0
      ? (
          data.reduce((a, b) => a + (b.averageScore || 0), 0) /
          data.length
        ).toFixed(2)
      : 0;

  const best = Math.max(...data.map((d) => d.averageScore || 0), 0);

  const trend =
    data.length >= 2
      ? (data[data.length - 1]?.averageScore || 0) -
        (data[data.length - 2]?.averageScore || 0)
      : 0;

  return (
    <div className="min-h-screen  text-white relative overflow-hidden">

      {/* 🔥 GLOW BACKGROUND */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#E83464]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#8E2DE2]/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Performance Dashboard
          </h1>
          <p className="text-gray-400">
            Your AI-powered interview insights
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">


          <StatCard title="Interviews" value={data.length} />
          <StatCard title="Average" value={avg} />
          <StatCard title="Best" value={best} />
          <StatCard title="Trend" value={trend.toFixed(2)} trend={trend} />

        </div>

        {/* 🔥 CHART */}
        <div className="relative rounded-2xl p-8 mb-12 
    bg-white/10 backdrop-blur-xl 
    border border-white/20 
    shadow-[0_8px_32px_rgba(0,0,0,0.3)] 
    text-white">

          <h2 className="text-lg mb-4 text-gray-300">
            Performance Trend
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#1a1a1a" />
              <XAxis dataKey="name" stroke="#555" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#E83464"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* 🔥 RECENT */}
         <div className="relative rounded-2xl p-8 mb-12 
    bg-white/10 backdrop-blur-xl 
    border border-white/20 
    shadow-[0_8px_32px_rgba(0,0,0,0.3)] 
    text-white">

          <h2 className="text-lg mb-4 text-gray-300">
            Recent Sessions
          </h2>

          <div className="space-y-3">

            {data.slice(0, 5).map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-[#0F1424] px-4 py-3 rounded-lg hover:bg-[#131a2e] transition"
              >
                <div>
                  <p className="font-medium capitalize">
                    {d.role} ({d.level})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-lg font-semibold">
                  {d.averageScore || "--"}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}

/* 🔥 STAT CARD */
function StatCard({ title, value, trend }) {
  return (
    <div className="relative group">

      {/* glow border */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E83464] to-[#8E2DE2] opacity-0 group-hover:opacity-30 blur-xl transition" />

      <div className="relative bg-[#0B0F1A] border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition">

        <p className="text-gray-500 text-sm mb-2">{title}</p>

        <h3 className="text-3xl font-bold">{value}</h3>

        {trend !== undefined && (
          <p
            className={`text-xs mt-2 ${
              trend >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend >= 0 ? "Improving" : "Declining"}
          </p>
        )}

      </div>
    </div>
  );
}