import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { submitAnswer } from "../api/api";

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ SAFE STATE EXTRACTION
  const sessionId = location.state?.sessionId;
  const initialQuestion = location.state?.question;

  const [question, setQuestion] = useState<any>(initialQuestion);
  const [answer, setAnswer] = useState<any>("");

  // ❗ CRITICAL: handle page refresh / missing state
  useEffect(() => {
    if (!sessionId || !initialQuestion) {
      alert("Session expired. Please start again.");
      navigate("/");
    }
  }, []);

  const handleSubmit = async () => {
    // ✅ VALIDATION
    if (
      !answer ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      alert("Please answer before submitting");
      return;
    }

    try {
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
      alert("Submission failed");
    }
  };

  if (!question) return null;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-[600px] shadow-lg">

        {/* QUESTION */}
        <h2 className="text-xl font-semibold mb-2">
          {question.question}
        </h2>

        {/* TOPIC + TYPE */}
        <p className="text-sm text-gray-300 mb-4">
          Topic: {question.topic} | Type: {question.type}
        </p>

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
                  } else {
                    setAnswer((prev: any) =>
                      prev.filter((x: string) => x !== opt)
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
          className="mt-4 w-full bg-white text-purple-600 py-3 rounded-lg font-bold"
        >
          Submit
        </button>
      </div>
    </div>
  );
}