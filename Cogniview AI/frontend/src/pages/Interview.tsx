import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitAnswer } from "../api/api";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(state.question);
  const [answer, setAnswer] = useState<any>("");
  const sessionId = state.sessionId;

  const handleSubmit = async () => {
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
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[600px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {question.question}
        </h2>

        {/* TEXT */}
        {question.type === "text" && (
          <textarea
            className="w-full p-3 rounded-lg text-black"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* MCQ */}
        {question.type === "mcq" &&
          question.options.map((opt: string) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="mcq"
                onChange={() => setAnswer(opt)}
              />{" "}
              {opt}
            </label>
          ))}

        {/* MSQ */}
        {question.type === "msq" &&
          question.options.map((opt: string) => (
            <label key={opt} className="block">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setAnswer((prev: any) => [
                      ...(prev || []),
                      opt
                    ]);
                  }
                }}
              />{" "}
              {opt}
            </label>
          ))}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-white text-purple-600 py-3 rounded-lg font-bold"
        >
          Submit
        </button>
      </div>
    </div>
  );
}