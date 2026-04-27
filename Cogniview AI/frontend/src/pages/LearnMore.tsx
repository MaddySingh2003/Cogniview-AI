import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
     
      <div className="absolute inset-0 bg-black/68" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-28">

        {/* HERO */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-[#E83464] to-[#8E2DE2] bg-clip-text text-transparent">
              CogniView AI
            </span>
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto">
            CogniView AI is a modern interview preparation platform designed to
            simulate real-world technical interviews and provide structured,
            AI-driven feedback to help you improve efficiently.
          </p>
        </div>

        {/* 🔥 OVERVIEW */}
        <div className="grid md:grid-cols-2 gap-10 mb-24">

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              What the platform does
            </h3>
            <p className="text-gray-300 text-sm">
              It creates realistic interview scenarios tailored to your role and
              skill level, evaluates your responses using AI, and provides
              actionable feedback to improve your performance over time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Who it is for
            </h3>
            <p className="text-gray-300 text-sm">
              Students, developers, and professionals preparing for technical
              interviews who want structured practice and measurable improvement.
            </p>
          </div>

        </div>

        {/* 🔥 FEATURES */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                title: "AI Interview Simulation",
                desc: "Practice with dynamic questions based on role and difficulty.",
              },
              {
                title: "Structured Evaluation",
                desc: "Get clear scoring based on understanding, clarity, and depth.",
              },
              {
                title: "Progress Tracking",
                desc: "Monitor improvement across multiple sessions over time.",
              },
              {
                title: "Topic Insights",
                desc: "Identify strengths and weak areas across different topics.",
              },
              {
                title: "Adaptive Questions",
                desc: "Difficulty adjusts based on your performance.",
              },
              {
                title: "Resume-Based Input",
                desc: "Questions can align with your experience and projects.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/20 rounded-xl p-5 backdrop-blur-md hover:scale-105 transition"
              >
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>

        {/* 🔥 WHY DIFFERENT */}
        <div className="mb-24">
          <h2 className="text-3xl font-semibold mb-10 text-center">
            What makes it different
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <h4 className="font-semibold mb-2 text-white">
                Not just practice
              </h4>
              <p className="text-gray-400 text-sm">
                Most platforms only provide questions. CogniView AI focuses on
                evaluation and improvement, which is where real growth happens.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
              <h4 className="font-semibold mb-2 text-white">
                Meaning-based evaluation
              </h4>
              <p className="text-gray-400 text-sm">
                Instead of keyword matching, responses are analyzed based on
                meaning and structure.
              </p>
            </div>

          </div>
        </div>

        {/* 🔥 FLOW */}
        <div className="text-center mb-24">
          <h2 className="text-3xl font-semibold mb-8">
            How it works
          </h2>

          <div className="flex flex-wrap justify-center gap-4 text-sm">

            {[
              "Select Role",
              "Start Interview",
              "Answer Questions",
              "AI Evaluation",
              "Feedback & Growth",
            ].map((step, i) => (
              <div
                key={i}
                className="px-5 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
              >
                {step}
              </div>
            ))}

          </div>
        </div>

        {/* 🔥 CTA */}
        <div className="text-center">
          <h3 className="text-xl mb-4">
            Ready to start your preparation?
          </h3>

          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] font-semibold hover:scale-105 transition"
          >
            Start AI Interview →
          </button>
        </div>

      </div>

      {/* FADE */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/90 to-transparent" />

    </div>
  );
}