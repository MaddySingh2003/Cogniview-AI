import { useState } from "react";
import axios from "axios";

type Question = {
  type: "text" | "mcq" | "msq";
  question: string;
  options?: string[];
};

type AnswerResult = {
  score: number;
  feedback: string;
};

type FinalResult = {
  averageScore: number;
  totalQuestions: number;
  answers: {
    question: string;
    answer: any;
    score: number;
    feedback: string;
  }[];
};

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState<any>("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const startInterview = async () => {
    const res = await axios.post("http://localhost:3001/start");
    setSessionId(res.data.sessionId);
    setQuestions(res.data.questions);
    setCurrentIndex(0);
    setAnswer("");
    setFinalResult(null);
    setAnalytics(null);
  };

  const fetchAnalytics = async (id: string) => {
    const res = await axios.get(`http://localhost:3001/analytics/${id}`);
    setAnalytics(res.data);
  };

  const submitAnswer = async () => {
    if (!sessionId) return;

    const currentQ = questions[currentIndex];

    const res = await axios.post("http://localhost:3001/answer", {
      sessionId,
      questionObj: currentQ,
      answer,
    });

    setResult(res.data);

    const nextIndex = currentIndex + 1;

    setTimeout(async () => {
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setAnswer(questions[nextIndex].type === "msq" ? [] : "");
        setResult(null);
      } else {
        const finalRes = await axios.get(
          `http://localhost:3001/result/${sessionId}`
        );
        setFinalResult(finalRes.data);
        await fetchAnalytics(sessionId);
      }
    }, 1200);
  };

  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  // 🟢 START SCREEN
  if (!sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">🎤 AI Mock Interview</h1>
          <button
            onClick={startInterview}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // 🏁 FINAL SCREEN
  if (finalResult) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold mb-4">📊 Final Report</h1>

          <p className="text-lg mb-4">
            Average Score:{" "}
            <span className="text-blue-600 font-bold">
              {finalResult.averageScore}
            </span>
          </p>

          {finalResult.answers.map((a, i) => (
            <div key={i} className="border p-4 rounded-xl mb-3 bg-gray-50">
              <p className="font-semibold">{a.question}</p>
              <p className="text-sm mt-1">Score: {a.score}</p>
              <p className="text-gray-600 text-sm">{a.feedback}</p>
            </div>
          ))}

          {analytics && (
            <div className="mt-6">
              <h2 className="font-bold text-lg">📈 Analytics</h2>

              <div className="mt-2">
                {Object.entries(analytics.topicPerformance).map(
                  ([topic, score]: any) => (
                    <div
                      key={topic}
                      className="flex justify-between text-sm"
                    >
                      <span>{topic}</span>
                      <span>{score}</span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-semibold">Weak Areas</h3>
                {analytics.weakAreas.length === 0 ? (
                  <p className="text-green-600">None 🎉</p>
                ) : (
                  analytics.weakAreas.map((w: string, i: number) => (
                    <p key={i} className="text-red-500 text-sm">
                      {w}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow">

        {/* Progress */}
        <div className="w-full bg-gray-200 h-2 rounded mb-4">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </p>

        <h2 className="text-lg font-semibold mb-4">
          {currentQ.question}
        </h2>

        {/* TEXT */}
        {currentQ.type === "text" && (
          <textarea
            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {/* MCQ */}
        {currentQ.type === "mcq" &&
          currentQ.options?.map((opt) => (
            <div
              key={opt}
              onClick={() => setAnswer(opt)}
              className={`p-3 border rounded-xl mb-2 cursor-pointer ${
                answer === opt
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              {opt}
            </div>
          ))}

        {/* MSQ */}
        {currentQ.type === "msq" &&
          currentQ.options?.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                if (answer.includes(opt)) {
                  setAnswer(answer.filter((a: string) => a !== opt));
                } else {
                  setAnswer([...answer, opt]);
                }
              }}
              className={`p-3 border rounded-xl mb-2 cursor-pointer ${
                answer.includes(opt)
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              {opt}
            </div>
          ))}

        <button
          onClick={submitAnswer}
          disabled={
            currentQ.type === "text"
              ? !answer
              : Array.isArray(answer)
              ? answer.length === 0
              : !answer
          }
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Answer
        </button>

        {/* Feedback */}
        {result && (
          <div className="mt-4 p-3 bg-gray-50 border rounded-xl">
            <p className="font-semibold">Score: {result.score}</p>
            <p className="text-sm text-gray-600">{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;