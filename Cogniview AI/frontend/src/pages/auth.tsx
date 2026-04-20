import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 const handleSubmit = async () => {
  try {
    const res = await login({
      email: email.trim(),
      password: password.trim()
    });

    localStorage.setItem("token", res.data.token);
    console.log("TOKEN SAVED:", res.data.token);

    navigate("/");

  } catch (err: any) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.error || "Login failed");
  }
};

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 p-8 rounded-xl w-[400px] shadow-lg">

        <h2 className="text-2xl text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            placeholder="Name"
            className="w-full p-2 mb-3 rounded text-black"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 rounded text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-white text-purple-600 py-2 rounded font-bold"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-center mt-4 cursor-pointer text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Create new account"
            : "Already have an account?"}
        </p>
      </div>
    </div>
  );
}