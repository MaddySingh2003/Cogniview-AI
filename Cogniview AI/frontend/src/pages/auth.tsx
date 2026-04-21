import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const apiCall = isLogin ? login : register;

      const res = await apiCall({
        email: email.trim(),
        password: password.trim()
      });

      // only login returns token
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert("Registered successfully. Please login.");
        setIsLogin(true);
      }

    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[400px] shadow-lg">

        <h2 className="text-2xl mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {/* ✅ FORM FIX */}
        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 rounded text-black"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded text-black"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:scale-105 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>

        </form>

        {/* TOGGLE */}
        <p className="text-center mt-4 text-sm text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-2 text-purple-400 hover:underline"
        >
          {isLogin ? "Register" : "Login"}
        </button>

      </div>
    </div>
  );
}