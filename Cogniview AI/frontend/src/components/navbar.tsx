import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/WevIcon.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-5 py-4 flex items-center justify-between backdrop-blur-xl bg-black/50 border-b border-white/10">

        {/* LEFT */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src={logo}
            alt="CogniView"
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-white text-base font-semibold tracking-wide">
            Cogni<span className="text-[#8E2DE2]">View</span>{" "}
            <span className="text-fuchsia-500">AI</span>
          </span>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center  gap-8 text-sm font-medium text-gray-300">
          <button onClick={() => navigate("/")} className="font-extrabold text-fuchsia-700 hover:text-white">
            Home
          </button>

          {token && (
            <button
              onClick={() => navigate("/history")}
              className= " hover:text-white font-extrabold text-fuchsia-700"
            >
              History
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* PROFILE */}
          {token && (
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
            >
              👤
            </button>
          )}

          {/* LOGIN / LOGOUT */}
          {!token ? (
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:block px-4 py-2 bg-white text-black rounded-full text-sm font-semibold"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 bg-red-500/90 text-white rounded-full text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setOpen(!open)}
          >
            <span className="w-5 h-[2px] bg-white" />
            <span className="w-5 h-[2px] bg-white" />
            <span className="w-5 h-[2px] bg-white" />
          </button>
        </div>
      </nav>

      {/* 🔥 OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 MOBILE MENU */}
      <div
        className={`fixed top-16 left-0 w-full z-50 md:hidden transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="mx-4 rounded-2xl bg-[#0B0F1A]/95 border border-white/10 backdrop-blur-xl shadow-xl p-6 space-y-5">

          {/* NAV LINKS */}
          <button
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
            className="block w-full text-left text-lg text-white"
          >
            Home
          </button>

          {token && (
            <>
              <button
                onClick={() => {
                  navigate("/history");
                  setOpen(false);
                }}
                className="block w-full text-left text-lg text-white"
              >
                History
              </button>

              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="block w-full text-left text-lg text-white"
              >
                Profile
              </button>
            </>
          )}

          {/* ACTION */}
          <div className="pt-4 border-t border-white/10">
            {!token ? (
              <button
                onClick={() => {
                  navigate("/auth");
                  setOpen(false);
                }}
                className="w-full py-3 rounded-full bg-white text-black font-semibold"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-full bg-red-500/90 text-white font-semibold"
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}