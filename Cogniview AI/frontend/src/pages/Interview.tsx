import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitAnswer } from "../api/api";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(state?.question);
  const [answer, setAnswer] = useState<any>("");

  const sessionId = state?.sessionId;

  const handleSubmit = async () => {
    try {
      if (!sessionId) {
        alert("Session expired");
        navigate("/auth");
        return;
      }

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

    } catch (err: any) {
      console.error("Submit error:", err);
      alert("Failed to submit answer");
    }
  };

  if (!question) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[700px] shadow-lg">

        {/* 🔹 META INFO */}
        <div className="flex justify-between text-sm text-gray-300 mb-3">
          <span>Type: {question.type?.toUpperCase()}</span>
          <span>Difficulty: {question.difficulty}</span>
        </div>

        <div className="text-sm text-purple-300 mb-4">
          Topic: {question.topic}
        </div>

        {/* 🔹 QUESTION */}
        <h2 className="text-xl font-semibold mb-4">
          {question.question}
        </h2>

        {/* ================= TEXT ================= */}
        {question.type === "text" && (
          <textarea
            className="w-full p-3 rounded-lg text-black"
            placeholder="Write your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* ================= MCQ ================= */}
        {question.type === "mcq" && (
          <div className="space-y-2">
            {question.options?.map((opt: string, i: number) => (
              <label key={i} className="block cursor-pointer">
                <input
                  type="radio"
                  name="mcq"
                  className="mr-2"
                  checked={answer === opt}
                  onChange={() => setAnswer(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* ================= MSQ ================= */}
        {question.type === "msq" && (
          <div className="space-y-2">
            {question.options?.map((opt: string, i: number) => (
              <label key={i} className="block cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={answer?.includes(opt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAnswer((prev: string[]) => [
                        ...(prev || []),
                        opt
                      ]);
                    } else {
                      setAnswer((prev: string[]) =>
                        prev.filter((a) => a !== opt)
                      );
                    }
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* 🔹 SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition"
        >
          Submit Answer
        </button>

      </div>
    </div>
  );
}