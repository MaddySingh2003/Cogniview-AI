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

    } catch (err: any) {
      console.error(err);
      alert("Invalid credentials or server issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center relative overflow-hidden">

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCI+PC9zdmc+')]" />

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-pink-600 opacity-20 blur-[120px] rounded-full" />

      {/* CARD */}
      <div className="relative z-10 w-[360px] bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-2">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>

        <p className="text-center text-gray-400 text-sm mb-6">
          {isLogin
            ? "Login to continue your AI interview journey"
            : "Start your AI interview journey today"}
        </p>

        {/* INPUTS */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500"
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="relative w-full mt-6 py-3 rounded-full font-semibold text-lg overflow-hidden group"
        >

          {/* Gradient Border */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] p-[2px]" />

          {/* Inner */}
          <span className="relative flex items-center justify-center rounded-full bg-[#070B14] px-6 py-3 group-hover:bg-transparent transition-all duration-300">

            {/* Glow */}
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#E83464] to-[#8E2DE2] blur-xl" />

            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <span className="z-10">
                {isLogin ? "Login →" : "Register →"}
              </span>
            )}

          </span>

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
  );
}