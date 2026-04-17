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
          question: res.data.question,
          total: res.data.totalQuestions
        }
      });

    } catch (err) {
      alert("Server busy. Try again later.");
      console.error(err);

    } finally {
      setLoading(false);
    }};

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6">
          AI Interview
        </h1>

        <div className="space-y-4">
          <select
            className="w-full p-3 rounded-lg text-black"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
            <option value="data-science">Data Science</option>
          </select>

          <select
            className="w-full p-3 rounded-lg text-black"
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="easy">Beginner</option>
            <option value="medium">Intermediate</option>
            <option value="hard">Advanced</option>
          </select>

          <button
        onClick={handleStart}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "gray" : "blue",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Please wait..." : "Start Interview"}
      </button>
        </div>
      </div>
    </div>
  );
}