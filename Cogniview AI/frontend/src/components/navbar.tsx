import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/10">

      {/* 🔥 LEFT LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="flex items-end gap-[2px]">
          <div className="w-[6px] h-5 bg-[#E83464]" />
          <div className="w-[6px] h-3 bg-[#E83464]" />
          <div className="w-[6px] h-7 bg-gradient-to-t from-[#8E2DE2] to-[#E83464]" />
        </div>
        <span className="text-white text-lg font-semibold">
          CogniView
        </span>
      </div>

      {/* 🔥 CENTER NAV */}
      <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300">

        <button
          onClick={() => navigate("/")}
          className="hover:text-white transition"
        >
          Home
        </button>

        {token && (
          <button
            onClick={() => navigate("/history")}
            className="hover:text-white transition"
          >
            History
          </button>
        )}
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* PROFILE ICON (REPLACED BUTTON) */}
        {token && (
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
          >
            <span className="text-sm font-semibold">👤</span>
          </button>
        )}

        {/* LOGIN / LOGOUT */}
        {!token ? (
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}

        {/* MOBILE MENU */}
        <button
          className="md:hidden flex flex-col gap-1 ml-2"
          onClick={() => setOpen(!open)}
        >
          <span className="w-5 h-[2px] bg-white"></span>
          <span className="w-5 h-[2px] bg-white"></span>
          <span className="w-5 h-[2px] bg-white"></span>
        </button>
      </div>

      {/* 🔥 MOBILE DROPDOWN */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl flex flex-col items-center gap-5 py-6 md:hidden">

          <button onClick={() => navigate("/")}>Home</button>

          {token && (
            <button onClick={() => navigate("/history")}>
              History
            </button>
          )}

          {token && (
            <button onClick={() => navigate("/profile")}>
              Profile
            </button>
          )}

          {!token ? (
            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-2 bg-white text-black rounded-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}