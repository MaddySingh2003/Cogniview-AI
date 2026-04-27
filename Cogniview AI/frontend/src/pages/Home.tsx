import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { startInterview } from "../api/api";

export default function Home() {
  const navigate = useNavigate();

  const [role, setRole] = useState("backend");
  const [level, setLevel] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);

  const handleStart = async () => {
    try {
      setLoading(true);
      const res = await startInterview({ role, level });

      navigate("/interview", {
        state: {
          sessionId: res.data.sessionId,
          question: res.data.question
        }
      });
    } catch {
      alert("Server busy. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* 🔥 FLOATING BACKGROUND BLOBS */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#E83464]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#8E2DE2]/20 rounded-full blur-[120px] animate-pulse" />

      {/* HERO */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-28 grid lg:grid-cols-2 gap-16 items-start relative z-10">

        {/* LEFT */}
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold leading-tight">
            Practice real <br />
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              AI-powered
            </span> <br />
            interviews
          </h1>

          <p className="text-gray-300 text-lg mt-6 max-w-lg">
            Experience realistic interview scenarios powered by AI.
            Get instant evaluation, detailed feedback, and track your growth.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/learn-more")}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] font-semibold shadow-lg hover:scale-105 transition"
            >
              Learn more
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative mt-10 space-y-6">

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl hover:-translate-y-1 transition">
              <p className="text-xs text-gray-400">AI Accuracy</p>
              <p className="text-2xl font-bold">94%</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl hover:-translate-y-1 transition">
              <p className="text-xs text-gray-400">Sessions</p>
              <p className="text-2xl font-bold">120+</p>
            </div>
          </div>

          {/* ACTIVITY PREVIEW */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl hover:-translate-y-1 transition">
            <p className="text-sm text-gray-300 mb-3">Recent Performance</p>

            <div className="space-y-3">

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Backend</span>
                  <span className="text-green-400">8.5</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-[85%] animate-grow"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>System Design</span>
                  <span className="text-yellow-400">7.2</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[72%] animate-grow"></div>
                </div>
              </div>

            </div>
          </div>

          {/* QUICK INFO */}
          <div className="bg-gradient-to-r from-[#E83464]/20 to-[#8E2DE2]/20 border border-white/10 p-5 rounded-2xl hover:scale-[1.02] transition">
            <p className="text-sm text-gray-200">
              Improve faster with adaptive AI-driven insights and personalized feedback.
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-32 pb-20 text-center relative z-10">
        <h2 className="text-3xl font-bold mb-10 animate-fadeInUp">
          Train smarter. Get hired faster.
        </h2>

        <div className="relative max-w-xl mx-auto">

          <div className="bg-white/30 backdrop-blur border border-white/30 rounded-3xl p-8 shadow-2xl hover:scale-[1.01] transition">

            <div className="mb-6 text-left">
              <h3 className="text-xl font-semibold">AI Interview Setup</h3>
              <p className="text-sm text-gray-300">
                Customize your interview before starting
              </p>
            </div>

            <div className="flex gap-4 mb-6">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-1/2 p-3 rounded-lg bg-black/40 text-white"
              >
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
                <option value="data-science">Data Science</option>
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-1/2 p-3 rounded-lg bg-black/40 text-white"
              >
                <option value="easy">Beginner</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Advanced</option>
              </select>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="mb-4 w-full text-sm text-gray-300"
            />

            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] font-semibold text-lg mt-4 hover:scale-105 transition"
            >
              {loading ? "Generating..." : "Start AI Interview →"}
            </button>
          </div>

          {/* FLOAT METRICS */}
          <div className="absolute -top-6 -right-6 bg-white text-black p-4 rounded-xl shadow-xl w-36 animate-float">
            <p className="text-xs text-gray-500">Efficiency</p>
            <p className="text-2xl font-bold">85%</p>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-white/10 w-40 animate-floatSlow">
            <p className="text-xs text-gray-300">Live AI</p>
            <p className="text-lg font-semibold">8.5 / 10</p>
          </div>

        </div>
      </div>

      {/* 🔥 CUSTOM ANIMATIONS */}
      <style>
        {`
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-grow {
          animation: growBar 1.2s ease forwards;
        }

        @keyframes growBar {
          from { width: 0; }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        `}
      </style>

    </div>
  );
}