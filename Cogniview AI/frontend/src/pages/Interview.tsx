import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitAnswer } from "../api/api";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(state?.question);
  const [answer, setAnswer] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const sessionId = state?.sessionId;

  const handleSubmit = async () => {
    try {
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        alert("Please select or write an answer");
        return;
      }

      setLoading(true);

      const res = await submitAnswer({
        sessionId,
        answer
      });

      if (res.data.isFinished) {
        navigate("/result", { state: { sessionId } });
      } else {
        setQuestion(res.data.nextQuestion);
        setAnswer("");
      }

    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!question)
    return <p className="mt-20 text-center text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen text-white flex justify-center items-center px-6 pt-20 relative overflow-hidden">

      {/* 🔥 AMBIENT BACKGROUND */}
      <div className="absolute inset-0 bg-[#070B14]" />

      {/* floating glow orbs */}
      <div className="absolute w-[400px] h-[400px] bg-[#E83464]/20 blur-[120px] rounded-full -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-[#8E2DE2]/20 blur-[120px] rounded-full -bottom-40 -right-40 animate-pulse" />

      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(to_right,white_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 🔥 MAIN CARD */}
      <div className="relative z-10 w-full max-w-3xl">

        {/* PROGRESS BAR (visual only) */}
        <div className="mb-6">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-[#E83464] to-[#8E2DE2] animate-pulse" />
          </div>
        </div>

        {/* GLASS CARD */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(142,45,226,0.15)]">

          {/* META */}
          <div className="flex flex-wrap gap-3 mb-6 text-xs">

            <span className="px-3 py-1 rounded-full bg-[#8E2DE2]/20 border border-[#8E2DE2]/40">
              {question.type?.toUpperCase()}
            </span>

            <span className="px-3 py-1 rounded-full bg-[#E83464]/20 border border-[#E83464]/40">
              {question.difficulty?.toUpperCase()}
            </span>

            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
              {question.topic || "General"}
            </span>

          </div>

          {/* QUESTION */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 leading-relaxed">
            {question.question}
          </h2>

          {/* TEXT ANSWER */}
          {question.type === "text" && (
            <textarea
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 
              focus:outline-none focus:ring-2 focus:ring-[#8E2DE2] transition"
              rows={5}
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}

          {/* MCQ */}
          {question.type === "mcq" && (
            <div className="space-y-3">
              {question.options.map((opt: string) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    answer === opt
                      ? "bg-gradient-to-r from-[#E83464]/20 to-[#8E2DE2]/20 border-[#8E2DE2]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="mcq"
                    checked={answer === opt}
                    onChange={() => setAnswer(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* MSQ */}
          {question.type === "msq" && (
            <div className="space-y-3">
              {question.options.map((opt: string) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    Array.isArray(answer) && answer.includes(opt)
                      ? "bg-gradient-to-r from-[#E83464]/20 to-[#8E2DE2]/20 border-[#E83464]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Array.isArray(answer) && answer.includes(opt)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAnswer((prev: any) => [...(prev || []), opt]);
                      } else {
                        setAnswer((prev: any) =>
                          prev.filter((a: string) => a !== opt)
                        );
                      }
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-8 py-3 rounded-full font-semibold text-lg 
            bg-gradient-to-r from-[#E83464] to-[#8E2DE2] 
            hover:opacity-90 transition flex items-center justify-center"
          >
            {loading ? (
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluating...
              </div>
            ) : (
              "Submit Answer →"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}