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
    <nav className="absolute top-0 w-full z-50 px-6 py-5 flex justify-between items-center text-sm">

      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="flex items-end gap-[2px]">
          <div className="w-[6px] h-5 bg-[#E83464]" />
          <div className="w-[6px] h-3 bg-[#E83464]" />
          <div className="w-[6px] h-7 bg-gradient-to-t from-[#8E2DE2] to-[#E83464]" />
        </div>
        <span className="text-white text-2xl font-bold">CogniView AI</span>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-3">

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 text-gray-300 hover:text-white"
        >
          Home
        </button>

        {token && (
          <button
            onClick={() => navigate("/history")}
            className="px-5 py-2 text-gray-300 hover:text-white"
          >
            History
          </button>
        )}

        {token && (
          <button
            onClick={() => navigate("/profile")}
            className="px-5 py-2 text-gray-300 hover:text-white"
          >
            Profile
          </button>
        )}

        {!token ? (
          <button
            onClick={() => navigate("/auth")}
            className="px-5 py-2 bg-white text-black rounded-full font-semibold"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-500 text-white rounded-full"
          >
            Logout
          </button>
        )}
      </div>

      {/* MOBILE HAMBURGER */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)}>
          <div className="space-y-1">
            <span className="block w-6 h-[2px] bg-white"></span>
            <span className="block w-6 h-[2px] bg-white"></span>
            <span className="block w-6 h-[2px] bg-white"></span>
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-black/95 backdrop-blur-md flex flex-col items-center gap-5 py-6 md:hidden">

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