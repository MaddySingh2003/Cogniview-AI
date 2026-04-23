import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { startInterview } from "../api/api";

export default function Home() {
  const navigate = useNavigate();

  const [role, setRole] = useState("backend");
  const [level, setLevel] = useState("easy");
  const [loading, setLoading] = useState(false);

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

    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
      } else {
        alert("Server busy. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070B14] text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCI+PC9zdmc+')]" />

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-pink-600 opacity-20 blur-[120px] rounded-full" />

      {/* HERO */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-28 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-tight mb-6">
            Practice real <br />
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              AI-powered
            </span> <br />
            interviews
          </h1>

          <p className="text-gray-400 text-lg mb-10 max-w-lg">
            Experience realistic interview scenarios powered by AI.
            Get instant evaluation, detailed feedback, and track your growth.
          </p>

          <button
            onClick={() => navigate("/learn-more")}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] text-white font-semibold text-lg hover:opacity-90 transition-all shadow-[0_0_30px_rgba(232,52,100,0.3)]"
          >
            Learn more
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            View Dashboard
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative h-[500px] lg:h-[650px]">
          <img
            src="/hero-image.png"
            alt="AI Interview"
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
          />

          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-lg p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-300">Live AI Evaluation</p>
            <p className="text-lg font-semibold text-white">Score: 8.5 / 10</p>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <div className="mt-32 text-center pb-20 max-w-xl mx-auto px-6">

        <h2 className="text-3xl font-bold mb-6">
          Ready to improve your interview skills?
        </h2>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">

          <div className="flex gap-4 mb-6">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-1/2 p-3 rounded-lg text-blue-400"
            >
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="data-science">Data Science</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-1/2 p-3 rounded-lg text-blue-400"
            >
              <option value="easy">Beginner</option>
              <option value="medium">Intermediate</option>
              <option value="hard">Advanced</option>
            </select>
          </div>

          {/* 🔥 PREMIUM BUTTON */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="relative w-full py-3 rounded-full font-semibold text-lg overflow-hidden group"
          >

            {/* Gradient Border */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] p-[2px]" />

            {/* Inner */}
            <span className="relative flex items-center justify-center rounded-full bg-[#070B14] px-6 py-3 group-hover:bg-transparent transition-all duration-300">

              {/* Glow */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#E83464] to-[#8E2DE2] blur-xl" />

              {/* TEXT / LOADER */}
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating AI Interview...
                </div>
              ) : (
                <span className="z-10">
                  Start AI Interview →
                </span>
              )}
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}