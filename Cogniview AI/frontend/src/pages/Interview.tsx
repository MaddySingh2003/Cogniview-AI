import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitAnswer } from "../api/api";

export default function Interview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(state.question);
  const [answer, setAnswer] = useState<any>("");

  const handleSubmit = async () => {
    try {
      const res = await submitAnswer({
        sessionId: state.sessionId,
        answer
      });

      if (res.data.isFinished) {
        navigate("/result", { state: { sessionId: state.sessionId } });
      } else {
        setQuestion(res.data.nextQuestion);
        setAnswer("");
      }

    } catch {
      alert("Submit failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-4">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[700px] shadow-lg">

        <h2 className="text-xl mb-4">{question.question}</h2>

        {question.type === "text" && (
          <textarea
            className="w-full p-3 rounded-lg text-black"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
        >
          Submit Answer
        </button>

      </div>
    </div>
  );
}