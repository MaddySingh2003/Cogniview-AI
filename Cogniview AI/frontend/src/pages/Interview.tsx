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
    <div className="min-h-screen bg-[#070B14] text-white flex justify-center items-center px-6 pt-20 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCI+PC9zdmc+')]" />
      <div className="absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-pink-600 opacity-20 blur-[120px] rounded-full" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">

        {/* HEADER META INFO */}
        <div className="flex flex-wrap gap-3 mb-6 text-xs">

          <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500">
            {question.type?.toUpperCase()}
          </span>

          <span className="px-3 py-1 rounded-full bg-pink-600/20 border border-pink-500">
            {question.difficulty?.toUpperCase()}
          </span>

          <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500">
            {question.topic || "General"}
          </span>

        </div>

        {/* QUESTION */}
        <h2 className="text-2xl font-semibold mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* TEXT */}
        {question.type === "text" && (
          <textarea
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  answer === opt
                    ? "bg-purple-600/30 border-purple-500"
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
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  Array.isArray(answer) && answer.includes(opt)
                    ? "bg-pink-600/30 border-pink-500"
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
          className="relative w-full mt-8 py-3 rounded-full font-semibold text-lg overflow-hidden group"
        >

          {/* BORDER */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E83464] to-[#8E2DE2] p-[2px]" />

          {/* INNER */}
          <span className="relative flex items-center justify-center rounded-full bg-[#070B14] px-6 py-3 group-hover:bg-transparent transition">

            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#E83464] to-[#8E2DE2] blur-xl transition" />

            {loading ? (
              <div className="flex gap-2 items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluating...
              </div>
            ) : (
              <span className="z-10">Submit Answer →</span>
            )}

          </span>

        </button>

      </div>
    </div>
  );
}