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

// ✅ TYPE DEFINITIONS
type Answer = {
  topic?: string;
  score?: number;
};

type Session = {
  sessionId: string;
  role: string;
  level: string;
  averageScore: number;
  createdAt: string;
  answers?: Answer[];
};

export default function Dashboard() {
  const [data, setData] = useState<Session[]>([]);

  useEffect(() => {
    getHistory().then((res) => {
      setData(res.data || []);
    });
  }, []);

  // ================= METRICS =================
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
      : "0";

  const best = Math.max(...data.map(d => d.averageScore || 0), 0);

  const trend =
    data.length >= 2
      ? (data[data.length - 1].averageScore || 0) -
        (data[data.length - 2].averageScore || 0)
      : 0;

  // ================= TOPICS =================
  const topicMap: Record<string, number[]> = {};

  data.forEach((session) => {
    session.answers?.forEach((a) => {
      const topic = a.topic || "General";

      if (!topicMap[topic]) topicMap[topic] = [];
      topicMap[topic].push(a.score || 0);
    });
  });

  let strong: string[] = [];
  let weak: string[] = [];

  Object.keys(topicMap).forEach((t) => {
    const scores = topicMap[t];
    const avg =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    if (avg >= 6) strong.push(t);
    if (avg <= 4) weak.push(t);
  });

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* BG */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#E83464]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#8E2DE2]/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">AI Dashboard</h1>
        <p className="text-gray-400 mb-10">
          Track your performance with intelligent insights
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Sessions" value={data.length} trend={0} />
          <StatCard title="Avg Score" value={avg} trend={trend} />
          <StatCard title="Best" value={best} trend={0} />
          <StatCard title="Trend" value={trend.toFixed(2)} trend={trend} />
        </div>

        {/* CHART */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="mb-4 text-lg">Performance</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#222" />
              <XAxis dataKey="name" stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#E83464"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INSIGHTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Insight title="Strong Areas" data={strong} type="good" />
          <Insight title="Weak Areas" data={weak} type="bad" />
        </div>

        {/* RECENT */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
          <h2 className="mb-4 text-lg">Recent</h2>

          {data.slice(0, 5).map((d) => (
            <div
              key={d.sessionId}
              className="flex justify-between p-4 border-b border-white/10"
            >
              <div>
                <p>{d.role} ({d.level})</p>
                <p className="text-sm text-gray-400">
                  {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span>{d.averageScore}/10</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ================= CARD =================
function StatCard({
  title,
  value,
  trend
}: {
  title: string;
  value: string | number;
  trend: number;
}) {
  return (
    <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>

      <p
        className={`text-xs mt-2 ${
          trend >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {trend >= 0 ? "↑" : "↓"} {trend.toFixed(2)}
      </p>
    </div>
  );
}

// ================= INSIGHT =================
function Insight({
  title,
  data,
  type
}: {
  title: string;
  data: string[];
  type: "good" | "bad";
}) {
  return (
    <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
      <h3 className="mb-4">{title}</h3>

      {data.length === 0 ? (
        <p className="text-gray-400">No data</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.map((d, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-sm ${
                type === "good"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}