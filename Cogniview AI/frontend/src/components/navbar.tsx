import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-lg border-b border-white/20">

      {/* LEFT: LOGO + NAME */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        {/* LOGO */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-black">
          AI
        </div>

        {/* NAME */}
        <h1 className="text-xl font-bold tracking-wide">
          Cogniview AI
        </h1>
      </div>

      {/* CENTER: NAV LINKS */}
      {token && (
        <div className="hidden md:flex gap-6 text-sm">
          <button
            onClick={() => navigate("/")}
            className={`hover:text-cyan-300 ${
              location.pathname === "/" ? "text-cyan-300" : ""
            }`}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/result")}
            className="hover:text-cyan-300"
          >
            Results
          </button>
        </div>
      )}

      {/* RIGHT: AUTH */}
      <div className="flex items-center gap-3">

        {!token ? (
          <button
            onClick={() => navigate("/auth")}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold"
          >
            Login
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/")}
              className="hidden md:block px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
            >
              New Interview
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </div>
  );
}