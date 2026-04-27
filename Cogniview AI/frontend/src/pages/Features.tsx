export default function Features() {
  return (
    <section className="bg-[#050510] py-32 px-6" id="features">

      <div className="max-w-[1200px] mx-auto">

        {/* 🔥 HEADER */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end">

          <h3 className="text-4xl md:text-6xl font-semibold leading-tight text-white">
            Built for real <br />
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              interview mastery.
            </span>
          </h3>

          <p className="text-lg text-gray-400 max-w-md mt-6 md:mt-0">
            Everything you need to simulate, evaluate, and improve your interview performance.
          </p>
        </div>

        {/* 🔥 GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[750px]">

          {/* 🔥 BIG CARD */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl p-10 relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl group">

            {/* BG GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />

            {/* IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop"
              alt="AI Interview"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition duration-700"
            />

            {/* CONTENT */}
            <div className="relative z-20 flex flex-col justify-between h-full">

              <div className="flex justify-between items-center">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">
                  CORE SYSTEM
                </span>
                <span className="text-white text-xl">⚡</span>
              </div>

              <div>
                <h4 className="text-3xl font-semibold text-white mb-3">
                  Real Interview Simulation
                </h4>

                <p className="text-lg text-gray-300 max-w-lg">
                  Experience realistic interview environments with structured questions, 
                  adaptive difficulty, and role-based scenarios.
                </p>
              </div>

            </div>
          </div>

          {/* 🔥 CARD 2 */}
          <div className="rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:bg-white/10 transition">

            <div className="text-3xl text-[#E83464] mb-6">📊</div>

            <div>
              <h4 className="text-2xl font-semibold text-white mb-2">
                AI Evaluation
              </h4>

              <p className="text-gray-400">
                Get instant feedback, scoring, and improvement insights after every response.
              </p>
            </div>

          </div>

          {/* 🔥 CARD 3 */}
          <div className="rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#E83464] to-[#8E2DE2]">

            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="text-3xl mb-6 relative z-10">📁</div>

            <div className="relative z-10">
              <h4 className="text-2xl font-semibold text-white mb-2">
                Resume Intelligence
              </h4>

              <p className="text-white/80">
                AI generates personalized questions based on your resume and experience.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}