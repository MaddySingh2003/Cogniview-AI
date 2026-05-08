
import { useState } from "react";
import { login, register } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  
const handleSubmit = async () => {
  try {
    setLoading(true);

    // ================= LOGIN =================
    if (isLogin) {

      const res = await login({
        email,
        password
      });

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/");

    }

    // ================= REGISTER =================
    else {

      await register({
        email,
        password,
        name
      });

      alert("Registration successful. Please login.");

      // 🔥 SWITCH TO LOGIN
      setIsLogin(true);

      // OPTIONAL
      setPassword("");

    }

  } catch (err: any) {

    console.error(err);

    alert(
      err?.response?.data?.error ||
      "Authentication failed"
    );

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

        {/* 🔥 LEFT */}
        <div>

          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-bold leading-tight">

            {isLogin
              ? "Welcome back to"
              : "Start your journey with"}

            <br />

            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              CogniView AI
            </span>

          </h1>

          <p className="mt-6 max-w-md">

            {isLogin
              ? "Continue improving your interview skills with AI-powered feedback."
              : "Practice real interviews, get evaluated instantly, and improve faster."}

          </p>

        </div>

        {/* 🔥 RIGHT FORM */}
        <div className="relative">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl max-w-md w-full ml-auto">

            <h2 className="text-2xl font-semibold mb-6 text-center">
              {isLogin ? "Login" : "Register"}
            </h2>

            {/* INPUTS */}
            <div className="space-y-4">

              {/* ✅ NAME ONLY FOR REGISTER */}
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-[#E83464] transition"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-[#E83464] transition"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-[#8E2DE2] transition"
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
              onClick={() =>
                setIsLogin(!isLogin)
              }
              className="mt-6 text-center text-sm text-pink-400 cursor-pointer hover:text-white transition"
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
