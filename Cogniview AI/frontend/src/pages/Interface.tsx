export default function Interface() {
  return (
    <section className="py-32 px-6 relative overflow-hidden ">

      {/* 🔥 SUBTLE BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E83464]/10 to-[#8E2DE2]/10 blur-3xl opacity-30" />

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* 🔥 HEADER */}
        <div className="text-center mb-20">
          <span className="text-sm tracking-widest uppercase mb-4 block text-[#E83464]">
            Live Preview
          </span>

          <h3 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Experience the
            <br />
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              interview interface.
            </span>
          </h3>
        </div>

        {/* 🔥 MOCK INTERFACE */}
        <div className="max-w-4xl mx-auto border border-white/10 rounded-3xl bg-[#0b0b14] shadow-2xl overflow-hidden">

          {/* TOP BAR */}
          <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E83464]/70"></div>
            <div className="w-3 h-3 rounded-full bg-[#8E2DE2]/70"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>

          {/* CONTENT */}
          <div className="p-8 md:p-12 space-y-6">

            {/* STATUS */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Interview in progress
            </div>

            {/* QUESTION */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">Question</p>
              <h4 className="text-white text-lg font-medium">
                Explain the purpose of an API in backend systems.
              </h4>
            </div>

            {/* ANSWER BOX */}
            <div className="bg-black/40 border border-white/10 p-6 rounded-xl text-gray-400">
              Typing your answer...
            </div>

            {/* FEEDBACK PREVIEW */}
            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                <p className="text-sm text-gray-400">Score</p>
                <p className="text-2xl font-semibold text-green-400">
                  8.5 / 10
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                <p className="text-sm text-gray-400">Feedback</p>
                <p className="text-sm text-gray-300">
                  Good explanation, add real-world example for better clarity.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}