export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-black/40 backdrop-blur-xl text-gray-400">

      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

        {/* 🔥 BRAND */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              CogniView AI
            </span>
          </h2>

          <p className="text-sm leading-relaxed text-gray-400">
            AI-powered interview platform designed to evaluate, improve, and scale your technical skills.
          </p>

          {/* subtle glow line */}
          <div className="mt-4 h-[2px] w-20 bg-gradient-to-r from-[#E83464] to-[#8E2DE2] rounded-full"></div>
        </div>

        {/* 🔥 LINKS */}
        <div>
          <h3 className="text-white mb-4 font-semibold tracking-wide">
            Product
          </h3>

          <ul className="space-y-3 text-sm">
            <li className="hover:text-[#E83464] transition cursor-pointer">
              Dashboard
            </li>
            <li className="hover:text-[#8E2DE2] transition cursor-pointer">
              History
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Profile
            </li>
          </ul>
        </div>

        {/* 🔥 TECHNOLOGY */}
        <div>
          <h3 className="text-white mb-4 font-semibold tracking-wide">
            Technology
          </h3>

          <p className="text-sm text-gray-400 leading-relaxed">
            Powered by advanced LLMs, real-time evaluation, and intelligent scoring systems designed for modern AI-driven learning.
          </p>

          {/* mini highlight */}
          <div className="mt-4 text-xs text-gray-500">
            Built for performance, precision & growth 🚀
          </div>
        </div>
      </div>

      {/* 🔥 BOTTOM BAR */}
      <div className="text-center text-xs py-5 border-t border-white/10 text-gray-500">
        <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent font-medium">
          © {new Date().getFullYear()} CogniView AI
        </span>{" "}
        — AI Interview Platform
      </div>

    </footer>
  );
}