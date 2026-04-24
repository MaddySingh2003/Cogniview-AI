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
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getHistory().then((res) => {
      setData(res.data || []);
    });
  }, []);

  // ================= BASIC METRICS =================
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

  const best = Math.max(...data.map(d => d.averageScore || 0), 0);

  // ================= TREND =================
  const trend =
  data.length >= 2 &&
  data[data.length - 1]?.averageScore != null &&
  data[data.length - 2]?.averageScore != null
    ? data[data.length - 1].averageScore -
      data[data.length - 2].averageScore
    : 0;

  // ================= TOPIC ANALYSIS =================
  const topicMap: any = {};

  data.forEach((session) => {
    session.answers?.forEach((a: any) => {
      const topic = a.topic || "General";

      if (!topicMap[topic]) topicMap[topic] = [];
      topicMap[topic].push(a.score || 0);
    });
  });

  let strong: string[] = [];
  let weak: string[] = [];

  Object.keys(topicMap).forEach((t) => {
    const scores = topicMap[t];
    const tAvg =
      scores.reduce((a: number, b: number) => a + b, 0) /
      scores.length;

    if (tAvg >= 6) strong.push(t);
    if (tAvg <= 4) weak.push(t);
  });

  // ================= CONSISTENCY =================
  const variance =
    data.length > 0
      ? data.reduce(
          (acc, d) =>
            acc + Math.pow((d.averageScore || 0) - Number(avg), 2),
          0
        ) / data.length
      : 0;

  const consistency = Math.max(0, 10 - variance).toFixed(2);

  return (
    <div className="min-h-screen bg-[#070B14] text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjwvc3ZnPg==')]" />

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2">AI Dashboard</h1>
        <p className="text-gray-400 mb-10">
          Track your interview performance and improve with insights
        </p>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <Card title="Total Interviews" value={data.length} />
          <Card title="Average Score" value={`${avg} / 10`} />
          <Card title="Best Score" value={best || 0} />
          <Card
            title="Consistency"
            value={`${consistency}`}
          />

        </div>

        {/* TREND */}
        <div className="mb-10 text-sm">
          <span
            className={`px-4 py-2 rounded-full ${
              trend >= 0
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {trend >= 0 ? "Improving +" : "Declining "}
            {trend.toFixed(2)}
          </span>
        </div>

        {/* CHART */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">

          <h2 className="text-xl mb-4 font-semibold">
            Performance Trend
          </h2>

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

          <InsightCard
            title="Strong Areas"
            data={strong}
            color="green"
          />

          <InsightCard
            title="Weak Areas"
            data={weak}
            color="red"
          />

        </div>

        {/* RECENT */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

          <h2 className="text-xl mb-4 font-semibold">
            Recent Interviews
          </h2>

          <div className="space-y-4">

            {data.slice(0, 5).map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-black/30 p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold capitalize">
                    {d.role} ({d.level})
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="font-bold text-lg">
                  {d.averageScore || "--"}/10
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

// ================= CARD =================
function Card({ title, value }: any) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-[#E83464] to-[#8E2DE2]">
      <div className="bg-[#0B0F1A] rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm mb-2">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

// ================= INSIGHT =================
function InsightCard({ title, data, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg mb-4">{title}</h3>

      {data.length === 0 ? (
        <p className="text-gray-400 text-sm">No data yet</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.map((d: string, i: number) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-sm ${
                color === "green"
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