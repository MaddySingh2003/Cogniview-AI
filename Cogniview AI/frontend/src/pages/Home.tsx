import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../api/api";

export default function Home() {
  const [role, setRole] = useState("backend");
  const [level, setLevel] = useState("easy");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        alert("Server busy");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20">

      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        AI Interview Simulator
      </h1>

      <p className="text-gray-400 max-w-xl mb-10">
        Practice real interview questions powered by AI. Get instant feedback, scoring, and improvement insights.
      </p>

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[400px]">

        <select
          className="w-full p-3 mb-4 rounded-lg text-black"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="backend">Backend</option>
          <option value="frontend">Frontend</option>
          <option value="data-science">Data Science</option>
        </select>

        <select
          className="w-full p-3 mb-6 rounded-lg text-black"
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="easy">Beginner</option>
          <option value="medium">Intermediate</option>
          <option value="hard">Advanced</option>
        </select>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition"
        >
          {loading ? "Generating AI Interview..." : "Start Interview"}
        </button>

      </div>
    </div>
  );
}