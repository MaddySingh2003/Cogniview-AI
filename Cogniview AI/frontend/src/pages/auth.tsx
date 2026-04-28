import { useState } from "react";
import { login, register } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = isLogin
        ? await login({ email, password })
        : await register({ email, password });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("Invalid credentials or server issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* 🔥 SAME BACKGROUND AS HOME */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#E83464]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#8E2DE2]/20 blur-[120px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* 🔥 LEFT (MATCH HOME HERO STYLE) */}
        <div>

          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-bold leading-tight">
            {isLogin ? "Welcome back to" : "Start your journey with"} <br />
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              CogniView AI
            </span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-md">
            {isLogin
              ? "Continue improving your interview skills with AI-powered feedback."
              : "Practice real interviews, get evaluated instantly, and improve faster."}
          </p>

        </div>

        {/* 🔥 RIGHT FORM (CLEAN GLASS LIKE HOME) */}
        <div className="relative">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl max-w-md w-full ml-auto">

            <h2 className="text-2xl font-semibold mb-6 text-center">
              {isLogin ? "Login" : "Register"}
            </h2>

            {/* INPUTS */}
            <div className="space-y-4">

              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-[#E83464] transition"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-[#8E2DE2] transition"
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] font-semibold text-lg hover:opacity-90 transition"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Login →"
                : "Register →"}
            </button>

            {/* SWITCH */}
            <p
              onClick={() => setIsLogin(!isLogin)}
              className="mt-6 text-center text-sm text-gray-400 cursor-pointer hover:text-white transition"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}