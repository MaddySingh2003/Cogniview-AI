export default function Vision() {
  return (
    <section id="vision" className="py-32 px-6 border-t x bg-black/40    border-white/10">
      <div className="max-w-[1200px] mx-auto">

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* LEFT STICKY */}
          <div className="lg:w-1/3 sticky top-32">
            <span className="text-sm tracking-widest uppercase mb-4 block text-[#E83464]">
              01 — The Problem
            </span>

            <h3 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Practice without <br />
              <span className="text-gray-500">
                real feedback fails.
              </span>
            </h3>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:w-2/3 space-y-12">

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Most candidates prepare blindly. 
              <span className="text-white font-semibold">
                {" "}CogniView AI{" "}
              </span>
              simulates real interview scenarios and gives structured, 
              actionable feedback — so you improve faster with every session.
            </p>

            {/* FEATURES */}
            <div className="grid md:grid-cols-2 gap-10 pt-6">

              {/* CARD 1 */}
              <div className="border-l border-white/20 pl-6 hover:border-[#E83464] transition">
                <div className="mb-4 text-[#E83464] text-2xl">🎯</div>

                <h4 className="text-xl font-semibold text-white mb-2">
                  Real Interview Simulation
                </h4>

                <p className="text-gray-400">
                  Experience structured interviews with real-world questions and difficulty levels.
                </p>
              </div>

              {/* CARD 2 */}
              <div className="border-l border-white/20 pl-6 hover:border-[#8E2DE2] transition">
                <div className="mb-4 text-[#8E2DE2] text-2xl">📊</div>

                <h4 className="text-xl font-semibold text-white mb-2">
                  Instant AI Feedback
                </h4>

                <p className="text-gray-400">
                  Get detailed evaluation, scoring, and improvement suggestions instantly.
                </p>
              </div>

              {/* CARD 3 */}
              <div className="border-l border-white/20 pl-6 hover:border-[#E83464] transition">
                <div className="mb-4 text-[#E83464] text-2xl">⚡</div>

                <h4 className="text-xl font-semibold text-white mb-2">
                  Adaptive Difficulty
                </h4>

                <p className="text-gray-400">
                  Questions evolve based on your performance and skill level.
                </p>
              </div>

              {/* CARD 4 */}
              <div className="border-l border-white/20 pl-6 hover:border-[#8E2DE2] transition">
                <div className="mb-4 text-[#8E2DE2] text-2xl">📁</div>

                <h4 className="text-xl font-semibold text-white mb-2">
                  Resume-Based Questions
                </h4>

                <p className="text-gray-400">
                  AI tailors interview questions based on your uploaded resume.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}