import { useState } from "react";
import axios from "axios";

type AnswerResult = {
  score: number;
  feedback: string;
};

type FinalAnswer = {
  question: string;
  answer: string;
  score: number;
  feedback: string;
};

type FinalResult = {
  averageScore: number;
  totalQuestions: number;
  answers: FinalAnswer[];
};

type Analytics = {
  topicPerformance: Record<string, number>;
  weakAreas: string[];
};

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");

  const [result, setResult] = useState<AnswerResult | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const BACKEND_URL = "http://localhost:3001";

  const startInterview = async () => {
    const res = await axios.post(`${BACKEND_URL}/start`);
    setSessionId(res.data.sessionId);
    setQuestions(res.data.questions);
    setCurrentIndex(0);
    setFinalResult(null);
    setAnalytics(null);
    setResult(null);
  };

  const submitAnswer = async () => {
    if (!sessionId) return;

    const question = questions[currentIndex];

    const res = await axios.post(`${BACKEND_URL}/answer`, {
      sessionId,
      question,
      answer,
    });

    setResult(res.data);

    const nextIndex = currentIndex + 1;

    if (nextIndex < questions.length) {
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setAnswer("");
        setResult(null);
      }, 1200);
    } else {
      const finalRes = await axios.get(`${BACKEND_URL}/result/${sessionId}`);
      setFinalResult(finalRes.data);

      const analyticsRes = await axios.get(
        `${BACKEND_URL}/analytics/${sessionId}`
      );
      setAnalytics(analyticsRes.data);
    }
  };

  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  // 🟢 START SCREEN
  if (!sessionId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">🎤 AI Mock Interview</h1>
          <p className="text-gray-500 mb-6">
            Practice with real-time feedback & analytics
          </p>
          <button
            onClick={startInterview}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  // 🟣 FINAL RESULT SCREEN
  if (finalResult) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
          <h1 className="text-3xl font-bold mb-4">📊 Final Report</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Average Score:{" "}
              <span className="text-blue-600">
                {finalResult.averageScore}
              </span>
            </h2>
          </div>

          {finalResult.answers.map((a, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 mb-4 bg-gray-50"
            >
              <p className="font-semibold">Q: {a.question}</p>
              <p className="text-gray-600 mt-1">
                Your Answer: {a.answer}
              </p>
              <p className="mt-2 text-sm">Score: {a.score}</p>
              <p className="text-sm text-gray-500">{a.feedback}</p>
            </div>
          ))}

          {analytics && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-3">📈 Analytics</h2>

              <div className="mb-4">
                <h3 className="font-semibold">Topic Performance</h3>
                {Object.entries(analytics.topicPerformance).map(
                  ([topic, score]) => (
                    <div key={topic} className="flex justify-between">
                      <span>{topic}</span>
                      <span>{score}</span>
                    </div>
                  )
                )}
              </div>

              <div>
                <h3 className="font-semibold">Weak Areas</h3>
                {analytics.weakAreas.length === 0 ? (
                  <p className="text-green-600">None 🎉</p>
                ) : (
                  analytics.weakAreas.map((w, i) => (
                    <p key={i} className="text-red-500">
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

  // 🔵 INTERVIEW SCREEN
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow">

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded mb-4">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-sm text-gray-500 mb-2">
          Question {currentIndex + 1} / {questions.length}
        </h2>

        <h3 className="text-lg font-semibold mb-4">
          {questions[currentIndex]}
        </h3>

        <textarea
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
        />

        <button
          onClick={submitAnswer}
          disabled={!answer}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Answer
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
            <p className="font-semibold">Score: {result.score}</p>
            <p className="text-gray-600">{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;