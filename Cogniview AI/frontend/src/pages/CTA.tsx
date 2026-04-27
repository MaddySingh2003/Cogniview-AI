import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 bg-[#8989bb]">

      <div className="max-w-[1100px] mx-auto">

        {/* 🔥 MAIN BAND */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-[#0b0b14] to-[#050510] p-10 overflow-hidden">

          {/* subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E83464]/10 to-[#8E2DE2]/10 blur-2xl opacity-40" />

          <div className="relative z-10 grid md:grid-cols-3 gap-10 items-center">

            {/* 🔥 LEFT MESSAGE */}
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug">
                Consistency beats intensity.
                <br />
                <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
                  Small improvements compound.
                </span>
              </h2>

              <p className="text-gray-400 mt-4 max-w-lg">
                Every session builds clarity, confidence, and real interview readiness.
              </p>
            </div>

            {/* 🔥 RIGHT SIDE (STATS + SOFT ACTION) */}
            <div className="space-y-6">

              {/* mini stats */}
              <div className="flex justify-between text-sm text-gray-400">
                <span>Sessions</span>
                <span className="text-white font-medium">120+</span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Avg Score</span>
                <span className="text-white font-medium">8.2</span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Improvement</span>
                <span className="text-green-400 font-medium">+32%</span>
              </div>

              {/* subtle action */}
              <button
                onClick={() => navigate("/history")}
                className="w-full mt-4 py-2 text-sm border border-white/20 rounded-full text-white hover:bg-white/10 transition"
              >
                Review your progress →
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}