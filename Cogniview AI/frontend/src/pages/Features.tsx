import { useEffect, useRef } from "react";

export default function Features() {
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            // 🔥 IMPORTANT: run only once
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    refs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  return (
    <section className="bg-[#26263d] py-32 px-6" id="features">

      <div className="max-w-[1100px] mx-auto">

        {/* HEADER */}
        <div ref={addRef} className="text-center mb-24 fade">
          <h3 className="text-4xl md:text-6xl font-semibold text-white leading-tight">
            How you actually
            <br />
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              get better.
            </span>
          </h3>

          <p className="text-gray-400 mt-6 max-w-xl mx-auto">
            A simple loop designed to simulate, evaluate, and improve your interview skills step by step.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="relative">

          {/* line */}
          <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E83464] to-[#8E2DE2] opacity-30" />

          <div className="space-y-24">

            {[1, 2, 3].map((step, i) => (
              <div
                key={i}
                ref={addRef}
                className="relative pl-16 fade"
                style={{ transitionDelay: `${i * 0.2}s` }}
              >

                {/* STEP DOT */}
                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] flex items-center justify-center text-white font-semibold shadow-lg">
                  {step}
                </div>

                {/* CONTENT */}
                {step === 1 && (
                  <>
                    <h4 className="text-2xl font-semibold text-white mb-3">
                      Start a Real Interview
                    </h4>
                    <p className="text-gray-400 max-w-xl mb-6">
                      Choose your role and difficulty. Experience realistic AI-driven interview questions.
                    </p>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-xl">
                      <p className="text-sm text-gray-300">
                        💬 “Explain the purpose of an API in backend systems.”
                      </p>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h4 className="text-2xl font-semibold text-white mb-3">
                      Get Instant AI Feedback
                    </h4>
                    <p className="text-gray-400 max-w-xl mb-6">
                      Your answers are evaluated in real-time with structured scoring and feedback.
                    </p>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-xl">
                      <p className="text-green-400 text-sm font-medium">Score: 8.5 / 10</p>
                      <p className="text-xs text-gray-400 mt-3">
                        ✔ Good understanding  
                        <br />
                        ✖ Add real-world example  
                      </p>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h4 className="text-2xl font-semibold text-white mb-3">
                      Improve & Repeat
                    </h4>
                    <p className="text-gray-400 max-w-xl mb-6">
                      Track your growth and continuously improve with smarter, adaptive questions.
                    </p>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-xl">
                      <p className="text-sm text-gray-300">
                        📈 Performance improved by +32% in last 5 sessions
                      </p>
                    </div>
                  </>
                )}

              </div>
            ))}

          </div>
        </div>

      </div>

      {/* 🔥 ANIMATION */}
      <style>
        {`
        .fade {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s ease;
        }

        .fade.show {
          opacity: 1;
          transform: translateY(0);
        }
        `}
      </style>
    </section>
  );
}