import { useEffect, useRef } from "react";

export default function Vision() {
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            // 🔥 IMPORTANT: stop observing after first trigger
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
    <section id="vision" className=" bg-black/30 border-white/20 py-32 px-6 border-t ">
      <div className="max-w-[1200px]  mx-auto">

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* LEFT */}
          <div
            ref={addRef}
            className="lg:w-1/3 sticky top-32 fade"
          >
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

          {/* RIGHT */}
          <div className="lg:w-2/3 space-y-12">

            <p
              ref={addRef}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed fade"
              style={{ transitionDelay: "0.1s" }}
            >
              Most candidates prepare blindly.
              <span className="text-white font-semibold"> CogniView AI </span>
              simulates real interview scenarios and gives structured,
              actionable feedback — so you improve faster with every session.
            </p>

            {/* FEATURES */}
            <div className="grid md:grid-cols-2 gap-10 pt-6">

              {[
                {
                  icon: "🎯",
                  title: "Real Interview Simulation",
                  desc: "Experience structured interviews with real-world questions and difficulty levels.",
                  color: "#E83464",
                },
                {
                  icon: "📊",
                  title: "Instant AI Feedback",
                  desc: "Get detailed evaluation, scoring, and improvement suggestions instantly.",
                  color: "#8E2DE2",
                },
                {
                  icon: "⚡",
                  title: "Adaptive Difficulty",
                  desc: "Questions evolve based on your performance and skill level.",
                  color: "#E83464",
                },
                {
                  icon: "📁",
                  title: "Resume-Based Questions",
                  desc: "AI tailors interview questions based on your uploaded resume.",
                  color: "#8E2DE2",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={addRef}
                  className="border-l border-white/20 pl-6 fade hover:scale-[1.03] transition"
                  style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div className="mb-4 text-2xl" style={{ color: item.color }}>
                    {item.icon}
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h4>

                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}

            </div>
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