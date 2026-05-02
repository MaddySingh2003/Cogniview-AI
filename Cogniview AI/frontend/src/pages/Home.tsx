import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { startInterview } from "../api/api";

export default function Home() {
  const navigate = useNavigate();

  const [role, setRole] = useState("backend");
  const [level, setLevel] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [codingEnabled, setCodingEnabled] = useState(false);

  const [voiceMode, setVoiceMode] = useState(
  localStorage.getItem("voiceMode") === "true"
);

const toggleVoice = () => {
  const val = !voiceMode;
  setVoiceMode(val);
  localStorage.setItem("voiceMode", String(val));
};

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
          <div className="bg-gradient-to-r from-[#E83490] to-[#8E2DE2]/10 border border-white/10 p-5 rounded-2xl hover:scale-[1.02] transition">
            <p className="text-sm text-gray-200">
              Improve faster with adaptive AI-driven insights and personalized feedback.
            </p>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION */}
<div className="mt-32 pb-24 text-center relative z-10 text-white">

  {/* Heading */}
  <h2 className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent text-4xl md:text-5xl font-semibold leading-tight">
    Train smarter. Get hired faster.
  </h2>

  <div className="relative max-w-2xl mx-auto mt-5" >

    {/* Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl opacity-40 rounded-3xl"></div>

    {/* Card */}
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">

      {/* Header */}
      <div className="mb-6 text-left">
        <h3 className="text-2xl font-semibold">AI Interview Setup</h3>
        <p className="text-sm text-gray-400">
          Customize spanyour interview experience
        </p>
      </div>

      {/* Selects */}
      <div className="flex gap-4 mb-6">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-1/2 p-3 rounded-xl bg-black border border-blac/10 focus:ring-2 focus:ring-purple-500"
        >
          <option value="backend">Backend</option>
          <option value="frontend">Frontend</option>
          <option value="data-science">Data Science</option>
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-1/2 p-3 rounded-xl bg-black border border-white/10 focus:ring-2 focus:ring-pink-500"
        >
          <option value="easy">Beginner</option>
          <option value="medium">Intermediate</option>
          <option value="hard">Advanced</option>
        </select>
      </div>

      {/* File */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResume(e.target.files?.[0] || null)}
        className="w-full mb-6 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
        file:rounded-full file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
      />

      {/* 🔥 SAME ROW CONTROLS */}
      <div className="flex items-center justify-between gap-4 mb-6">

        {/* Voice Toggle */}
        <button
          onClick={toggleVoice}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            voiceMode
              ? "bg-green-500/90 shadow-lg shadow-green-500/30"
              : "bg-red-500/90 shadow-lg shadow-red-500/30"
          }`}
        >
          🎙 Voice: {voiceMode ? "ON" : "OFF"}
        </button>

        {/* Coding Toggle */}
        <div className="flex items-center justify-between flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <span className="text-sm">Coding</span>

          <button
            onClick={() => setCodingEnabled(!codingEnabled)}
            className={`w-11 h-6 rounded-full relative transition ${
              codingEnabled ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                codingEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

      </div>

      {/* CTA */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full py-3 rounded-full font-semibold text-lg 
        bg-gradient-to-r from-pink-500 to-purple-600 
        hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition"
      >
        {loading ? "Generating..." : "Start AI Interview →"}
      </button>
    </div>

    {/* Floating Stats */}
    <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
      <p className="text-xs text-gray-400">Efficiency</p>
      <p className="text-2xl font-bold text-green-400">85%</p>
    </div>

    <div className="absolute -bottom-8 -left-8 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl">
      <p className="text-xs text-gray-400">Live AI</p>
      <p className="text-lg font-semibold text-purple-400">8.5 / 10</p>
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
av
    </div>
  );
}