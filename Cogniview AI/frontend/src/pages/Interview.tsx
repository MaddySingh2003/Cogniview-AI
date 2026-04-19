import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { submitAnswer } from "../api/api";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState<any>("");

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }
    setQuestion(state.question);
  }, []);

  if (!question) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const handleSubmit = async () => {
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      alert("Please answer the question");
      return;
    }

    const res = await submitAnswer({
      sessionId: state.sessionId,
      answer
    });

    if (res.data.isFinished) {
      navigate("/result", { state: { sessionId: state.sessionId } });
    } else {
      setQuestion(res.data.nextQuestion);
      setAnswer(""); // reset
    }
  };

  // 🔥 Helper for label
  const getTypeLabel = (type: string) => {
    if (type === "text") return "Text Question";
    if (type === "mcq") return "MCQ (Single Choice)";
    if (type === "msq") return "MSQ (Multiple Choice)";
    return "Question";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[600px] shadow-lg">

        {/* TYPE + TOPIC */}
        <div className="flex justify-between mb-2 text-sm opacity-80">
          <span>{getTypeLabel(question.type)}</span>
          <span>{question.topic} • {question.difficulty}</span>
        </div>

        {/* QUESTION */}
        <h2 className="text-xl font-semibold mb-4">
          {question.question}
        </h2>

        {/* ================= TEXT ================= */}
        {question.type === "text" && (
          <textarea
            className="w-full p-3 rounded-lg text-black"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* ================= MCQ ================= */}
        {question.type === "mcq" &&
          question.options.map((opt: string, i: number) => (
            <label key={i} className="block mb-2">
              <input
                type="radio"
                name="mcq"
                checked={answer === opt}
                onChange={() => setAnswer(opt)}
              />{" "}
              {opt}
            </label>
          ))}

        {/* ================= MSQ ================= */}
        {question.type === "msq" &&
          question.options.map((opt: string, i: number) => (
            <label key={i} className="block mb-2">
              <input
                type="checkbox"
                checked={answer?.includes?.(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAnswer((prev: string[]) => [...(prev || []), opt]);
                  } else {
                    setAnswer((prev: string[]) =>
                      prev.filter((a) => a !== opt)
                    );
                  }
                }}
              />{" "}
              {opt}
            </label>
          ))}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-white text-purple-600 py-3 rounded-lg font-bold"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}