import { useNavigate } from "react-router-dom";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B14] text-white px-6 md:px-20 py-20">

      {/* HERO */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          How Cogniview AI Works
        </h1>

        <p className="text-gray-400 text-lg">
          A smart interview system that evaluates your answers using AI,
          machine learning, and semantic understanding — not just keywords.
        </p>
      </div>

      {/* SECTION 1 */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 mb-20">

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-3">
            AI Question Generation
          </h3>
          <p className="text-gray-400">
            Questions are generated using advanced language models based on
            your selected role and difficulty. Each session is unique and
            structured to simulate real interviews.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-3">
            Intelligent Evaluation
          </h3>
          <p className="text-gray-400">
            Your answers are evaluated using a hybrid approach combining
            machine learning models and semantic similarity to understand
            meaning — not just exact matches.
          </p>
        </div>

      </div>

      {/* SECTION 2 */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-20">

        <div className="bg-white/5 p-5 rounded-lg">
          <h4 className="font-semibold mb-2">📊 Performance Tracking</h4>
          <p className="text-gray-400 text-sm">
            Track your progress across multiple interviews and understand
            how your skills improve over time.
          </p>
        </div>

        <div className="bg-white/5 p-5 rounded-lg">
          <h4 className="font-semibold mb-2">🧠 Topic Analysis</h4>
          <p className="text-gray-400 text-sm">
            Identify your strengths and weak areas across different
            technical topics like APIs, databases, and algorithms.
          </p>
        </div>

        <div className="bg-white/5 p-5 rounded-lg">
          <h4 className="font-semibold mb-2">⚡ Real-time Feedback</h4>
          <p className="text-gray-400 text-sm">
            Get instant scoring and feedback after each answer to improve
            faster and more effectively.
          </p>
        </div>

      </div>

      {/* SECTION 3 (SYSTEM FLOW) */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold mb-6">
          System Flow
        </h2>

        <p className="text-gray-400">
          Question Generation → User Answer → ML Evaluation → Feedback →
          Analytics Dashboard
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
        >
          Start Your Interview
        </button>
      </div>

    </div>
  );
}