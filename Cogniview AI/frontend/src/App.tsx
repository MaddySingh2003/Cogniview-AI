import { useState } from "react";
import axios from "axios";

type AnswerResult = {
  score: number;
  feedback: string;
};

type FinalResult = {
  averageScore: number;
  totalQuestions: number;
  answers: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
};

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 🚀 Start Interview
  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3001/start");

      setSessionId(res.data.sessionId);
      setQuestions(res.data.questions);
      setCurrentIndex(0);
      setFinalResult(null);
      setResult(null);
      setAnswer("");

    } catch (error) {
      console.error(error);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Submit Answer
  const submitAnswer = async () => {
    if (!sessionId || !answer.trim()) {
      alert("Please enter an answer");
      return;
    }

    try {
      setLoading(true);

      const question = questions[currentIndex];

      const res = await axios.post("http://localhost:3001/answer", {
        sessionId,
        question,
        answer
      });

      setResult(res.data);

      const nextIndex = currentIndex + 1;

      if (nextIndex < questions.length) {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setAnswer("");
          setResult(null);
        }, 1000); // slight delay for UX
      } else {
        const finalRes = await axios.get(
          `http://localhost:3001/result/${sessionId}`
        );

        setFinalResult(finalRes.data);
      }

    } catch (error) {
      console.error(error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Restart
  const restart = () => {
    setSessionId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswer("");
    setResult(null);
    setFinalResult(null);
  };

  // 🟢 START SCREEN
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center w-[400px]">
          <h1 className="text-2xl font-bold mb-4">
            AI Mock Interview
          </h1>

          <button
            onClick={startInterview}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    );
  }

  // 🟢 FINAL RESULT SCREEN
  if (finalResult) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md w-[600px]">

          <h2 className="text-xl font-bold mb-4">
            Final Result
          </h2>

          <p className="mb-4 text-lg">
            Average Score:{" "}
            <span className="font-bold">
              {finalResult.averageScore}
            </span>
          </p>

          {finalResult.answers.map((a, i) => (
            <div key={i} className="mb-4 border-b pb-2">
              <p className="font-semibold">{a.question}</p>
              <p className="text-sm">Score: {a.score}</p>
              <p className="text-gray-600">{a.feedback}</p>
            </div>
          ))}

          <button
            onClick={restart}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Restart
          </button>

        </div>
      </div>
    );
  }

  // 🟢 INTERVIEW SCREEN
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-[600px]">

        <div className="mb-3 text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </div>

        <h2 className="text-lg font-semibold mb-3">
          {questions[currentIndex]}
        </h2>

        <textarea
          className="w-full border p-2 rounded"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button
          onClick={submitAnswer}
          disabled={loading}
          className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {result && (
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <p className="font-bold">Score: {result.score}</p>
            <p className="text-gray-600">{result.feedback}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;