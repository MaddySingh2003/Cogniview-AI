import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="flex justify-between items-center px-8 py-4 backdrop-blur-lg bg-white/5 border-b border-white/10">

      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
      >
        Cogniview AI
      </h1>

      <div className="space-x-4">
        {token ? (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}