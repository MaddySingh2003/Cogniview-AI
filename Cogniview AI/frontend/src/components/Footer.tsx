export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#050810] text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">CogniView AI</h2>
          <p className="text-sm leading-relaxed">
            AI-powered interview platform designed to evaluate, improve, and scale your technical skills.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white mb-3 font-semibold">Product</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">History</li>
            <li className="hover:text-white cursor-pointer">Profile</li>
          </ul>
        </div>

        {/* Tech vibe */}
        <div>
          <h3 className="text-white mb-3 font-semibold">Technology</h3>
          <p className="text-sm">
            Powered by LLMs, real-time evaluation, and intelligent scoring systems.
          </p>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t border-white/10">
        © {new Date().getFullYear()} CogniView AI — AI Interview Platform
      </div>
      
    </footer>
  );
}